import express from "express";
import { createPost, searchPost, sortfetch } from "../controllers/post.js";
import { authorization } from "../middlewares/auth.js";

const postRouter = express.Router();

postRouter.post("/", authorization, createPost);
postRouter.get("/",sortfetch);
postRouter.get("/search",searchPost);

export default postRouter;