import express from "express";
import { createPost, deletePost, getFeedPosts, getPost, getUserPost, likeUnlikePost, replyPost } from "../controllers/postController.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();

router.get("/feed",protectRoute, getFeedPosts);
router.get("/:id", getPost);
router.get("/user/:username", getUserPost);
router.delete("/:id",protectRoute, deletePost);
router.post("/create", protectRoute,createPost);
router.put("/like/:id",protectRoute,likeUnlikePost);
router.put("/reply/:id",protectRoute,replyPost);

export default router;