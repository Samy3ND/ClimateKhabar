import React, { useEffect, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { FaSearch } from "react-icons/fa"
import { Button } from "../ui/button"
import { useDispatch, useSelector } from "react-redux"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { signOutSuccess } from "@/redux/user/userSlice"
import NotificationBell from "./NotificationBell"

const Header = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()

  const { currentUser } = useSelector((state) => state.user)

  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const searchTermFromUrl = urlParams.get("searchTerm")
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl)
    }
  }, [location.search])

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

  const handleSubmit = (e) => {
    e.preventDefault()
    const urlParams = new URLSearchParams(location.search)
    urlParams.set("searchTerm", searchTerm)
    const searchQuery = urlParams.toString()
    navigate(`/search?${searchQuery}`)
  }

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-lg fixed top-0 left-0 right-0 z-50">
      <div className="flex justify-between items-center max-w-6xl lg:max-w-7xl mx-auto px-4 py-3">
        <Link to={"/"}>
          <h1 className="font-extrabold text-xl sm:text-2xl tracking-tight flex flex-wrap">
             <span className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-sky-600 bg-clip-text text-transparent">
                  ClimateKhabar
                </span>
          </h1>
        </Link>

        <form
          className="flex items-center gap-2 bg-slate-100 hover:bg-slate-100/90 rounded-full px-3 py-2 transition-colors focus-within:ring-2 focus-within:ring-emerald-500"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            placeholder="Search climate news..."
            className="bg-transparent w-28 sm:w-64 focus:outline-none text-slate-700 placeholder:text-slate-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <button className="p-2 rounded-md hover:bg-slate-200 transition-colors" aria-label="Search">
            <FaSearch className="text-slate-600" />
          </button>
        </form>

        <ul className="hidden lg:flex gap-6 items-center">
          <Link to={"/"}>
            <li className={`text-slate-700 hover:text-emrald-900 transition-colors ${
              location.pathname === "/" ? "font-bold text-emerald-600 underline underline-offset-4" : "hover:underline underline-offset-4"
            }`}>
              Home
            </li>
          </Link>

          <Link to={"/news"}>
            <li className={`text-slate-700 hover:text-slate-900 transition-colors ${
              location.pathname.includes("/news") ? "font-bold text-emerald-600 underline underline-offset-4" : "hover:underline underline-offset-4"
            }`}>
              News Articles
            </li>
          </Link>

          <Link to={"/about"}>
            <li className={`text-slate-700 hover:text-slate-900 transition-colors ${
              location.pathname === "/about" ? "font-bold text-emerald-600 underline underline-offset-4" : "hover:underline underline-offset-4"
            }`}>
              About
            </li>
          </Link>
        </ul>

        {currentUser ? (
          <div className="flex items-center gap-4">
              <NotificationBell currentUser={currentUser} />
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="rounded-full ring-1 ring-slate-200 hover:ring-emerald-400 transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    <img
                      src={currentUser.profilePicture}
                      alt="user photo"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </button>
                </DropdownMenuTrigger>
      
                <DropdownMenuContent className="w-64 rounded-xl shadow-xl border border-slate-200" align="end">
                  <DropdownMenuLabel className="font-semibold text-slate-800 px-3 py-2">
                    My Account
                  </DropdownMenuLabel>
      
                  <DropdownMenuSeparator className="bg-slate-200" />
      
                  <DropdownMenuItem className="px-3 py-2 cursor-default">
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold text-slate-800">@{currentUser.username}</span>
                      <span className="text-slate-500 text-sm">{currentUser.email}</span>
                    </div>
                  </DropdownMenuItem>
      
                  <DropdownMenuSeparator className="bg-slate-200" />
      
                  <DropdownMenuItem className="px-3 py-2 hover:bg-slate-50 cursor-pointer">
                    <Link to="/dashboard?tab=dashboard" className="w-full text-slate-700 hover:text-emerald-600">
                      My Dashboard
                    </Link>
                  </DropdownMenuItem>
      
                  <DropdownMenuItem className="px-3 py-2 hover:bg-slate-50 cursor-pointer">
                    <Link to="/dashboard?tab=profile" className="w-full text-slate-700 hover:text-emerald-600">
                      Profile
                    </Link>
                  </DropdownMenuItem>
      
                  <DropdownMenuSeparator className="bg-slate-200" />
      
                  <DropdownMenuItem
                    className="px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                    onClick={handleSignout}
                  >
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
          </div>
        ) : (
          <Link to={"/sign-in"}>
            <Button className="rounded-full px-5 bg-emerald-600 hover:bg-emerald-700">
              Sign In
            </Button>
          </Link>
        )}
      </div>
    </header>
  )
}

export default Header
