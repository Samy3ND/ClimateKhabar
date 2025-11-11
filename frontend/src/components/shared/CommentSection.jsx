import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { Textarea } from "../ui/textarea"
import { Button } from "../ui/button"
import { useToast } from "@/hooks/use-toast"
import Comment from "./Comment"
import { LogIn, MessageCircle } from "lucide-react"

const CommentSection = ({ postId }) => {
  const { toast } = useToast()
  const navigate = useNavigate()

  const { currentUser } = useSelector((state) => state.user)
  const [comment, setComment] = useState("")
  const [allComments, setAllComments] = useState([])

  // console.log(allComments)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (comment.length > 200) {
      toast({
        title: "Comment length must be lower than or equal to 200 characters",
      })

      return
    }

    try {
      const res = await fetch("/api/comment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: comment,
          postId,
          userId: currentUser._id,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        toast({ title: "Comment successfully!" })
        setComment("")
        setAllComments([data, ...allComments])
      }
    } catch (error) {
      console.log(error)
      toast({ title: "Something went wrong! Please try again." })
    }
  }

  useEffect(() => {
    const getComments = async () => {
      try {
        const res = await fetch(`/api/comment/getPostComments/${postId}`)

        if (res.ok) {
          const data = await res.json()
          setAllComments(data)
        }
      } catch (error) {
        console.log(error)
      }
    }

    getComments()
  }, [postId])

  const handleLike = async (commentId) => {
    try {
      if (!currentUser) {
        navigate("/sign-in")
        return
      }

      const res = await fetch(`/api/comment/likeComment/${commentId}`, {
        method: "PUT",
      })

      if (res.ok) {
        const data = await res.json()

        setAllComments(
          allComments.map((comment) =>
            comment._id === commentId
              ? {
                  ...comment,
                  likes: data.likes,
                  numberOfLikes: data.likes.length,
                }
              : comment
          )
        )
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  const handleEdit = async (comment, editedContent) => {
    setAllComments(
      allComments.map((c) =>
        c._id === comment._id ? { ...c, content: editedContent } : c
      )
    )
  }

  const handleDelete = async (commentId) => {
    try {
      // console.log(commentId)

      if (!currentUser) {
        navigate("/sign-in")

        return
      }

      const res = await fetch(`/api/comment/deleteComment/${commentId}`, {
        method: "DELETE",
      })

      if (res.ok) {
        const data = await res.json()

        setAllComments(
          allComments.filter((comment) => comment._id !== commentId)
        )
      }
    } catch (error) {
      console.log(error.message)
    }
  }

return (
  <div className="max-w-4xl mx-auto w-full p-6">
    {/* User Status */}
    {currentUser ? (
      <div className="flex items-center gap-3 mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-200">
        <div className="flex items-center gap-3 flex-1">
          <img
            src={currentUser.profilePicture}
            alt="Profile"
            className="h-8 w-8 object-cover rounded-full border-2 border-white shadow-sm"
          />
          <div>
            <p className="text-sm text-slate-600">Commenting as</p>
            <Link
              to={"/dashboard?tab=profile"}
              className="font-semibold text-slate-800 hover:text-emerald-600 transition-colors text-sm"
            >
              @{currentUser.username}
            </Link>
          </div>
        </div>
      </div>
    ) : (
      <div className="flex items-center gap-3 mb-6 p-4 bg-amber-50 rounded-2xl border border-amber-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-100 rounded-lg">
            <LogIn className="h-4 w-4 text-amber-600" />
          </div>
          <p className="text-sm text-amber-800">
            You must be signed in to comment.{" "}
            <Link 
              to={"/sign-in"} 
              className="font-semibold hover:underline underline-offset-2"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    )}

    {/* Comment Form */}
    {currentUser && (
      <form
        className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-8"
        onSubmit={handleSubmit}
      >
        <textarea
          placeholder="Share your thoughts... (max 200 characters)"
          rows="4"
          maxLength="200"
          className="w-full border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-xl p-4 resize-none transition-all duration-200 text-slate-700 placeholder-slate-400"
          onChange={(e) => setComment(e.target.value)}
          value={comment}
        />

        <div className="flex justify-between items-center mt-4">
          <div className={`text-sm font-medium transition-colors ${
            comment.length > 180 ? "text-rose-500" : "text-slate-500"
          }`}>
            {200 - comment.length} characters remaining
          </div>

          <button 
            type="submit" 
            disabled={!comment.trim()}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
          >
            Post Comment
          </button>
        </div>
      </form>
    )}

    {/* Comments List */}
    <div className="space-y-6">
      {/* Comments Header */}
      {allComments.length > 0 && (
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-2xl">
            <MessageCircle className="h-4 w-4 text-slate-600" />
            <span className="font-semibold text-slate-700">
              {allComments.length} {allComments.length === 1 ? 'Comment' : 'Comments'}
            </span>
          </div>
        </div>
      )}

      {/* No Comments State */}
      {allComments.length === 0 ? (
        <div className="text-center py-12">
          <div className="p-4 bg-slate-100 rounded-2xl inline-flex mb-4">
            <MessageCircle className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-700 mb-2">
            No comments yet
          </h3>
          <p className="text-slate-500 max-w-sm mx-auto">
            Be the first to share your thoughts on this article.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {allComments.map((comment) => (
            <Comment
              key={comment._id}
              comment={comment}
              onLike={handleLike}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  </div>
)
}

export default CommentSection
