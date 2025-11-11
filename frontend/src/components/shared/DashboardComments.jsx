import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Trash2, Heart, AlertTriangle, MessageCircle } from "lucide-react"

const DashboardComments = () => {
  const { currentUser } = useSelector((state) => state.user)

  const [comments, setComments] = useState([])
  // console.log(userPosts)

  const [showMore, setShowMore] = useState(true)
  const [commentIdToDelete, setCommentIdToDelete] = useState("")

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/comment/getcomments`)

        const data = await res.json()

        if (res.ok) {
          setComments(data.comments)

          if (data.comments.length < 9) {
            setShowMore(false)
          }
        }
      } catch (error) {
        console.log(error)
      }
    }

    if (currentUser.isAdmin) {
      fetchComments()
    }
  }, [currentUser._id])

  const handleShowMore = async () => {
    const startIndex = comments.length

    try {
      const res = await fetch(
        `/api/comment/getcomments?startIndex=${startIndex}`
      )

      const data = await res.json()

      if (res.ok) {
        setComments((prev) => [...prev, ...data.comments])

        if (data.comments.length < 9) {
          setShowMore(false)
        }
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  const handleDeleteComment = async () => {
    try {
      const res = await fetch(
        `/api/comment/deleteComment/${commentIdToDelete}`,
        {
          method: "DELETE",
        }
      )

      const data = await res.json()

      if (res.ok) {
        setComments((prev) =>
          prev.filter((comment) => comment._id !== commentIdToDelete)
        )
      } else {
        console.log(data.message)
      }
    } catch (error) {
      console.log(error.message)
    }
  }

return (
  <div className="w-full max-w-7xl mx-auto p-6">
    {currentUser.isAdmin && comments.length > 0 ? (
      <>
        <Card className="rounded-2xl shadow-lg border-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-bold text-slate-800">Comments Management</CardTitle>
            <CardDescription>Monitor and manage all user comments across the platform</CardDescription>
          </CardHeader>
          
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                    <TableHead className="font-semibold text-slate-700">Date</TableHead>
                    <TableHead className="font-semibold text-slate-700">Comment</TableHead>
                    <TableHead className="font-semibold text-slate-700">Likes</TableHead>
                    <TableHead className="font-semibold text-slate-700">Post</TableHead>
                    <TableHead className="font-semibold text-slate-700">User</TableHead>
                    <TableHead className="font-semibold text-slate-700">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {comments.map((comment) => (
                    <TableRow key={comment._id} className="group hover:bg-slate-50/80 transition-colors">
                      <TableCell className="py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-800 text-sm">
                            {new Date(comment.updatedAt).toLocaleDateString()}
                          </span>
                          <span className="text-xs text-slate-500">
                            {new Date(comment.updatedAt).toLocaleTimeString()}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="py-4 max-w-md">
                        <p className="text-slate-700 line-clamp-2 text-sm leading-relaxed">
                          {comment.content}
                        </p>
                      </TableCell>

                      <TableCell className="py-4">
                        <div className="flex items-center gap-2">
                          <Heart className="w-4 h-4 text-rose-500" />
                          <span className="font-medium text-slate-800">{comment.numberOfLikes}</span>
                        </div>
                      </TableCell>

                      <TableCell className="py-4">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                          Post
                        </span>
                      </TableCell>

                      <TableCell className="py-4">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                          User
                        </span>
                      </TableCell>

                      <TableCell className="py-4">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setCommentIdToDelete(comment._id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 h-9 px-3"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Delete
                            </Button>
                          </AlertDialogTrigger>

                          <AlertDialogContent className="rounded-2xl max-w-md">
                            <AlertDialogHeader>
                              <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                                <AlertTriangle className="w-6 h-6 text-red-600" />
                              </div>
                              <AlertDialogTitle className="text-center text-xl">Delete Comment?</AlertDialogTitle>
                              <AlertDialogDescription className="text-center text-slate-600">
                                This action cannot be undone. This will permanently delete this comment:
                                <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                                  <p className="text-slate-700 text-sm italic line-clamp-3">"{comment.content}"</p>
                                </div>
                              </AlertDialogDescription>
                            </AlertDialogHeader>

                            <AlertDialogFooter className="flex flex-col sm:flex-row gap-2">
                              <AlertDialogCancel className="mt-0 rounded-lg border-slate-300 hover:bg-slate-50 flex-1">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-600 hover:bg-red-700 rounded-lg flex-1"
                                onClick={handleDeleteComment}
                              >
                                Delete Comment
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {showMore && (
          <div className="flex justify-center mt-8">
            <Button
              variant="outline"
              onClick={handleShowMore}
              className="rounded-xl px-8 py-2 border-slate-300 hover:bg-slate-50"
            >
              Load More Comments
            </Button>
          </div>
        )}
      </>
    ) : (
      <Card className="rounded-2xl shadow-lg border-0 text-center py-16 max-w-md mx-auto">
        <CardContent>
          <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <MessageCircle className="w-10 h-10 text-slate-400" />
          </div>
          <CardTitle className="text-xl font-semibold text-slate-800 mb-2">
            No comments yet
          </CardTitle>
          <CardDescription className="mb-6">
            User comments will appear here for moderation.
          </CardDescription>
        </CardContent>
      </Card>
    )}
  </div>
)
}

export default DashboardComments
