import {AdSlot} from "@/components/shared/Advertise"
import PostCard from "@/components/shared/PostCard"
import { Button } from "@/components/ui/button"
import { ArrowDown, ArrowRight } from "lucide-react"
import React, { useEffect, useState } from "react"
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
    <div className="min-h-screen bg-gradient-to-b from-white via-emerald-50/40 to-white pt-24">
      {/* HERO */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-24 -left-20 h-80 w-80 rounded-full bg-emerald-300/20 blur-3xl" />
          <div className="absolute -bottom-24 -right-20 h-80 w-80 rounded-full bg-sky-300/20 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24">
          <div className="max-w-3xl">
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200/70 bg-white/70 px-3 py-1 text-xs font-medium text-emerald-700">
              Climate Khabar • Nepal & Beyond
            </p>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.05]">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-sky-600 bg-clip-text text-transparent">
                Climate Khabar
              </span>
            </h1>

            <p className="mt-5 text-slate-600 text-xl leading-8">
              Daily climate news, environmental insights, and sustainability
              stories — focused on Nepal with a global lens.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {[
                "Nepal • Himalaya • Rivers",
                "Policy & Finance",
                "Disasters & Resilience",
                "Air • Water • Agriculture",
              ].map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-white text-slate-700 ring-1 ring-emerald-200 px-3 py-1 text-sm"
                >
                  {t}
                </span>
              ))}
            </div>

            <p className="mt-4 text-slate-500 italic">
              Stay aware, stay climate conscious.
            </p>
<div className="flex flex-col sm:flex-row gap-4 mt-8">
  <Link to={"/search"} className="flex-1 sm:flex-none">
    <Button className="w-full group bg-emerald-600 hover:bg-emerald-700 text-white h-12 rounded-full px-8 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
      View all posts
      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
    </Button>
  </Link>
  
    <a href="#latest-posts" className="flex-1 sm:flex-none">
    <Button className="w-full group bg-white border border-emerald-600 text-emerald-600 hover:bg-emerald-50 h-12 rounded-full px-8 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
      View Latest posts
      <ArrowDown className="ml-2 h-5 w-5 transition-transform group-hover:translate-y-0.5" />
    </Button>
  </a>
</div>
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <section className="pb-16 bg-white/60">
        <div className="max-w-7xl mx-auto text-center px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-10 text-slate-900">
            Why You'll Love Climate Khabar
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <FeatureCard
              title={"Reliable Climate Coverage"}
              description={
                "Explore verified news and reports on climate change, environment, and resilience."
              }
              icon="🌍"
            />
            <FeatureCard
              title={"Community Voices"}
              description={
                "Hear stories from activists, researchers, and communities on the frontlines of change."
              }
              icon="🗣️"
            />
            <FeatureCard
              title={"Simple & Accessible"}
              description={
                "Stay informed through an easy-to-use platform focused on clarity and impact."
              }
              icon="🌱"
            />
          </div>
        </div>
      </section>

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
    </div>
  )
}

const FeatureCard = ({ title, description, icon }) => {
  return (
    <div className="p-6 rounded-2xl border bg-white shadow-sm hover:shadow-md transition-shadow duration-300 text-left">
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-xl font-semibold text-slate-900 mb-1.5">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{description}</p>
    </div>
  )
}

export default Home
