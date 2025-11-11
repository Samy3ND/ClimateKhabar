import PostCard from "@/components/shared/PostCard"
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
import { Separator } from "@/components/ui/separator"
import React, { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

const Search = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    sort: "desc",
    category: "",
  })

  //   console.log(sidebarData)

  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const [showMore, setShowMore] = useState(false)

  console.log(posts)

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)

    const searchTermFromUrl = urlParams.get("searchTerm")
    const sortFromUrl = urlParams.get("sort")
    const categoryFromUrl = urlParams.get("category")

    console.log(searchTermFromUrl)

    if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
      setSidebarData({
        ...sidebarData,
        searchTerm: searchTermFromUrl || "",
        sort: sortFromUrl || "",
        category: categoryFromUrl || "",
      })
    }

    const fetchPosts = async () => {
      setLoading(true)

      const searchQuery = urlParams.toString()

      const res = await fetch(`/api/post/getposts?${searchQuery}`)

      if (!res.ok) {
        setLoading(false)
        return
      }

      if (res.ok) {
        const data = await res.json()
        setPosts(data.posts)
        setLoading(false)

        if (data.posts.length === 9) {
          setShowMore(true)
        } else {
          setShowMore(false)
        }
      }
    }

    fetchPosts()
  }, [location.search])

  const handleChange = (e) => {
    if (e.target.id === "searchTerm") {
      setSidebarData({ ...sidebarData, searchTerm: e.target.value })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const urlParams = new URLSearchParams(location.search)

    urlParams.set("searchTerm", sidebarData.searchTerm)
    urlParams.set("sort", sidebarData.sort)
    urlParams.set("category", sidebarData.category)

    const searchQuery = urlParams.toString()

    navigate(`/search?${searchQuery}`)
  }

  const handleShowMore = async () => {
    const numberOfPosts = posts.length
    const startIndex = numberOfPosts
    const urlParams = new URLSearchParams(location.search)

    urlParams.set("startIndex", startIndex)

    const searchQuery = urlParams.toString()

    const res = await fetch(`/api/post/getposts?${searchQuery}`)

    if (!res.ok) {
      return
    }

    if (res.ok) {
      const data = await res.json()

      setPosts([...posts, ...data.posts])

      if (data.posts.length === 9) {
        setShowMore(true)
      } else {
        setShowMore(false)
      }
    }
  }

return (
  <div className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 pt-16">
    {/* Sidebar */}
    <aside className="lg:w-80 p-6 bg-white/80 border-r border-slate-100 shadow-lg backdrop-blur-sm lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto">
      <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
        <div className="text-center lg:text-left">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-slate-600 rounded-2xl flex items-center justify-center mb-4 mx-auto lg:mx-0 shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-emerald-600 bg-clip-text text-transparent">
            News Filters
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Refine your news exploration
          </p>
        </div>

        {/* Search */}
        <div className="space-y-3">
          <label htmlFor="searchTerm" className="font-semibold text-slate-700 flex items-center gap-2">
            <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Search Term
          </label>
          <Input
            placeholder="Type keywords, topics..."
            id="searchTerm"
            type="text"
            className="border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-xl transition-all duration-200 py-2.5 shadow-sm"
            value={sidebarData.searchTerm}
            onChange={handleChange}
          />
        </div>

        {/* Sort By */}
        <div className="space-y-3">
          <label className="font-semibold text-slate-700 flex items-center gap-2">
            <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
            </svg>
            Sort By
          </label>
          <Select
            onValueChange={(value) =>
              setSidebarData({ ...sidebarData, sort: value })
            }
            value={sidebarData.sort}
          >
            <SelectTrigger className="w-full border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-xl transition-all duration-200 py-2.5 shadow-sm">
              <SelectValue placeholder="Select order" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Order by</SelectLabel>
                <SelectItem value="desc" className="focus:bg-emerald-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    Latest First
                  </div>
                </SelectItem>
                <SelectItem value="asc" className="focus:bg-emerald-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                    Oldest First
                  </div>
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Category */}
        <div className="space-y-3">
          <label className="font-semibold text-slate-700 flex items-center gap-2">
            <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Category
          </label>
          <Select
            onValueChange={(value) =>
              setSidebarData({ ...sidebarData, category: value })
            }
            value={sidebarData.category}
          >
            <SelectTrigger className="w-full border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-xl transition-all duration-200 py-2.5 shadow-sm">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Categories</SelectLabel>
                <SelectItem value="worldnews" className="focus:bg-emerald-50 rounded-lg">🌍 World News</SelectItem>
                <SelectItem value="sportsnews" className="focus:bg-emerald-50 rounded-lg">⚽ Sports News</SelectItem>
                <SelectItem value="localnews" className="focus:bg-emerald-50 rounded-lg">📍 Local News</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Apply Filters */}
        <Button
          type="submit"
          className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Apply Filters
        </Button>
      </form>
    </aside>

    {/* Main Content */}
    <main className="flex-1 bg-white/50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-emerald-700 bg-clip-text text-transparent mb-3">
            All News Articles
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Discover the latest stories and updates from around the world
          </p>
        </div>

        <Separator className="bg-gradient-to-r from-transparent via-emerald-200 to-transparent h-0.5 mb-8" />

        {/* Results Info */}
        <div className="flex justify-between items-center mb-8 px-2">
          <div className="text-slate-600">
            {loading ? (
              <span className="animate-pulse">Loading articles...</span>
            ) : (
              <span className="flex items-center gap-2">
                <span className="font-semibold text-emerald-600 text-lg">{posts.length}</span>
                <span>articles found</span>
              </span>
            )}
          </div>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 px-2">
          {/* Loading State */}
          {loading && (
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-white rounded-2xl border border-slate-100 p-6 animate-pulse shadow-sm">
                <div className="bg-slate-200 h-48 rounded-xl mb-4"></div>
                <div className="bg-slate-200 h-4 rounded mb-3"></div>
                <div className="bg-slate-200 h-4 rounded w-3/4 mb-4"></div>
                <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                  <div className="bg-slate-200 w-20 h-4 rounded"></div>
                  <div className="bg-slate-200 w-16 h-4 rounded"></div>
                </div>
              </div>
            ))
          )}

          {/* No Posts */}
          {!loading && posts.length === 0 && (
            <div className="col-span-full text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-100 to-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg className="w-12 h-12 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-700 mb-2">No articles found</h3>
              <p className="text-slate-500 max-w-md mx-auto">
                Try adjusting your search terms or filters to discover more content.
              </p>
            </div>
          )}

          {/* Posts */}
          {!loading && posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>

        {/* Show More */}
        {showMore && (
          <div className="w-full flex justify-center mt-12">
            <button
              onClick={handleShowMore}
              className="bg-white border border-emerald-200 text-emerald-700 hover:bg-emerald-50 font-semibold px-8 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 flex items-center gap-2 group"
            >
              <span>Load More Articles</span>
              <svg className="w-5 h-5 transform group-hover:translate-y-0.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </main>
  </div>
)

}

export default Search
