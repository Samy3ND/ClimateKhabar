import React from "react"
import { Link } from "react-router-dom"

// ----- Static ad registry (edit here only) -----
export const ADS_CONFIG = {
  // Slot-based ads
  home_top: {
    href: "https://www.setopati.com",
    src: "https://www.setopati.com/uploads/bigyaapan/71654500.gif",
    alt: "Setopati Banner",
    variant: "banner",
  },
  about_banner: {
    href: "https://www.setopati.com",
    src: "https://www.setopati.com/uploads/bigyaapan/71654500.gif",
    alt: "About Page Banner",
    variant: "banner",
  },
  post_inline: {
    href: "https://www.setopati.com",
    src: "https://www.setopati.com/uploads/bigyaapan/71654500.gif",
    alt: "Inline Post Ad",
    variant: "rectangle",
  },

  // Category-based defaults
  byCategory: {
    worldnews: {
      href: "https://www.setopati.com",
      src: "https://www.setopati.com/uploads/bigyaapan/71654500.gif",
      alt: "World News Ad",
      variant: "banner",
    },
    sportsnews: {
      href: "https://www.espn.com",
      src: "https://via.placeholder.com/800x150?text=Sports+Ad",
      alt: "Sports Ad",
      variant: "banner",
    },
    localnews: {
      href: "https://www.setopati.com",
      src: "https://via.placeholder.com/800x150?text=Local+Ad",
      alt: "Local News Ad",
      variant: "banner",
    },
    default: {
      href: "https://www.setopati.com",
      src: "https://www.setopati.com/uploads/bigyaapan/71654500.gif",
      alt: "Default Banner",
      variant: "banner",
    },
  },
}

// ----- Base ad component (dumb/presentational) -----
export const Advertise = ({
  href,
  src,
  alt = "Advertisement",
  variant = "banner",
  className = "",
}) => {
  // size styles per variant (tweak as needed)
  const variantClasses = {
    banner: "w-full max-w-5xl",
    rectangle: "w-full max-w-3xl",
    square: "w-80",
    skyscraper: "w-64",
  }

  return (
    <div className={`flex justify-center items-center p-4 ${className}`}>
      <Link
        to={href}
        target="_blank"
        rel="noopener noreferrer"
        className="block rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
        aria-label={alt}
      >
        <img
          src={src}
          alt={alt}
          className={`${variantClasses[variant] || variantClasses.banner} h-auto object-cover`}
          loading="lazy"
        />
      </Link>
    </div>
  )
}

// ----- Slot wrapper: choose ad by slot or category from the registry -----
export const AdSlot = ({
  slot,                // e.g., "home_top" | "about_banner" | "post_inline"
  category,            // e.g., "worldnews"
  className = "",
}) => {
  // priority: slot > category > default
  const bySlot = slot ? ADS_CONFIG[slot] : null
  const byCat =
    category && ADS_CONFIG.byCategory?.[category?.toLowerCase?.()] 
      ? ADS_CONFIG.byCategory[category.toLowerCase()]
      : ADS_CONFIG.byCategory?.default

  const ad = bySlot || byCat

  if (!ad?.src || !ad?.href) return null

  return <Advertise {...ad} className={className} />
}

export default Advertise
