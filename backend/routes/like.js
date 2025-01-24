const express = require('express');
const router = express.Router();
const Like = require('../models/like'); // Import the Like model
const verifyToken = require('../verifyToken'); // Token verification middleware

// Create a like
router.post("/like", verifyToken, async (req, res) => {
    const { postId, userId } = req.body;

    try {
        const existingLike = await Like.findOne({ postId, userId });

        if (existingLike) {
            return res.status(400).json({ message: "Already liked." });
        }

        const newLike = new Like({ postId, userId });
        const savedLike = await newLike.save();

        res.status(201).json({ message: "Like added successfully.", like: savedLike });
    } catch (err) {
        res.status(500).json(err);
    }
});

// Remove a like
router.delete("/unlike", verifyToken, async (req, res) => {
    const { postId, userId } = req.body;

    try {
        const result = await Like.findOneAndDelete({ postId, userId });

        if (!result) {
            return res.status(404).json({ message: "Like not found." });
        }

        res.status(200).json({ message: "Like removed successfully." });
    } catch (err) {
        res.status(500).json(err);
    }
});

// Get total likes for a post
router.get("/:postId", async (req, res) => {
    try {
        const totalLikes = await Like.countDocuments({ postId: req.params.postId });
        res.status(200).json({ totalLikes });
    } catch (err) {
        res.status(500).json(err);
    }
});

// Check if a user has liked a post
router.get("/hasliked", verifyToken, async (req, res) => {
    const { postId, userId } = req.query;
    try {
        const hasLiked = await Like.exists({ postId, userId });
        res.status(200).json({ hasLiked: !!hasLiked });
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
