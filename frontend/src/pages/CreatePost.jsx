import React, { useEffect, useState, useRef } from "react"
import { useNavigate, Link } from "react-router-dom"
import { ArrowLeft, Loader2, Send, Upload, Wand2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select, SelectContent, SelectGroup, SelectItem,
  SelectLabel, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"
import { uploadFile, getFilePreviewUrl } from "@/lib/appwrite/uploadImage"
import { parse } from "postcss"

// 🔹 Simple inline AuthorBadge
const AuthorBadge = ({ user }) => {
  if (!user) return null
  return (
    <div className="flex items-center gap-3 p-3 border rounded-lg bg-slate-50">
      <img
        src={user.profilePicture}
        alt=""
        referrerPolicy="no-referrer"
        className="w-9 h-9 rounded-full object-cover"
      />
      <div className="leading-tight">
        <div className="text-sm text-slate-500">Author</div>
        <div className="text-sm font-medium text-slate-800">{user.username}</div>
      </div>
    </div>
  )
}

const CreatePost = () => {
  const { toast } = useToast()
  const navigate = useNavigate()
  const quillRef = useRef(null)

  const [currentUser, setCurrentUser] = useState(null)
  const [file, setFile] = useState(null)
  const [imageUploading, setImageUploading] = useState(false)
  const [imageUploadError, setImageUploadError] = useState(null)
  const [formData, setFormData] = useState({})
  const [createPostError, setCreatePostError] = useState(null)
  const [generatingContent, setGeneratingContent] = useState(false)

  // ✅ Load current user from cookie session
  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setCurrentUser(data))
      .catch(() => setCurrentUser(null))
  }, [])

  // ✅ AI Content Generation
const generateContent = async () => {
  if (!formData.title) {
    toast({
      title: "Title required",
      description: "Please enter a title first",
      variant: "destructive"
    })
    return
  }

  try {
    setGeneratingContent(true)
    
    const response = await fetch("/api/post/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: formData.title
      }),
    })

    // Check if we got a response at all
    if (!response) {
      throw new Error("No response from server")
    }

    // Check if response is OK before trying to parse JSON
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Server error: ${response.status} - ${errorText}`)
    }

    // Now safely parse JSON
    const data = await response.json()

    if (data.success && data.content) {
      setFormData(prev => ({ 
        ...prev, 
        content: data.content 
      }))
      
      toast({
        title: "Content Generated!",
        description: "AI has generated content based on your title",
      })
    } else {
      toast({
        title: "Generation failed",
        description: data.message || "Unable to generate content",
        variant: "destructive"
      })
    }
  } catch (error) {
    console.error("AI Generation error:", error)
    toast({
      title: "Generation error",
      description: error.message || "Failed to generate content. Please try again.",
      variant: "destructive"
    })
  } finally {
    setGeneratingContent(false)
  }
}

  // ✅ Check if AI button should be enabled
  const isAIGenerationEnabled = () => {
    return formData.category === "opinion&insights" && formData.title
  }

  // ✅ Image upload
  const handleUploadImage = async () => {
    if (!file) {
      setImageUploadError("Please select an image!")
      toast({ title: "Please select an image!" })
      return
    }
    try {
      setImageUploading(true)
      setImageUploadError(null)

      const uploadedFile = await uploadFile(file)
      const postImageUrl = getFilePreviewUrl(uploadedFile.$id)

      setFormData((prev) => ({ ...prev, image: postImageUrl }))
      toast({ title: "Image Uploaded Successfully!" })
    } catch (error) {
      console.error(error)
      setImageUploadError("Image upload failed")
      toast({ title: "Image upload failed!" })
    } finally {
      setImageUploading(false)
    }
  }

  // ✅ Submit post
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch("/api/post/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      })

      const data = await res.json()
      if (!res.ok) {
        setCreatePostError(data?.message || "Something went wrong")
        toast({ title: "Something went wrong! Please try again." })
        return
      }

      toast({ title: "Article Published Successfully!" })
      navigate(`/post/${data.slug}`)
    } catch (error) {
      console.error(error)
      setCreatePostError("Something went wrong! Please try again.")
      toast({ title: "Something went wrong! Please try again." })
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto min-h-screen pt-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Create New Article</h1>
        <Link to="/dashboard?tab=dashboard">
          <Button
            variant="outline"
            className="rounded-lg border-slate-300 text-white bg-emerald-600 hover:bg-emerald-700 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      {/* Card */}
      <Card className="rounded-2xl shadow-lg border-0">
        <CardContent className="p-6">
          {/* Author badge */}
          <div className="mb-6">
            <AuthorBadge user={currentUser} />
          </div>

          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            {/* Title + Category */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-3">
                <Label htmlFor="title" className="text-slate-700 font-medium mb-2 block">
                  Article Title
                </Label>
                <Input
                  id="title"
                  type="text"
                  required
                  placeholder="Enter a compelling title..."
                  className="h-12 rounded-lg border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                />
              </div>

              <div className="lg:col-span-1">
                <Label className="text-slate-700 font-medium mb-2 block">Category</Label>
                <Select
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger className="h-12 rounded-lg border-slate-300 focus:border-emerald-500 focus:ring-emerald-500">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Categories</SelectLabel>
                      <SelectItem value="climate&environment">Climate & Environment</SelectItem>
                      <SelectItem value="energy&innovation">Energy & Innovation</SelectItem>
                      <SelectItem value="policy&cliamtejustice">Policy & Climate Justice</SelectItem>
                      <SelectItem value="resilance&disaster">Resilience & Disasters</SelectItem>
                      <SelectItem value="opinion&insights">Opinion & Insights</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* AI Generation Button - Only for Opinion & Insights */}
            {formData.category === "opinion&insights" && (
              <div className="flex justify-end">
                <Button
                  type="button"
                  onClick={generateContent}
                  disabled={!formData.title || generatingContent}
                  variant="outline"
                  className="border-purple-300 bg-purple-50 text-purple-700 hover:bg-purple-100 hover:text-purple-800 rounded-lg transition-all duration-300"
                >
                  {generatingContent ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Wand2 className="w-4 h-4" />
                      Generate AI Content
                    </div>
                  )}
                </Button>
              </div>
            )}
           
            {/* Image upload */}
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

            {/* Content */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-slate-700 font-medium">Article Content</Label>
                {formData.category === "opinion&insights" && formData.title && (
                  <div className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded">
                    ✨ AI Generation Available
                  </div>
                )}
              </div>
              <div className="rounded-lg border border-slate-300 overflow-hidden">
                <ReactQuill
                  ref={quillRef}
                  theme="snow"
                  placeholder="Write your article content here..."
                  className="h-72 mb-12"
                  required
                  value={formData.content || ''}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, content: value }))
                  }
                />
              </div>
            </div>

            {/* Submit */}
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