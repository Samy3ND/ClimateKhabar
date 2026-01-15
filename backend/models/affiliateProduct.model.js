// models/affiliateProduct.model.js
import mongoose from "mongoose";

const affiliateProductSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        price: {
            type: String, // String to allow flexible formatting like "Rs. 3,500"
            required: true,
        },
        originalPrice: {
            type: String, // Original price for showing discount
            default: "",
        },
        image: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
            enum: ["solar-tech", "reusables", "bags", "gardening", "home", "transport", "fashion", "other"],
            default: "other",
        },
        affiliateLink: {
            type: String,
            required: true, // The external e-commerce link
        },
        badge: {
            type: String,
            enum: ["", "best-seller", "eco-choice", "new", "trending", "limited"],
            default: "",
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        clicks: {
            type: Number,
            default: 0, // Track how many times this product link was clicked
        },
        addedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

const AffiliateProduct = mongoose.model("AffiliateProduct", affiliateProductSchema);
export default AffiliateProduct;
