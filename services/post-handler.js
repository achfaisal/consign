import { ResponseError } from "../error/response-error.js";
import { prismaClient } from "../application/database.js";
import { postsValidation } from "../validation/post-validation.js";

const createPostHandler = async (req, res) => {
  const request = req.body;

  if (req.file) {
    request.image = req.file.path;
  }

  const validatedPayload = postsValidation.validate(request);

  const postCount = await prismaClient.post.count({
    where: {
      title: validatedPayload.value.title,
    },
  });

  if (postCount === 1) {
    throw new ResponseError(400, "Post already exist");
  }
  console.log(validatedPayload);

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

const getAllPostsHandler = async () => {
  const allPosts = await prismaClient.post.findMany();

  console.log(allPosts);
  return allPosts;
};

export { createPostHandler, getAllPostsHandler };
