import Joi from "joi";

const postsValidation = Joi.object({
  title: Joi.string().max(30).required(),
  description: Joi.string().max(200),
  image: Joi.array().items(Joi.string()).required(),
  price: Joi.number().integer().required(),
  username: Joi.string().required(),
});

export { postsValidation };
