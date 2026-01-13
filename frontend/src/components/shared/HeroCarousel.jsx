import React, { useCallback } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '../ui/button'
import { Link } from 'react-router-dom'

const HeroCarousel = ({ posts }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: false }),
  ]) 

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  if (!posts || posts.length === 0) return null

  // Ensure we use internal posts. The prop 'posts' is passed from Home.jsx which fetches /api/post/getPosts (internal).
  const carouselPosts = posts.slice(0, 5)

  return (
    // Added margins and rounded corners: "consistent left and right margins... not stretch edge-to-edge"
    <div className="relative group mx-auto max-w-7xl px-4 mt-6">
        <div className="relative overflow-hidden rounded-2xl md:rounded-3xl shadow-2xl h-[500px] md:h-[600px] w-full bg-slate-900">
          <div className="overflow-hidden h-full" ref={emblaRef}>
            <div className="flex h-full">
              {carouselPosts.map((post) => (
                <div className="relative flex-[0_0_100%] min-w-0 h-full" key={post._id}>
                  {/* Image Container */}
                  <div className="relative h-full w-full bg-slate-900">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700 opacity-0"
                      loading="eager"
                      onLoad={(e) => e.target.classList.remove('opacity-0')}
                      onError={(e) => { e.target.style.display = 'none' }} 
                    />
                    
                    {/* Fallback */}
                    <div className="absolute inset-0 bg-slate-900 -z-10" />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />
                    
                    {/* Content Overlay */}
                    <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 lg:p-14 pb-12 md:pb-16">
                      <div className="max-w-4xl space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        
                        {/* 1. Headline (Priority) */}
                        <Link to={`/post/${post.slug}`} className="block group">
                             <h2 className="text-3xl md:text-5xl font-serif font-bold leading-tight text-white drop-shadow-sm group-hover:underline decoration-emerald-500 decoration-2 underline-offset-4 transition-all">
                                {post.title}
                            </h2>
                        </Link>

                        {/* 2. Meta Info (Date, Category, Author) */}
                        <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-emerald-100/90 tracking-wide border-l-2 border-emerald-500 pl-4">
                            <span className="uppercase tracking-wider text-emerald-400 font-bold">
                                 {post.category || 'News'}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-emerald-500/50" />
                            <span>
                                 {new Date(post.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                            </span>
                             {post.username && (
                                <>
                                    <span className="w-1 h-1 rounded-full bg-emerald-500/50" />
                                    <span>By {post.username}</span>
                                </>
                            )}
                        </div>
                        
                        {/* 3. Excerpt (Low Priority) */}
                        <div className="max-w-2xl hidden md:block pt-2">
                            <p className="text-base md:text-lg text-slate-300 line-clamp-2 leading-relaxed font-light drop-shadow">
                               {post.summary ? post.summary.replace(/<[^>]*>/g, '') : (post.excerpt || '')}
                            </p>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <Button
            variant="ghost" 
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300"
            onClick={scrollPrev}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300"
            onClick={scrollNext}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
      </div>
    </div>
  )
}

export default HeroCarousel
