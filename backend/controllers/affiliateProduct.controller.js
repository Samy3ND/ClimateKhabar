// controllers/affiliateProduct.controller.js
import AffiliateProduct from "../models/affiliateProduct.model.js";
import { errorHandler } from "../utils/error.js";

// Create a new affiliate product (Admin only)
export const createProduct = async (req, res, next) => {
    // Check if user is admin
    if (!req.user.isAdmin) {
        return next(errorHandler(403, "You are not allowed to create products"));
    }

    const { name, description, price, originalPrice, image, category, affiliateLink, badge } = req.body;

    if (!name || !description || !price || !image || !affiliateLink) {
        return next(errorHandler(400, "Please provide all required fields"));
    }

    try {
        const newProduct = new AffiliateProduct({
            name,
            description,
            price,
            originalPrice: originalPrice || "",
            image,
            category: category || "other",
            affiliateLink,
            badge: badge || "",
            addedBy: req.user.id,
        });

        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        next(error);
    }
};

// Get all affiliate products (Public)
export const getProducts = async (req, res, next) => {
    try {
        const { category, active, limit = 12, page = 1 } = req.query;

        const query = {};

        // Filter by category if provided
        if (category && category !== "all") {
            query.category = category;
        }

        // Filter by active status (default: only show active products for public)
        if (active !== "all") {
            query.isActive = true;
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const products = await AffiliateProduct.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .populate("addedBy", "username");

        const total = await AffiliateProduct.countDocuments(query);

        res.status(200).json({
            products,
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / parseInt(limit)),
        });
    } catch (error) {
        next(error);
    }
};

// Get single product by ID
export const getProductById = async (req, res, next) => {
    try {
        const product = await AffiliateProduct.findById(req.params.productId).populate("addedBy", "username");

        if (!product) {
            return next(errorHandler(404, "Product not found"));
        }

        res.status(200).json(product);
    } catch (error) {
        next(error);
    }
};

// Update a product (Admin only)
export const updateProduct = async (req, res, next) => {
    if (!req.user.isAdmin) {
        return next(errorHandler(403, "You are not allowed to update products"));
    }

    try {
        const updatedProduct = await AffiliateProduct.findByIdAndUpdate(
            req.params.productId,
            {
                $set: {
                    name: req.body.name,
                    description: req.body.description,
                    price: req.body.price,
                    originalPrice: req.body.originalPrice,
                    image: req.body.image,
                    category: req.body.category,
                    affiliateLink: req.body.affiliateLink,
                    badge: req.body.badge,
                    isActive: req.body.isActive,
                },
            },
            { new: true }
        );

        if (!updatedProduct) {
            return next(errorHandler(404, "Product not found"));
        }

        res.status(200).json(updatedProduct);
    } catch (error) {
        next(error);
    }
};

// Delete a product (Admin only)
export const deleteProduct = async (req, res, next) => {
    if (!req.user.isAdmin) {
        return next(errorHandler(403, "You are not allowed to delete products"));
    }

    try {
        const deletedProduct = await AffiliateProduct.findByIdAndDelete(req.params.productId);

        if (!deletedProduct) {
            return next(errorHandler(404, "Product not found"));
        }

        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        next(error);
    }
};

// Track product click (Public - increments click count)
export const trackClick = async (req, res, next) => {
    try {
        const product = await AffiliateProduct.findByIdAndUpdate(
            req.params.productId,
            { $inc: { clicks: 1 } },
            { new: true }
        );

        if (!product) {
            return next(errorHandler(404, "Product not found"));
        }

        // Return the affiliate link so frontend can redirect
        res.status(200).json({ affiliateLink: product.affiliateLink });
    } catch (error) {
        next(error);
    }
};

// Get product stats (Admin only - for analytics)
export const getProductStats = async (req, res, next) => {
    if (!req.user.isAdmin) {
        return next(errorHandler(403, "You are not allowed to view stats"));
    }

    try {
        const totalProducts = await AffiliateProduct.countDocuments();
        const activeProducts = await AffiliateProduct.countDocuments({ isActive: true });
        const totalClicks = await AffiliateProduct.aggregate([
            { $group: { _id: null, total: { $sum: "$clicks" } } }
        ]);

        const topProducts = await AffiliateProduct.find()
            .sort({ clicks: -1 })
            .limit(5)
            .select("name clicks category");

        const categoryStats = await AffiliateProduct.aggregate([
            { $group: { _id: "$category", count: { $sum: 1 }, clicks: { $sum: "$clicks" } } }
        ]);

        res.status(200).json({
            totalProducts,
            activeProducts,
            totalClicks: totalClicks[0]?.total || 0,
            topProducts,
            categoryStats,
        });
    } catch (error) {
        next(error);
    }
};
