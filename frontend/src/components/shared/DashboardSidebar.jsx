import { signOutSuccess } from "@/redux/user/userSlice"
import React from "react"
import { FaComments, FaSignOutAlt, FaUserAlt, FaUsers } from "react-icons/fa"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { IoIosCreate, IoIosDocument } from "react-icons/io"
import { MdDashboardCustomize } from "react-icons/md"

const DashboardSidebar = () => {
  const dispatch = useDispatch()

  const { currentUser } = useSelector((state) => state.user)

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
  <aside className="h-screen w-72 bg-gradient-to-b from-white to-slate-50 text-slate-800 flex flex-col shadow-xl border-r border-slate-200">
    {/* Logo/ Header */}
    <div className="p-6 flex items-center justify-between border-b border-slate-200">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center shadow-sm">
          <span className="text-white font-bold text-lg">C</span>
        </div>
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-slate-500 text-xs">Climate Khabar</p>
        </div>
      </div>
    </div>

    {/* Navigation Links */}
    <nav className="flex-1 p-6">
      <ul className="space-y-2">
        {currentUser && currentUser.isAdmin && (
          <li>
            <Link
              to={""}
              className="flex items-center p-3 hover:bg-emerald-50 rounded-xl transition-all duration-300 group hover:translate-x-2 border border-transparent hover:border-emerald-200"
            >
              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-emerald-200">
                <MdDashboardCustomize className="text-emerald-600" />
              </div>
              <span className="font-medium text-slate-700">Dashboard</span>
            </Link>
          </li>
        )}

        <li>
          <Link
            to={"/dashboard?tab=profile"}
            className="flex items-center p-3 hover:bg-blue-50 rounded-xl transition-all duration-300 group hover:translate-x-2 border border-transparent hover:border-blue-200"
          >
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-blue-200">
              <FaUserAlt className="text-blue-600" />
            </div>
            <span className="font-medium text-slate-700">Profile</span>
          </Link>
        </li>

        {currentUser && currentUser.isAdmin && (
          <li>
            <Link
              to={"/create-post"}
              className="flex items-center p-3 hover:bg-purple-50 rounded-xl transition-all duration-300 group hover:translate-x-2 border border-transparent hover:border-purple-200"
            >
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-purple-200">
                <IoIosCreate className="text-purple-600" />
              </div>
              <span className="font-medium text-slate-700">Create Post</span>
            </Link>
          </li>
        )}

        {currentUser && currentUser.isAdmin && (
          <li>
            <Link
              to={"/dashboard?tab=posts"}
              className="flex items-center p-3 hover:bg-amber-50 rounded-xl transition-all duration-300 group hover:translate-x-2 border border-transparent hover:border-amber-200"
            >
              <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-amber-200">
                <IoIosDocument className="text-amber-600" />
              </div>
              <span className="font-medium text-slate-700">Your Articles</span>
            </Link>
          </li>
        )}

        {currentUser && currentUser.isAdmin && (
          <li>
            <Link
              to={"/dashboard?tab=users"}
              className="flex items-center p-3 hover:bg-rose-50 rounded-xl transition-all duration-300 group hover:translate-x-2 border border-transparent hover:border-rose-200"
            >
              <div className="w-8 h-8 bg-rose-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-rose-200">
                <FaUsers className="text-rose-600" />
              </div>
              <span className="font-medium text-slate-700">All Users</span>
            </Link>
          </li>
        )}

        {currentUser && currentUser.isAdmin && (
          <li>
            <Link
              to={"/dashboard?tab=comments"}
              className="flex items-center p-3 hover:bg-indigo-50 rounded-xl transition-all duration-300 group hover:translate-x-2 border border-transparent hover:border-indigo-200"
            >
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-indigo-200">
                <FaComments className="text-indigo-600" />
              </div>
              <span className="font-medium text-slate-700">All Comments</span>
            </Link>
          </li>
        )}
      </ul>
    </nav>

    {/* User Info & Logout */}
    <div className="p-6 border-t border-slate-200">
      <div className="flex items-center gap-3 mb-4 p-3 bg-slate-100 rounded-xl">
        <img
          src={currentUser.profilePicture}
          alt="Profile"
          className="w-10 h-10 rounded-full border-2 border-emerald-500/30 shadow-sm"
        />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm truncate text-slate-800">@{currentUser.username}</p>
          <p className="text-slate-500 text-xs truncate">{currentUser.email}</p>
        </div>
      </div>

      <button
        className="flex items-center w-full p-3 hover:bg-red-50 rounded-xl transition-all duration-300 group hover:translate-x-2 text-red-600 hover:text-red-700 border border-transparent hover:border-red-200"
        onClick={handleSignout}
      >
        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-red-200">
          <FaSignOutAlt />
        </div>
        <span className="font-medium">Logout</span>
      </button>
    </div>
  </aside>
)
}

export default DashboardSidebar
