import React, { useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutSuccess,
  updateFailure,
  updateStart,
  updateSuccess,
} from "@/redux/user/userSlice"
import { getFilePreviewUrl, uploadFile } from "@/lib/appwrite/uploadImage"
import { useToast } from "@/hooks/use-toast"
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card"
import { Label } from "../ui/label"
import { Camera, Loader2, LogOut, Trash2, AlertTriangle } from "lucide-react"

const DashboardProfile = () => {
  const { currentUser, error, loading } = useSelector((state) => state.user)

  const profilePicRef = useRef()
  const dispatch = useDispatch()
  const { toast } = useToast()

  const [imageFile, setImageFile] = useState(null)
  const [imageFileUrl, setImageFileUrl] = useState(null)
  const [formData, setFormData] = useState({})

  // console.log(formData)

  const handleImageChange = (e) => {
    const file = e.target.files[0]

    // console.log(file)
    if (file) {
      setImageFile(file)
      setImageFileUrl(URL.createObjectURL(file))
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const uploadImage = async () => {
    if (!imageFile) return currentUser.profilePicture

    try {
      const uploadedFile = await uploadFile(imageFile)
      const profilePictureUrl = getFilePreviewUrl(uploadedFile.$id)

      return profilePictureUrl
    } catch (error) {
      toast({ title: "Update user failed. Please try again!" })
      console.log("Image upload failed: ", error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      dispatch(updateStart())

      // wait for image upload
      const profilePicture = await uploadImage()

      const updateProfile = {
        ...formData,
        profilePicture,
      }

      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateProfile),
      })

      const data = await res.json()

      if (data.success === false) {
        toast({ title: "Update user failed. Please try again!" })
        dispatch(updateFailure(data.message))
      } else {
        console.log("I am running")
        dispatch(updateSuccess(data))
        toast({ title: "User updated successfully." })
      }
    } catch (error) {
      toast({ title: "Update user failed. Please try again!" })
      dispatch(updateFailure(error.message))
    }
  }

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart())

      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      })

      const data = await res.json()

      if (!res.ok) {
        dispatch(deleteUserFailure(data.message))
      } else {
        dispatch(deleteUserSuccess())
      }
    } catch (error) {
      console.log(error)
      dispatch(deleteUserFailure(error.message))
    }
  }

  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
      })

      const data = await res.json()

      if (!res.ok) {
        console.log(data.message)
      } else {
        dispatch(signOutSuccess())
      }
    } catch (error) {
      console.log(error)
    }
  }

return (
  <div className="max-w-md mx-auto p-6 w-full">
    <Card className="rounded-2xl shadow-lg border-0">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-3xl font-bold text-slate-800">
          Update Your Profile
        </CardTitle>
        <CardDescription className="text-slate-600">
          Manage your account information and preferences
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          {/* Profile Picture */}
          <div className="flex flex-col items-center gap-4">
            <input
              type="file"
              accept="image/*"
              hidden
              ref={profilePicRef}
              onChange={handleImageChange}
            />
            <div 
              className="w-32 h-32 relative cursor-pointer group"
              onClick={() => profilePicRef.current.click()}
            >
              <img
                src={imageFileUrl || currentUser.profilePicture}
                alt="Profile"
                className="rounded-full w-full h-full object-cover border-4 border-slate-200 group-hover:border-emerald-400 transition-all duration-300 shadow-lg"
              />
              <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Camera className="w-8 h-8 text-white" />
              </div>
            </div>
            <p className="text-sm text-slate-500">Click to change profile picture</p>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-slate-700 font-medium">
                Username
              </Label>
              <Input
                type="text"
                id="username"
                placeholder="Enter your username"
                defaultValue={currentUser.username}
                className="h-12 rounded-lg border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700 font-medium">
                Email
              </Label>
              <Input
                type="email"
                id="email"
                placeholder="Enter your email"
                defaultValue={currentUser.email}
                className="h-12 rounded-lg border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-700 font-medium">
                Password
              </Label>
              <Input
                type="password"
                id="password"
                placeholder="Enter new password"
                className="h-12 rounded-lg border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Update Button */}
          <Button 
            type="submit" 
            className="h-12 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white font-semibold text-base transition-all duration-300 shadow-md hover:shadow-lg"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Updating...
              </div>
            ) : (
              "Update Profile"
            )}
          </Button>
        </form>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm text-center">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-200">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="outline" 
                className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 rounded-lg"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Account
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent className="rounded-2xl max-w-md">
              <AlertDialogHeader>
                <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <AlertDialogTitle className="text-center text-xl">
                  Delete Account?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-center text-slate-600">
                  This action cannot be undone. This will permanently delete your
                  account and remove all your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter className="flex flex-col sm:flex-row gap-2">
                <AlertDialogCancel className="rounded-lg border-slate-300 hover:bg-slate-50 flex-1">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-600 hover:bg-red-700 rounded-lg flex-1"
                  onClick={handleDeleteUser}
                >
                  Delete Account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Button
            variant="outline"
            className="text-slate-700 hover:text-slate-800 hover:bg-slate-50 border-slate-300 rounded-lg"
            onClick={handleSignout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
)
}

export default DashboardProfile
