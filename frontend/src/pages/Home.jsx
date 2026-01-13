import {AdSlot} from "@/components/shared/Advertise"
import PostCard from "@/components/shared/PostCard"
import { Button } from "@/components/ui/button"
import ClimateNews from "@/components/shared/ClimateNews"
import { ArrowDown, ArrowRight } from "lucide-react"
import React, { useEffect, useState } from "react"
import HeroCarousel from "@/components/shared/HeroCarousel"
import ClimateStats from "@/components/shared/ClimateStats"
import { Link } from "react-router-dom"

const Home = () => {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch("/api/post/getPosts?limit=6")
      const data = await res.json()
      if (res.ok) {
        setPosts(data.posts)
      }
    }
    fetchPosts()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-emerald-50/40 to-white">
      {/* HERO SECTION - FULL WIDTH CAROUSEL */}
      {/* HERO SECTION */}
      <section className="bg-transparent pb-4">
           {posts.length > 0 ? (
               <HeroCarousel posts={posts} />
             ) : (
                <div className="mx-auto max-w-7xl px-4 mt-6">
                   <div className="h-[500px] md:h-[600px] w-full animate-pulse bg-slate-200 rounded-3xl" />
                </div>
             )}
      </section>

      {/* CLIMATE STATS SECTION - REAL TIME METRICS */}
      <ClimateStats />

      {/* FEATURES (Renamed or Adjusted if needed, keeping for now but could be removed as per user preference) */}
      {/* User said: "Replace any 'Why you will love...' or descriptive sections with a real-time climate status panel"
          So I will COMMENT OUT the Features section or REMOVE it. Let's REMOVE it to be clean. 
      */}



      {/* AD */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="">
          <AdSlot />
        </div>
      </div>

      {/* TOP NEWS / RECENT POSTS */}
<section id="latest-posts" className="mt-10 bg-gradient-to-b from-white to-slate-50/60 scroll-mt-20">
  <div className="max-w-7xl mx-auto px-6 py-12">
    {posts && posts.length > 0 && (
      <div className="flex flex-col gap-8"> {/* Increased gap from gap-6 to gap-8 */}
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">
              Top News
            </h2>
            <p className="text-slate-500 mt-1">
              Today's highlights from our newsroom.
            </p>
          </div>
          <Link
            to={"/search"}
            className="text-emerald-700 hover:underline font-medium"
          >
            View all news
          </Link>
        </div>

        {/* Increased gap from gap-6 to gap-8 and added margin-bottom */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {posts.map((post) => (
            <div
              key={post._id}
              className="group rounded-2xl border border-slate-200/70 bg-white/80 backdrop-blur hover:bg-white transition-all hover:-translate-y-0.5"
            >
              <div className="p-0.5">
                <PostCard post={post} />
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2 text-center">
          <Link
            to={"/search"}
            className="inline-flex items-center gap-2 text-slate-700 hover:text-slate-900 hover:underline font-semibold"
          >
            Browse more <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    )}
  </div>
</section>

<section className="max-w-7xl mx-auto px-4 mt-10 mb-16">
    
      <ClimateNews pageSize={6} />
</section>

    </div>
  )
}



export default Home
