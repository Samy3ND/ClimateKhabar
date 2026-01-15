import React, { useEffect, useState } from "react"
import { ExternalLink, Leaf, ShoppingBag, Loader2 } from "lucide-react"

const CATEGORIES = [
  { value: "all", label: "All Products" },
  { value: "solar-tech", label: "Solar Tech" },
  { value: "reusables", label: "Reusables" },
  { value: "bags", label: "Bags" },
  { value: "gardening", label: "Gardening" },
  { value: "home", label: "Home" },
  { value: "transport", label: "Transport" },
  { value: "fashion", label: "Fashion" },
  { value: "other", label: "Other" },
]

const BADGE_STYLES = {
  "best-seller": "bg-amber-500 text-white",
  "eco-choice": "bg-emerald-500 text-white",
  "new": "bg-sky-500 text-white",
  "trending": "bg-purple-500 text-white",
  "limited": "bg-red-500 text-white",
}

const EcoProducts = ({ limit = 8, showFilters = true }) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("all")

  useEffect(() => {
    fetchProducts()
  }, [selectedCategory])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const categoryQuery = selectedCategory !== "all" ? `&category=${selectedCategory}` : ""
      const res = await fetch(`/api/affiliate-products?limit=${limit}${categoryQuery}`)
      const data = await res.json()
      if (res.ok) {
        setProducts(data.products)
      }
    } catch (error) {
      console.error("Failed to fetch products:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleProductClick = async (productId, affiliateLink) => {
    try {
      // Track the click
      await fetch(`/api/affiliate-products/click/${productId}`, {
        method: "POST",
      })
      // Open the affiliate link in a new tab
      window.open(affiliateLink, "_blank", "noopener,noreferrer")
    } catch (error) {
      // Still open the link even if tracking fails
      window.open(affiliateLink, "_blank", "noopener,noreferrer")
    }
  }

  const formatBadge = (badge) => {
    if (!badge) return null
    return badge.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")
  }

  if (loading) {
    return (
      <section className="bg-gradient-to-b from-emerald-50/50 to-white py-16">
        <div className="max-w-7xl mx-auto px-6 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        </div>
      </section>
    )
  }

  if (products.length === 0 && !loading) {
    return null // Don't show section if no products
  }

  return (
    <section className="bg-gradient-to-b from-emerald-50/50 to-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-emerald-100 rounded-full px-4 py-1.5 mb-4">
            <Leaf className="w-4 h-4 text-emerald-600" />
            <span className="text-emerald-700 text-sm font-medium">Sustainable Living</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Eco-Friendly Products
          </h2>
          
          <p className="text-slate-600 max-w-2xl mx-auto">
            Support sustainable brands and reduce your carbon footprint. 
            Every purchase helps fund climate journalism.
          </p>
        </div>

        {/* Category Filter */}
        {showFilters && (
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategory === cat.value
                    ? "bg-emerald-600 text-white shadow-lg"
                    : "bg-white text-slate-600 hover:bg-emerald-50 border border-slate-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              onClick={() => handleProductClick(product._id, product.affiliateLink)}
              className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-emerald-300 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/300x200?text=Product+Image"
                  }}
                />
                {product.badge && (
                  <span className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full ${BADGE_STYLES[product.badge] || "bg-slate-500 text-white"}`}>
                    {formatBadge(product.badge)}
                  </span>
                )}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg flex items-center justify-center">
                    <ExternalLink className="w-4 h-4 text-slate-600" />
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <span className="text-xs text-emerald-600 font-medium uppercase tracking-wide">
                  {product.category?.replace("-", " ")}
                </span>
                <h3 className="font-semibold text-slate-900 mt-1 group-hover:text-emerald-700 transition-colors">
                  {product.name}
                </h3>
                <p className="text-slate-500 text-sm mt-1 line-clamp-2">
                  {product.description}
                </p>
                
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-lg font-bold text-slate-900">{product.price}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-slate-400 line-through">{product.originalPrice}</span>
                  )}
                </div>

                <div className="mt-3 flex items-center gap-2 text-emerald-600 text-sm font-medium">
                  <ShoppingBag className="w-4 h-4" />
                  <span>Shop Now</span>
                  <ExternalLink className="w-3 h-3 ml-auto" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <p className="text-center text-slate-400 text-xs mt-10">
          🌿 As an affiliate, ClimateKhabar may earn a small commission from qualifying purchases at no extra cost to you.
        </p>
      </div>
    </section>
  )
}

export default EcoProducts
