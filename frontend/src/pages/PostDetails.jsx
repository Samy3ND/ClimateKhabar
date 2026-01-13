import React, { useEffect, useState, useMemo } from "react"
import { useParams } from "react-router-dom"
import {
  Calendar,
  Clock,
  Loader2,
  Volume2,
  Languages,
  Sparkles,
  Share2,
  Download,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { AdSlot } from "@/components/shared/Advertise"
import CommentSection from "@/components/shared/CommentSection"
import PostCard from "@/components/shared/PostCard"

import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"

const LANGS = [
  { code: "en", label: "English" },
  { code: "ne", label: "Nepali" },
  { code: "ar", label: "Arabic" },
  { code: "tr", label: "Turkish" },
  { code: "fr", label: "French" },
  { code: "de", label: "German" },
  { code: "es", label: "Spanish" },
]

const PostDetails = () => {
  const { postSlug } = useParams()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [post, setPost] = useState(null)
  const [recentArticles, setRecentArticles] = useState(null)

  // AI Summary
  const [sumLoading, setSumLoading] = useState(false)
  const [summary, setSummary] = useState("")
  const [sumError, setSumError] = useState("")

  // Translate
  const [tgtLang, setTgtLang] = useState("en")
  const [tLoading, setTLoading] = useState(false)
  const [translatedHTML, setTranslatedHTML] = useState("")
  const [isTranslated, setIsTranslated] = useState(false)
  const [tError, setTError] = useState("")

  // Text-to-speech
  const [isSpeaking, setIsSpeaking] = useState(false)

  // preload voices (Chrome quirk)
  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = () => {}
    }
  }, [])

  // Fetch main article
  useEffect(() => {
    const loadPost = async () => {
      try {
        const res = await fetch(`/api/post/getposts?slug=${postSlug}`)
        const data = await res.json()
        if (!res.ok) throw new Error()
        setPost(data.posts[0])
      } catch {
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    loadPost()
  }, [postSlug])

  // Fetch recent posts
  useEffect(() => {
    const loadRecent = async () => {
      try {
        const res = await fetch(`/api/post/getposts?limit=3`)
        const data = await res.json()
        if (res.ok) setRecentArticles(data.posts)
      } catch {
        // ignore
      }
    }
    loadRecent()
  }, [])

  // Reading time based on plain text
  const readMinutes = useMemo(() => {
    const plain = (post?.content || "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()

    const words = plain.split(/\s+/).filter(Boolean).length
    return Math.max(1, Math.ceil(words / 225))
  }, [post?.content])

  // ============ HANDLERS ============

  // Summarize via backend
  const handleSummarize = async () => {
    if (!post?.content) return

    try {
      setSumLoading(true)
      setSumError("")
      setSummary("")

      const r = await fetch("/api/ai/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html: post.content, maxLen: 160 }),
      })

      const data = await r.json()
      if (!r.ok) throw new Error(data.error || "Summarization failed")

      setSummary(data.summary)
    } catch (err) {
      setSumError(err.message || "Summarization failed")
    } finally {
      setSumLoading(false)
    }
  }

  // Translate full HTML via backend
  const handleTranslate = async () => {
    if (!post?.content) return
    try {
      setTLoading(true)
      setTError("")
      setTranslatedHTML("")

      const r = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html: post.content, target: tgtLang }),
      })

      const data = await r.json()
      if (!r.ok) throw new Error(data.error || "Translation failed")

      setTranslatedHTML(data.html)
      setIsTranslated(true)
    } catch (err) {
      setTError(err.message || "Translation failed")
    } finally {
      setTLoading(false)
    }
  }

  // Text-to-speech (front-end only)
  const handleSpeak = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      alert("Text-to-speech is not supported in this browser.")
      return
    }

    const synth = window.speechSynthesis

    // If already speaking → stop
    if (synth.speaking) {
      synth.cancel()
      setIsSpeaking(false)
      return
    }

    const rawHTML = isTranslated ? translatedHTML : post?.content || ""
    const text = rawHTML
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()

    if (!text) return

    const utter = new SpeechSynthesisUtterance(text)
    const voices = synth.getVoices()
    const langCode = (isTranslated ? tgtLang : "en").toLowerCase()

    const voiceMatch =
      voices.find((v) => v.lang.toLowerCase().startsWith(langCode)) ||
      voices.find((v) => v.lang.toLowerCase().startsWith("en"))

    if (voiceMatch) utter.voice = voiceMatch

    utter.rate = 1
    utter.pitch = 1
    utter.volume = 1

    utter.onstart = () => setIsSpeaking(true)
    utter.onend = () => setIsSpeaking(false)
    utter.onerror = () => setIsSpeaking(false)

    synth.speak(utter)
  }

  // Share article
  const handleShare = async () => {
    const url = window.location.href
    const title = post?.title || "Climate article"
    const text = `Check out this article: ${title}`

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url })
      } catch {
        // user cancelled
      }
    } else if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(url)
        alert("Link copied to clipboard.")
      } catch {
        alert("Share is not supported in this browser.")
      }
    } else {
      alert("Share is not supported in this browser.")
    }
  }

  // Download as PDF (html2canvas + jsPDF, with proper margins on all pages)
