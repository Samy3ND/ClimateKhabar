import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import DashboardCard from "./DashboardCard"
import { convertToReadableFormat } from "@/lib/utils"
import { Button } from "../ui/button"
import { Link } from "react-router-dom"
import { Heart } from "lucide-react"

const MainDashboard = () => {
  const [users, setUsers] = useState([])
  const [comments, setComments] = useState([])
  const [posts, setPosts] = useState([])

  //   console.log(users)
  //   console.log(comments)
  //   console.log(posts)

  const [totalUsers, setTotalUsers] = useState(0)
  const [totalPosts, setTotalPosts] = useState(0)
  const [totalComments, setTotalComments] = useState(0)
  const [lastMonthUsers, setLastMonthUsers] = useState(0)
  const [lastMonthPosts, setLastMonthPosts] = useState(0)
  const [lastMonthComments, setLastMonthComments] = useState(0)

  const { currentUser } = useSelector((state) => state.user)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/user/getusers?limit=5")

        const data = await res.json()

        if (res.ok) {
          setUsers(data.users)
          setTotalUsers(data.totalUsers)
          setLastMonthUsers(data.lastMonthUsers)
        }
      } catch (error) {
        console.log(error.message)
      }
    }

    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/post/getposts?limit=5")

        const data = await res.json()

        if (res.ok) {
          setPosts(data.posts)
          setTotalPosts(data.totalPosts)
          setLastMonthPosts(data.lastMonthPosts)
        }
      } catch (error) {
        console.log(error.message)
      }
    }

    const fetchComments = async () => {
      try {
        const res = await fetch("/api/comment/getcomments?limit=5")

        const data = await res.json()

        if (res.ok) {
          setComments(data.comments)
          setTotalComments(data.totalComments)
          setLastMonthComments(data.lastMonthComments)
        }
      } catch (error) {
        console.log(error)
      }
    }

    if (currentUser.isAdmin) {
      fetchUsers()
      fetchPosts()
      fetchComments()
    }
  }, [currentUser])

return (
  <div className="p-6 max-w-7xl mx-auto">
    {/* Stats Cards Section */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <DashboardCard
        title="All Users"
        description={`${convertToReadableFormat(
          currentUser.createdAt
        )} - ${convertToReadableFormat(Date.now())}`}
        chartData={[{ value: totalUsers, fill: "#3b82f6" }]}
        chartConfig={{
          users: { label: "Users" },
        }}
        totalValue={totalUsers}
        lastMonthValue={lastMonthUsers}
        footerText={"Showing total users for all time"}
        endAngle={250}
      />

      <DashboardCard
        title="All Comments"
        description={`${convertToReadableFormat(
          currentUser.createdAt
        )} - ${convertToReadableFormat(Date.now())}`}
        chartData={[{ value: totalUsers, fill: "#f97316" }]}
        chartConfig={{
          users: { label: "Users" },
        }}
        totalValue={totalComments}
        lastMonthValue={lastMonthComments}
        footerText={"Showing total comments for all time"}
        endAngle={160}
      />

      <DashboardCard
        title="All Posts"
        description={`${convertToReadableFormat(
          currentUser.createdAt
        )} - ${convertToReadableFormat(Date.now())}`}
        chartData={[{ value: totalUsers, fill: "#10b981" }]}
        chartConfig={{
          users: { label: "Users" },
        }}
        totalValue={totalPosts}
        lastMonthValue={lastMonthPosts}
        footerText={"Showing total posts for all time"}
        endAngle={110}
      />
    </div>

    {/* Recent Data Section */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Recent Users */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800">Recent Users</h2>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-4 py-2">
            <Link to={"/dashboard?tab=users"}>See all</Link>
          </Button>
        </div>
        
        <div className="p-4">
          {users.map((user) => (
            <div key={user._id} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors duration-200">
              <img
                src={user.profilePicture}
                alt={user.username}
                className="w-12 h-12 object-cover rounded-full border-2 border-slate-200"
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-800 truncate">@{user.username}</p>
                <p className="text-slate-500 text-sm truncate">{user.email}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Comments */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800">Recent Comments</h2>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-4 py-2">
            <Link to={"/dashboard?tab=comments"}>See all</Link>
          </Button>
        </div>
        
        <div className="p-4">
          {comments && comments.map((comment) => (
            <div key={comment._id} className="p-3 hover:bg-slate-50 rounded-xl transition-colors duration-200">
              <p className="text-slate-700 line-clamp-2 text-sm mb-2">{comment.content}</p>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>@{comment.userId?.username || 'Unknown'}</span>
                <div className="flex items-center gap-1">
                  <Heart className="w-3 h-3 text-rose-500" />
                  <span>{comment.numberOfLikes}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Posts */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800">Recent Posts</h2>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-4 py-2">
            <Link to={"/dashboard?tab=posts"}>See all</Link>
          </Button>
        </div>
        
        <div className="p-4">
          {posts && posts.map((post) => (
            <div key={post._id} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors duration-200">
              <img
                src={post.image}
                alt={post.title}
                className="w-12 h-12 object-cover rounded-lg bg-slate-200"
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-800 text-sm line-clamp-2 mb-1">{post.title}</p>
                <span className="inline-block bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-full capitalize">
                  {post.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
)
}

export default MainDashboard
