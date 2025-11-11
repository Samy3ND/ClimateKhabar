// backend/routes/auth.route.js
import express from "express"
import { google, signin, signup } from "../controllers/auth.controller.js"
import { verifyToken } from "../utils/verifyUser.js"
import User from "../models/user.model.js"

const router = express.Router()

router.post("/signup", signup)
router.post("/signin", signin)
router.post("/google", google)

// ✅ NEW: return current logged-in user from cookie-based session
router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "username email profilePicture isAdmin"
    )
    if (!user) return res.status(404).json({ message: "User not found" })
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})

export default router
