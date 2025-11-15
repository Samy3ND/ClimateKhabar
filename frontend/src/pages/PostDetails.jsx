import React, { useEffect, useState, useMemo } from "react"
import { useParams } from "react-router-dom"
import {
  Calendar,
  Clock,
  Loader2,
  Volume2,
  Languages,
  Sparkles,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { AdSlot } from "@/components/shared/Advertise"
import CommentSection from "@/components/shared/CommentSection"
import PostCard from "@/components/shared/PostCard"

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

  // AI feature states
  const [sumLoading, setSumLoading] = useState(false)
  const [summary, setSummary] = useState("")
  const [sumError, setSumError] = useState("")

  const [tgtLang, setTgtLang] = useState("en")
  const [tLoading, setTLoading] = useState(false)
  const [translatedHTML, setTranslatedHTML] = useState("")
  const [isTranslated, setIsTranslated] = useState(false)
  const [tError, setTError] = useState("")

  // Fetch post
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

  // Fetch recent articles
  useEffect(() => {
    const loadRecent = async () => {
      try {
        const res = await fetch(`/api/post/getposts?limit=3`)
        const data = await res.json()
        if (res.ok) setRecentArticles(data.posts)
      } catch {}
    }
    loadRecent()
  }, [])

  // Reading time
  const readMinutes = useMemo(() => {
    const plain = (post?.content || "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()

    const words = plain.split(/\s+/).filter(Boolean).length
    return Math.max(1, Math.ceil(words / 225))
  }, [post?.content])

  // Summarize
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
      if (!r.ok) throw new Error(data.error)

      setSummary(data.summary)
    } catch (err) {
      setSumError(err.message || "Summarization failed")
    } finally {
      setSumLoading(false)
    }
  }

  // Translate FULL HTML (server returns structured HTML)
  const handleTranslate = async () => {
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
      if (!r.ok) throw new Error(data.error)

      setTranslatedHTML(data.html)
      setIsTranslated(true)
    } catch (err) {
      setTError(err.message || "Translation failed")
    } finally {
      setTLoading(false)
    }
  }

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

  // ================= UI ================

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

        {/* Meta */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-6 text-slate-600">
          {post.author && (
            <div className="flex items-center gap-2">
              <img
                src={post.author.profilePicture}
                alt={post.author.username}
                className="w-8 h-8 rounded-full object-cover"
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
        </div>
      </div>

      {/* Feature Image */}
      <img
        src={post.image}
        alt={post.title}
        className="w-full max-h-[600px] object-cover rounded-3xl shadow-2xl mb-8"
      />

      {/* ACTION BAR */}
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

        {/* Translate */}
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

        {/* Speak (coming up) */}
        <Button
          disabled
          variant="outline"
          className="rounded-full px-4 opacity-60 cursor-not-allowed"
        >
          <Volume2 className="h-4 w-4" /> Listen
        </Button>
      </div>

      {/* Summary */}
      {summary && (
        <div className="max-w-4xl mx-auto mb-10 p-5 bg-emerald-50 rounded-xl">
          <h3 className="font-semibold text-emerald-800 mb-2">Summary</h3>
          <p className="text-slate-800 leading-relaxed">{summary}</p>
        </div>
      )}

      {/* Translation Errors */}
      {tError && (
        <div className="max-w-4xl mx-auto mb-10 p-3 bg-red-50 text-red-700 rounded-lg">
          {tError}
        </div>
      )}

      {/* ARTICLE */}
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

      {/* Ads */}
      <div className="max-w-4xl mx-auto my-16">
        <AdSlot slot="about_banner" />
      </div>

      {/* Comments */}
      <CommentSection postId={post._id} />

      {/* Recent */}
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
