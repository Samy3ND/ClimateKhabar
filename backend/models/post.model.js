// models/post.model.js
import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    author: { // ✅ who wrote it (Mongo ref)
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // optional denorm (handy for cards; not required)
    authorUsername: String,
    authorAvatar: String,

    title: { type: String, required: true, unique: true, trim: true },
    category: { type: String, default: "uncategorized", index: true },
    image: {
      type: String,
      default:
        "https://images.pexels.com/photos/723072/pexels-photo-723072.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    content: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);
export default Post;
