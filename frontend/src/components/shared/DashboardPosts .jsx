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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card"

import { Link } from "react-router-dom"
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
import { Button } from "../ui/button"
import { Trash2, Edit, AlertTriangle, FileText, Plus } from "lucide-react"
const DashboardPosts = () => {
  const { currentUser } = useSelector((state) => state.user)

  const [userPosts, setUserPosts] = useState([])
  // console.log(userPosts)

  const [showMore, setShowMore] = useState(true)
  const [postIdToDelete, setPostIdToDelete] = useState("")

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`)

        const data = await res.json()

        if (res.ok) {
          setUserPosts(data.posts)

          if (data.posts.length < 9) {
            setShowMore(false)
          }
        }
      } catch (error) {
        console.log(error)
      }
    }

    if (currentUser.isAdmin) {
      fetchPosts()
    }
  }, [currentUser._id])

  const handleShowMore = async () => {
    const startIndex = userPosts.length

    try {
      const res = await fetch(
        `/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`
      )

      const data = await res.json()

      if (res.ok) {
        setUserPosts((prev) => [...prev, ...data.posts])

        if (data.posts.length < 9) {
          setShowMore(false)
        }
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  const handleDeletePost = async () => {
    // console.log(postIdToDelete)

    try {
      const res = await fetch(
        `/api/post/deletepost/${postIdToDelete}/${currentUser._id}`,
        {
          method: "DELETE",
        }
      )

      const data = await res.json()

      if (!res.ok) {
        console.log(data.message)
      } else {
        setUserPosts((prev) =>
          prev.filter((post) => post._id !== postIdToDelete)
        )
      }
    } catch (error) {
      console.log(error.message)
    }
  }

return (
  <div className="w-full max-w-7xl mx-auto p-6">
    {currentUser.isAdmin && userPosts.length > 0 ? (
      <>
        <Card className="rounded-2xl shadow-lg border-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-bold text-slate-800">Your Published Articles</CardTitle>
            <CardDescription>Manage and track your published content</CardDescription>
          </CardHeader>
          
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                    <TableHead className="font-semibold text-slate-700">Date Updated</TableHead>
                    <TableHead className="font-semibold text-slate-700">Post Image</TableHead>
                    <TableHead className="font-semibold text-slate-700">Post Title</TableHead>
                    <TableHead className="font-semibold text-slate-700">Category</TableHead>
                    <TableHead className="font-semibold text-slate-700">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userPosts.map((post) => (
                    <TableRow key={post._id} className="group hover:bg-slate-50/80 transition-colors">
                      <TableCell className="py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-800">
                            {new Date(post.updatedAt).toLocaleDateString()}
                          </span>
                          <span className="text-xs text-slate-500">
                            {new Date(post.updatedAt).toLocaleTimeString()}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="py-4">
                        <Link to={`/post/${post.slug}`} className="block">
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-16 h-12 object-cover rounded-lg bg-slate-200 group-hover:scale-105 transition-transform duration-200 shadow-sm"
                          />
                        </Link>
                      </TableCell>

                      <TableCell className="py-4">
                        <Link 
                          to={`/post/${post.slug}`}
                          className="font-medium text-slate-800 hover:text-emerald-600 transition-colors line-clamp-2"
                        >
                          {post.title}
                        </Link>
                      </TableCell>

                      <TableCell className="py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 capitalize border border-emerald-200">
                          {post.category}
                        </span>
                      </TableCell>

                      <TableCell className="py-4">
                        <div className="flex items-center gap-2">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setPostIdToDelete(post._id)}
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
                                <AlertDialogTitle className="text-center text-xl">Delete Article?</AlertDialogTitle>
                                <AlertDialogDescription className="text-center text-slate-600">
                                  This action cannot be undone. This will permanently delete your 
                                  post <span className="font-semibold text-slate-800">"{post.title}"</span> and remove it from our servers.
                                </AlertDialogDescription>
                              </AlertDialogHeader>

                              <AlertDialogFooter className="flex flex-col sm:flex-row gap-2">
                                <AlertDialogCancel className="mt-0 rounded-lg border-slate-300 hover:bg-slate-50 flex-1">
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-red-600 hover:bg-red-700 rounded-lg flex-1"
                                  onClick={handleDeletePost}
                                >
                                  Delete Article
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>

                          <Link to={`/update-post/${post._id}`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 h-9 px-3"
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                          </Link>
                        </div>
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
              Load More Articles
            </Button>
          </div>
        )}
      </>
    ) : (
      <Card className="rounded-2xl shadow-lg border-0 text-center py-16 max-w-md mx-auto">
        <CardContent>
          <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FileText className="w-10 h-10 text-slate-400" />
          </div>
          <CardTitle className="text-xl font-semibold text-slate-800 mb-2">
            No articles published yet
          </CardTitle>
          <CardDescription className="mb-6">
            Start creating content to see it appear here.
          </CardDescription>
          <Link to="/create-post">
            <Button className="bg-emerald-600 hover:bg-emerald-700 rounded-xl px-6 py-2">
              <Plus className="w-5 h-5 mr-2" />
              Create Your First Post
            </Button>
          </Link>
        </CardContent>
      </Card>
    )}
  </div>
)
}

export default DashboardPosts
