import { AdSlot } from "@/components/shared/Advertise"
import CommentSection from "@/components/shared/CommentSection"
import PostCard from "@/components/shared/PostCard"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import React, { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { Calendar, Clock } from "lucide-react"

const PostDetails = () => {
  const { postSlug } = useParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [post, setPost] = useState(null)
  const [recentArticles, setRecentArticles] = useState(null)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/post/getposts?slug=${postSlug}`)
        const data = await res.json()

        if (!res.ok) {
          setError(true)
          setLoading(false)
          return
        }

        setPost(data.posts[0])
        setLoading(false)
      } catch (error) {
        setError(true)
        setLoading(false)
      }
    }
    fetchPost()
  }, [postSlug])

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const res = await fetch(`/api/post/getposts?limit=3`)
        const data = await res.json()
        if (res.ok) setRecentArticles(data.posts)
      } catch (err) {
        console.log(err)
      }
    }
    fetchRecent()
  }, [])

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

  return (
    <main className="px-4 py-8 max-w-7xl mx-auto min-h-screen mt-16">
      {/* Article Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-800 leading-tight mb-6 max-w-4xl mx-auto">
          {post?.title}
        </h1>

       
          <Button
            variant="outline"
            className="border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800 px-6 py-2 rounded-full font-medium transition-all duration-300 hover:shadow-md"
          >
            {post?.category}
          </Button>
        

        {/* 🟢 Article Meta: now includes Author */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-6 text-slate-600">
          {/* Author */}
          {post?.author && (
            <div className="flex items-center gap-2">
              <img
                src={post.author.profilePicture}
                alt={post.author.username}
                referrerPolicy="no-referrer"
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="text-sm font-medium">{post.author.username}</span>
            </div>
          )}

          {/* Date */}
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="text-sm font-medium">
              {post &&
                new Date(post.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
            </span>
          </div>

          {/* Read time */}
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium">
              {post && Math.ceil(post.content.length / 200)} min read
            </span>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      <div className="mb-12 rounded-3xl overflow-hidden shadow-2xl">
        <img
          src={post?.image}
          alt={post?.title}
          className="w-full h-auto max-h-[600px] object-cover"
        />
      </div>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto">
        <div
          className="prose prose-lg max-w-none prose-headings:text-slate-800 prose-p:text-slate-600 prose-p:leading-relaxed prose-a:text-emerald-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-slate-800 prose-blockquote:border-emerald-300 prose-blockquote:bg-emerald-50 prose-blockquote:rounded-2xl prose-img:rounded-xl prose-img:shadow-md"
          dangerouslySetInnerHTML={{ __html: post?.content }}
        />
      </article>

      {/* Advertisement */}
      <div className="max-w-4xl mx-auto my-16">
        <AdSlot slot="about_banner" />
      </div>

      {/* Comments */}
      <div className="max-w-4xl mx-auto mb-16">
        <CommentSection postId={post._id} />
      </div>

      {/* Recent Articles */}
      <section className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">
            More Recent Stories
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Discover other articles you might enjoy
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recentArticles?.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      </section>
    </main>
  )
}

export default PostDetails
