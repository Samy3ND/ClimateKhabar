import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { getFilePreviewUrl , uploadFile } from "@/lib/appwrite/uploadImage"
import React, { useState } from "react"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import { ArrowLeft, Loader2, Send, Upload } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

const CreatePost = () => {
  const { toast } = useToast()
  const navigate = useNavigate()

  const [file, setFile] = useState(null)
  const [imageUploadError, setImageUploadError] = useState(null)
  const [imageUploading, setImageUploading] = useState(false)

  const [formData, setFormData] = useState({})
  // console.log(formData)

  const [createPostError, setCreatePostError] = useState(null)

  const handleUploadImage = async () => {
    try {
      if (!file) {
        setImageUploadError("Please select an image!")
        toast({ title: "Please select an image!" })
        return
      }

      setImageUploading(true)

      setImageUploadError(null)

      const uploadedFile = await uploadFile(file)
      const postImageUrl = getFilePreviewUrl(uploadedFile.$id)

      setFormData({ ...formData, image: postImageUrl })

      toast({ title: "Image Uploaded Successfully!" })

      if (postImageUrl) {
        setImageUploading(false)
      }
    } catch (error) {
      setImageUploadError("Image upload failed")
      console.log(error)

      toast({ title: "Image upload failed!" })
      setImageUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const res = await fetch("/api/post/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        toast({ title: "Something went wrong! Please try again." })
        setCreatePostError(data.message)

        return
      }

      if (res.ok) {
        toast({ title: "Article Published Successfully!" })
        setCreatePostError(null)

        navigate(`/post/${data.slug}`)
      }
    } catch (error) {
      toast({ title: "Something went wrong! Please try again." })
      setCreatePostError("Something went wrong! Please try again.")
    }
  }

return (
  <div className="p-6 max-w-4xl mx-auto min-h-screen pt-24">
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Create New Article</h1>
        
      </div>
      <Link to="/dashboard?tab=dashboard">
        <Button variant="outline" className="rounded-lg border-slate-300 text-white bg-emerald-600 hover:bg-emerald-700 hover:text-white ">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
      </Link>
    </div>

    <Card className="rounded-2xl shadow-lg border-0">
      <CardContent className="p-6">
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          {/* Title and Category Row */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-3">
              <Label htmlFor="title" className="text-slate-700 font-medium mb-2 block">
                Article Title
              </Label>
              <Input
                type="text"
                placeholder="Enter a compelling title for your article..."
                required
                id="title"
                className="h-12 rounded-lg border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>

            <div className="lg:col-span-1">
              <Label className="text-slate-700 font-medium mb-2 block">
                Category
              </Label>
              <Select
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger className="h-12 rounded-lg border-slate-300 focus:border-emerald-500 focus:ring-emerald-500">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>News Categories</SelectLabel>
                    <SelectItem value="worldnews">World News</SelectItem>
                    <SelectItem value="sportsnews">Sports News</SelectItem>
                    <SelectItem value="localnews">Local News</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="space-y-4">
            <Label className="text-slate-700 font-medium">Featured Image</Label>
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 hover:border-emerald-400 transition-colors duration-300">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex-1">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="cursor-pointer"
                  />
                  <p className="text-slate-500 text-sm mt-2">
                    Upload a high-quality image for your article
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="bg-slate-100 hover:bg-slate-200 border-slate-300 rounded-lg"
                  onClick={handleUploadImage}
                  disabled={imageUploading}
                >
                  {imageUploading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Uploading...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      Upload Image
                    </div>
                  )}
                </Button>
              </div>
            </div>

            {imageUploadError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{imageUploadError}</p>
              </div>
            )}

            {formData.image && (
              <div className="mt-4">
                <img
                  src={formData.image}
                  alt="Article preview"
                  className="w-full h-72 object-cover rounded-lg shadow-md"
                />
              </div>
            )}
          </div>

          {/* Content Editor */}
          <div className="space-y-4">
            <Label className="text-slate-700 font-medium">Article Content</Label>
            <div className="rounded-lg border border-slate-300 overflow-hidden">
              <ReactQuill
                theme="snow"
                placeholder="Write your article content here... Share your climate insights, news, and stories..."
                className="h-72 mb-12"
                required
                onChange={(value) => {
                  setFormData({ ...formData, content: value })
                }}
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-base transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <div className="flex items-center gap-2">
              <Send className="w-4 h-4" />
              Publish Article
            </div>
          </Button>

          {createPostError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{createPostError}</p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  </div>
)
}

export default CreatePost
