import { ResponseError } from "../error/response-error.js";
import { prismaClient } from "../application/database.js";
import { postsValidation } from "../validation/post-validation.js";

const createPostHandler = async (req, res) => {
  const request = req.body;

  const images = req.files;
  let imagesArray = [];
  images.map((image) => {
    imagesArray.push(image.path);
  });

  const validatedPayload = postsValidation.validate({
    title: request.title,
    description: request.description,
    price: request.price,
    image: imagesArray,
    username: request.username,
  });

  console.log(validatedPayload.value);

  if (validatedPayload.error) {
    const error = validatedPayload.error.details.map((error) => error.message);
    throw new ResponseError(400, error);
  }

  const postCount = await prismaClient.post.count({
    where: {
      title: validatedPayload.value.title,
    },
  });

  if (postCount === 1) {
    throw new ResponseError(400, "Post already exist");
  }
  console.log(req.file);
  return prismaClient.post.create({
    data: {
      title: validatedPayload.value.title,
      description: validatedPayload.value.description,
      price: validatedPayload.value.price,
      image: validatedPayload.value.image,
      userId: validatedPayload.value.username,
    },
  });
};

const getImagePostHandler = async (req, res) => {
  const postId = req.body.id;
  const post = await prismaClient.post.findUnique({
    where: {
      id: postId,
    },
  });

  if (!post) {
    throw new ResponseError(403, "No post exist");
  }

  return post.image;
};

const updatePostHandler = async (req, res) => {
  const request = req.body;
  const images = req.files;
  const id = parseInt(request.id);
  const isAvailable = request.isAvailable;
  const boolValue = isAvailable === "true";
  console.log("Req id", request.id);

  const post = await prismaClient.post.findUnique({
    where: {
      id: id,
    },
  });

  if (!post) {
    throw new ResponseError(403, "No post exist");
  }
  return post;
  // Get the current array of image paths
  // let imagesArray = post.image || [];
  //
  // images.map((image) => {
  //   imagesArray.push(image.path);
  // });
  // console.log(imagesArray);

  let updateData = {
    title: request.title,
    description: request.description,
    price: parseInt(request.price),
    // image: imagesArray,
    isAvailable: boolValue,
  };

  const postCount = await prismaClient.post.count({
    where: {
      userId: request.username,
      id: id,
    },
  });

  if (postCount === 0) {
    throw new ResponseError(403, "No post exist");
  }

  return prismaClient.post.update({
    where: {
      id: id,
    },
    data: updateData,
  });
};

const deleteImagePostsHandler = async (req, res) => {
  const postId = req.body.id;
  const imageIndex = req.body.imageIndex;
  // const postId = parseInt(req.params.id);
  // const imageIndex = parseInt(req.params.index);

  // Fetch the current post from the database
  const post = await prismaClient.post.findUnique({
    where: {
      id: postId,
    },
  });

  if (!post) {
    throw new ResponseError(403, "No post exist");
  }

  // Get the current array of image paths
  let imagesArray = post.image || [];

  // Check if the image index is valid
  if (imageIndex < 0 || imageIndex >= imagesArray.length) {
    throw new ResponseError(400, "Invalid image index");
  }

  // Remove the image path at the specified index
  imagesArray.splice(imageIndex, 1);
  console.log(imagesArray);

  let updateData = {
    image: imagesArray,
  };

  return prismaClient.post.update({
    where: {
      id: postId,
    },
    data: updateData,
  });
};

const getAllPostsHandler = async () => {
  const allPosts = await prismaClient.post.findMany();

  console.log(allPosts);
  return allPosts;
};

export {
  createPostHandler,
  getAllPostsHandler,
  updatePostHandler,
  deleteImagePostsHandler,
  getImagePostHandler,
};
