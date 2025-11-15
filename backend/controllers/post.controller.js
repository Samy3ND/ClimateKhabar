// controllers/post.controller.js
import Post from "../models/post.model.js";
import User from "../models/user.model.js"; // to fetch username/avatar for denorm
import { errorHandler } from "../utils/error.js";
import main from "./gemini.js";

function slugify(title) {
  return title
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export const create = async (req, res, next) => {
  if (!req.user?.isAdmin) {
    return next(errorHandler(403, "You are not authorized to create a post!"));
  }
  if (!req.body.title || !req.body.content) {
    return next(errorHandler(400, "Please provide all the required fields!"));
  }

  try {
    const baseSlug = slugify(req.body.title);
    let slug = baseSlug;
    let i = 1;
    while (await Post.exists({ slug })) slug = `${baseSlug}-${i++}`;

    // optional denorm: grab username & avatar for quick lists
    const u = await User.findById(req.user.id).select("username profilePicture");

    const newPost = new Post({
      title: req.body.title,
      category: req.body.category,
      image: req.body.image,
      content: req.body.content,
      slug,

      author: req.user.id,                         // ✅ secure source of truth
      authorUsername: u?.username,
      authorAvatar: u?.profilePicture,
    });

    const saved = await newPost.save();
    const populated = await saved.populate("author", "username email profilePicture isAdmin");
    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

export const getPosts = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;

    const q = {
      ...(req.query.userId && { author: req.query.userId }), // now matches User._id
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { content: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    };

    const posts = await Post.find(q)
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit)
      .populate("author", "username email profilePicture isAdmin");

    const totalPosts = await Post.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const lastMonthPosts = await Post.countDocuments({ createdAt: { $gte: oneMonthAgo } });

    res.status(200).json({ posts, totalPosts, lastMonthPosts });
  } catch (error) {
    next(error);
  }
};

export const deletepost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId).select("author");
    if (!post) return next(errorHandler(404, "Post not found"));

    const isOwner = String(post.author) === String(req.user.id);
    if (!req.user.isAdmin && !isOwner) {
      return next(errorHandler(403, "You are not authorized to delete this post!"));
    }

    await Post.findByIdAndDelete(req.params.postId);
    res.status(200).json("Post has been deleted!");
  } catch (error) {
    next(error);
  }
};

export const updatepost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId).select("author");
    if (!post) return next(errorHandler(404, "Post not found"));

    const isOwner = String(post.author) === String(req.user.id);
    if (!req.user.isAdmin && !isOwner) {
      return next(errorHandler(403, "You are not authorized to update this post!"));
    }

    const update = {
      title: req.body.title,
      content: req.body.content,
      category: req.body.category,
      image: req.body.image,
    };

    // keep slug unique if title changes
    if (req.body.title) {
      const baseSlug = slugify(req.body.title);
      let slug = baseSlug;
      let i = 1;
      while (await Post.exists({ slug, _id: { $ne: req.params.postId } })) {
        slug = `${baseSlug}-${i++}`;
      }
      update.slug = slug;
    }

    const updated = await Post.findByIdAndUpdate(
      req.params.postId,
      { $set: update },
      { new: true }
    ).populate("author", "username email profilePicture isAdmin");

    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

export const generateContent = async (req, res, next) => {
  try {
    const { prompt } = req.body;  
    
    if (!prompt) {
      return res.status(400).json({
        success: false, 
        message: "Prompt is required"
      });
    }
    
    console.log("Generating content for:", prompt);
    
    // Make sure you're passing the prompt correctly to main()
    const content = await main(prompt); // Just pass the prompt string
    
    res.json({ success: true, content });
    
  } catch (error) {
    console.error("Backend error in generateContent:", error);
    res.status(500).json({
      success: false, 
      message: error.message || "Internal server error in AI generation"
    });
  }
}