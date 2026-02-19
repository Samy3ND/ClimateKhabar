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
import { Trash2, AlertTriangle, Users } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card"

const DashboardUsers = () => {
  const { currentUser } = useSelector((state) => state.user)

  const [users, setUsers] = useState([])
  // console.log(userPosts)

  const [showMore, setShowMore] = useState(true)
  const [userIdToDelete, setUserIdToDelete] = useState("")

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`/api/user/getusers`)

        const data = await res.json()

        if (res.ok) {
          setUsers(data.users)

          if (data.users.length < 9) {
            setShowMore(false)
          }
        }
      } catch (error) {
        console.log(error)
      }
    }

    if (currentUser.isAdmin) {
      fetchUsers()
    }
  }, [currentUser._id])

  const handleShowMore = async () => {
    const startIndex = users.length

    try {
      const res = await fetch(`/api/user/getusers?startIndex=${startIndex}`)

      const data = await res.json()

      if (res.ok) {
        setUsers((prev) => [...prev, ...data.users])

        if (data.users.length < 9) {
          setShowMore(false)
        }
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  const handleDeleteUser = async () => {
    try {
      const res = await fetch(`/api/user/delete/${userIdToDelete}`, {
        method: "DELETE",
      })

      const data = await res.json()

      if (res.ok) {
        setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete))
      } else {
        console.log(data.message)
      }
    } catch (error) {
      console.log(error.message)
    }
  }

 return (
  <div className="w-full max-w-7xl mx-auto p-6">
    {currentUser.isAdmin && users.length > 0 ? (
      <>
        <Card className="rounded-2xl shadow-lg border-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-bold text-slate-800">Subscribers</CardTitle>
            <CardDescription>Manage all users and their permissions</CardDescription>
          </CardHeader>
          
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                    <TableHead className="font-semibold text-slate-700">Joined On</TableHead>
                    <TableHead className="font-semibold text-slate-700">User</TableHead>
                    <TableHead className="font-semibold text-slate-700">Username</TableHead>
                    <TableHead className="font-semibold text-slate-700">Email</TableHead>
                    <TableHead className="font-semibold text-slate-700">Admin</TableHead>
                    <TableHead className="font-semibold text-slate-700">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user._id} className="group hover:bg-slate-50/80 transition-colors">
                      <TableCell className="py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-800">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </span>
                          <span className="text-xs text-slate-500">
                            {new Date(user.createdAt).toLocaleTimeString()}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="py-4">
                        <img
                          src={user.profilePicture}
                          alt={user.username}
                          className="w-10 h-10 object-cover rounded-full border-2 border-slate-200 shadow-sm"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            e.target.src = "https://cdn-icons-png.flaticon.com/128/3177/3177440.png";
                          }}
                        />
                      </TableCell>

                      <TableCell className="py-4">
                        <span className="font-medium text-slate-800">@{user.username}</span>
                      </TableCell>

                      <TableCell className="py-4">
                        <span className="text-slate-600">{user.email}</span>
                      </TableCell>

                      <TableCell className="py-4">
                        {user.isAdmin ? (
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-green-700 text-sm font-medium">Admin</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                            <span className="text-slate-500 text-sm">User</span>
                          </div>
                        )}
                      </TableCell>

                      <TableCell className="py-4">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setUserIdToDelete(user._id)}
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
                              <AlertDialogTitle className="text-center text-xl">Delete User?</AlertDialogTitle>
                              <AlertDialogDescription className="text-center text-slate-600">
                                This action cannot be undone. This will permanently delete 
                                <span className="font-semibold text-slate-800"> @{user.username}</span> and remove all their data from our servers.
                              </AlertDialogDescription>
                            </AlertDialogHeader>

                            <AlertDialogFooter className="flex flex-col sm:flex-row gap-2">
                              <AlertDialogCancel className="mt-0 rounded-lg border-slate-300 hover:bg-slate-50 flex-1">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-600 hover:bg-red-700 rounded-lg flex-1"
                                onClick={handleDeleteUser}
                              >
                                Delete User
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
              Load More Users
            </Button>
          </div>
        )}
      </>
    ) : (
      <Card className="rounded-2xl shadow-lg border-0 text-center py-16 max-w-md mx-auto">
        <CardContent>
          <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Users className="w-10 h-10 text-slate-400" />
          </div>
          <CardTitle className="text-xl font-semibold text-slate-800 mb-2">
            No subscribers yet
          </CardTitle>
          <CardDescription className="mb-6">
            Users who sign up will appear here for management.
          </CardDescription>
        </CardContent>
      </Card>
    )}
  </div>
)
}

export default DashboardUsers
