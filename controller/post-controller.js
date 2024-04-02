import {
  createPostHandler,
  deleteImagePostsHandler,
  getAllPostsHandler,
  getImagePostHandler,
  updatePostHandler,
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

const updatePostController = async (req, res, next) => {
  try {
    const result = await updatePostHandler(req, res);
    res.json({
      message: "Update success",
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

const getImagePostController = async (req, res, next) => {
  try {
    const result = await getImagePostHandler(req, res);
    res.json({
      message: "Get image from posts success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteImagePostsController = async (req, res, next) => {
  try {
    const result = await deleteImagePostsHandler(req, res);
    res.json({
      message: "Delete images success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export {
  createPostController,
  getPostController,
  updatePostController,
  deleteImagePostsController,
  getImagePostController,
};
