import {
  createPostHandler,
  getAllPostsHandler,
} from "../services/post-handler.js";

const createPostController = async (req, res, next) => {
  try {
    const result = await createPostHandler(req, res);
    res.json({
      message: "Posting success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getPostController = async (req, res, next) => {
  try {
    const result = await getAllPostsHandler(req, res);
    res.json({
      message: "Get posts success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export { createPostController, getPostController };
