import React, { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { Calendar, Clock, ArrowRight, Image as ImageIcon } from "lucide-react"
import { htmlToText, makeExcerpt } from "../../lib/html" // keep your util

// helper: choose the first NON-EMPTY preview source after stripping HTML
const firstNonEmptyPreview = (...candidates) => {
  for (const c of candidates) {
    if (typeof c === "string") {
      const t = htmlToText(c)
      if (t.length) return t
    }
  }
  return ""
}

const PostCard = ({ post = {} }) => {
  const {
    slug,
    title = "Untitled",
    category = "News",
    image,
    createdAt,
    excerpt,
    summary,
    description,
    content,
    body,
  } = post

  const [imgLoaded, setImgLoaded] = useState(false)
  const [imgError, setImgError] = useState(false)

  const href = slug ? `/post/${slug}` : "#"
  const imgSrc = image || ""
  const cat = category?.toString() || "News"
  const date = createdAt
    ? new Date(createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : ""

  // ✔ pick first non-empty (after stripping)
  const plainText = useMemo(
    () =>
      firstNonEmptyPreview(
        excerpt,
        summary,
        description,
        typeof body === "string" ? body : "",
        typeof content === "string" ? content : ""
      ),
    [excerpt, summary, description, body, content]
  )

  // preview + read time from plain text (no HTML)
  const preview = useMemo(() => makeExcerpt(plainText, 100), [plainText])
  const readMins = useMemo(() => {
    const words = plainText ? plainText.split(/\s+/).filter(Boolean).length : 0
    return Math.max(1, Math.ceil(words / 225))
  }, [plainText])

  return (
    <article className="group overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <Link to={href} className="block" aria-disabled={!slug}>
        {/* Media */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-gradient-to-br from-emerald-50 to-sky-50">
          {!imgError && imgSrc && (
            <img
              src={imgSrc}
              alt={title}
              loading="lazy"
              referrerPolicy="no-referrer"
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
              className={`h-full w-full object-cover transition-transform duration-500 ${
                imgLoaded ? "opacity-100" : "opacity-0"
              } group-hover:scale-[1.03]`}
            />
          )}

          {/* shimmer */}
          {!imgLoaded && !imgError && (
            <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100" />
          )}

          {/* fallback */}
          {(imgError || !imgSrc) && (
            <div className="absolute inset-0 flex items-center justify-center text-emerald-400/70">
              <ImageIcon className="h-10 w-10" strokeWidth={1.5} />
            </div>
          )}

          {/* overlay + category */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200 capitalize">
            {cat.toLowerCase()}
          </span>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-base sm:text-lg font-semibold text-slate-900 line-clamp-2">
            {title}
          </h3>

          {preview ? (
            <p className="mt-2 text-sm text-slate-600 line-clamp-3">{preview}</p>
          ) : null}

          <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
            <span className="inline-flex items-center gap-2">
              {date && (
                <>
                  <Calendar className="h-4 w-4" />
                  <span>{date}</span>
                  <span className="mx-1">•</span>
                </>
              )}
              <Clock className="h-4 w-4" />
              <span>{readMins} min read</span>
            </span>

            <span className="inline-flex items-center font-semibold text-emerald-700">
              Read more
              <ArrowRight
                className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5"
                strokeWidth={2}
              />
            </span>
          </div>
        </div>
      </Link>
    </article>
  )
}

export default PostCard
