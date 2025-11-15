import express from "express"
import { verifyToken } from "../utils/verifyUser.js"
import {
  create,
  deletepost,
  generateContent,
  getPosts,
  updatepost,
} from "../controllers/post.controller.js"

const router = express.Router()

router.post("/create", verifyToken, create)
router.get("/getposts", getPosts)
router.delete("/deletepost/:postId", verifyToken, deletepost)
router.put("/updatepost/:postId", verifyToken, updatepost)
router.post("/generate",verifyToken, generateContent)

export default router