// Download as PDF - Fixed multi-page version
const handleDownload = async () => {
  try {
    const element = document.getElementById("pdf-content")
    if (!element) {
      alert("PDF layout not found.")
      return
    }

    const pdf = new jsPDF("p", "mm", "a4")
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const margin = 15
    const contentWidth = pageWidth - margin * 2
    const contentHeight = pageHeight - margin * 2 // Usable height per page

    // Render element to canvas
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
    })

    const imgData = canvas.toDataURL("image/png")
    const imgProps = pdf.getImageProperties(imgData)
    const imgHeight = (imgProps.height * contentWidth) / imgProps.width // Scaled height

    let heightLeft = imgHeight
    let position = margin // Start with top margin

    // Add first page
    pdf.addImage(imgData, "PNG", margin, position, contentWidth, imgHeight)
    heightLeft -= contentHeight

    // Add additional pages if needed
    while (heightLeft > 0) {
      pdf.addPage()
      position = margin - (imgHeight - heightLeft) // Negative offset for continuation + top margin
      pdf.addImage(imgData, "PNG", margin, position, contentWidth, imgHeight)
      heightLeft -= contentHeight
    }

    const fileName =
      (post?.slug || post?.title?.slice(0, 40) || "climate-article")
        .toString()
        .replace(/[^a-z0-9\-]+/gi, "-")
        .toLowerCase() + ".pdf"

    pdf.save(fileName)
  } catch (err) {
    console.error("PDF download failed:", err)
    alert("Failed to generate PDF. Please try again.")
  }
}

  // ============ LOADING / ERROR ============

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen pt-16">
        <img
          src="https://cdn-icons-png.flaticon.com/128/39/39979.png"
          alt="loading"
          className="w-20 animate-spin"
        />
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="text-center py-20 text-red-600 font-semibold">
        Failed to load article
      </div>
    )
  }

  // ============ UI ============

  return (
    <main className="px-4 py-8 max-w-7xl mx-auto min-h-screen mt-16">
      {/* Heading */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6 max-w-4xl mx-auto">
          {post.title}
        </h1>

        <Button className="border-emerald-200 bg-emerald-50 text-emerald-700 rounded-full px-6 py-2">
          {post.category}
        </Button>

        {/* Meta row */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-6 text-slate-600">
          {post.author && (
            <div className="flex items-center gap-2">
              <img
                src={post.author.profilePicture}
                alt={post.author.username}
                className="w-8 h-8 rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
              <span className="text-sm">{post.author.username}</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="text-sm">
              {new Date(post.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="text-sm">{readMinutes} min read</span>
          </div>

          {/* Share */}
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleShare}
              className="rounded-full px-3 py-1 text-xs border-slate-300"
            >
              <Share2 className="h-3 w-3 mr-1" />
              Share
            </Button>
          </div>

          {/* Download */}
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleDownload}
              className="rounded-full px-3 py-1 text-xs border-slate-300"
            >
              <Download className="h-3 w-3 mr-1" />
              Download
            </Button>
          </div>
        </div>
      </div>

      {/* Featured image */}
      <img
        src={post.image}
        alt={post.title}
        className="w-full max-h-[600px] object-cover rounded-3xl shadow-2xl mb-8"
      />

      {/* Action bar: summarize / translate / speak */}
      <div className="mb-10 flex flex-wrap gap-3 justify-center">
        {/* Summarize */}
        <Button
          onClick={handleSummarize}
          disabled={sumLoading}
          className="bg-emerald-600 text-white rounded-full px-4"
        >
          {sumLoading ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" /> Summarizing…
            </span>
          ) : (
            <>
              <Sparkles className="h-4 w-4" /> Summarize
            </>
          )}
        </Button>

        {/* Lang select */}
        <select
          value={tgtLang}
          onChange={(e) => setTgtLang(e.target.value)}
          className="rounded-full border px-3 py-2 text-sm"
        >
          {LANGS.map((l) => (
            <option key={l.code} value={l.code}>
              {l.label}
            </option>
          ))}
        </select>

        {/* Translate */}
        <Button
          onClick={handleTranslate}
          disabled={tLoading}
          variant="outline"
          className="rounded-full px-4 border-emerald-300 text-emerald-700"
        >
          {tLoading ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" /> Translating…
            </span>
          ) : (
            <>
              <Languages className="h-4 w-4" /> Translate
            </>
          )}
        </Button>

        {/* Listen */}
        <Button
          onClick={handleSpeak}
          variant="outline"
          className={`rounded-full px-4 ${
            isSpeaking ? "bg-emerald-50 border-emerald-400" : ""
          }`}
        >
          <Volume2 className="h-4 w-4 mr-2" />
          {isSpeaking ? "Stop" : "Listen"}
        </Button>
      </div>

      {/* Summary box */}
      {summary && (
        <div className="max-w-4xl mx-auto mb-10 p-5 bg-emerald-50 rounded-xl">
          <h3 className="font-semibold text-emerald-800 mb-2">Summary</h3>
          <p className="text-slate-800 leading-relaxed">{summary}</p>
        </div>
      )}
      {sumError && (
        <div className="max-w-4xl mx-auto mb-10 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
          {sumError}
        </div>
      )}

      {/* Translation error */}
      {tError && (
        <div className="max-w-4xl mx-auto mb-10 p-3 bg-red-50 text-red-700 rounded-lg">
          {tError}
        </div>
      )}

      {/* Visible article */}
      <article className="max-w-4xl mx-auto">
        {isTranslated && (
          <button
            onClick={() => {
              setIsTranslated(false)
              setTranslatedHTML("")
            }}
            className="text-emerald-700 underline text-sm mb-4"
          >
            Revert to original
          </button>
        )}

        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{
            __html: isTranslated ? translatedHTML : post.content,
          }}
        />
      </article>

      {/* Hidden PDF layout (only for download) */}
      <div
        id="pdf-content"
        style={{
          position: "fixed",
          top: 0,
          left: "-9999px",
          opacity: 1,
          pointerEvents: "none",
          zIndex: -1,
          width: "800px",
          padding: "32px 40px",
          backgroundColor: "#ffffff",
          fontFamily: "Helvetica, Arial, sans-serif",
          boxSizing: "border-box",
          lineHeight: "1.5",
        }}
      >
        <h1
          style={{
            fontSize: "28px",
            fontWeight: "bold",
            marginBottom: "16px",
            color: "#047857",
            lineHeight: "1.3",
          }}
        >
          {post.title}
        </h1>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "12px",
            color: "#374151",
            marginBottom: "20px",
            paddingBottom: "12px",
            borderBottom: "1px solid #E5E7EB",
          }}
        >
          <div>
            <strong>Author:</strong> {post.author?.username || "Unknown author"}
          </div>
          <div>
            <strong>Date:</strong>{" "}
            {new Date(post.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
          <div>
            <strong>Category:</strong> {post.category || "Uncategorized"}
          </div>
        </div>

        {post.image && (
          <div style={{ margin: "0 0 24px 0", textAlign: "center" }}>
            <img
              src={post.image}
              alt={post.title}
              style={{
                maxWidth: "100%",
                maxHeight: "300px",
                borderRadius: "8px",
                display: "block",
                margin: "0 auto",
              }}
            />
          </div>
        )}

        <div
          style={{
            fontSize: "14px",
            lineHeight: "1.6",
            color: "#111827",
          }}
          dangerouslySetInnerHTML={{
            __html: isTranslated ? translatedHTML : post.content,
          }}
        />

        <div
          style={{
            marginTop: "30px",
            paddingTop: "15px",
            borderTop: "1px solid #E5E7EB",
            fontSize: "11px",
            color: "#6B7280",
            textAlign: "center",
          }}
        >
          Downloaded from{" "}
          <span style={{ fontWeight: "bold", color: "#047857" }}>
            ClimateKhabar
          </span>{" "}
          •{" "}
          {new Date().toLocaleString(undefined, {
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>

      {/* Ads */}
      <div className="max-w-4xl mx-auto my-16">
        <AdSlot slot="about_banner" />
      </div>

      {/* Comments */}
      <CommentSection postId={post._id} />

      {/* Recent posts */}
      <section className="max-w-7xl mx-auto mt-16">
        <h2 className="text-3xl font-bold text-slate-800 text-center mb-6">
          More Recent Stories
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recentArticles?.map((p) => (
            <PostCard key={p._id} post={p} />
          ))}
        </div>
      </section>
    </main>
  )
}

export default PostDetails
