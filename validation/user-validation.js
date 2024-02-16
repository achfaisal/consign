import Joi from "joi";

const registrationUserValidation = Joi.object({
  username: Joi.string().min(5).max(20).required(),
  password: Joi.string().min(6).max(30).required(),
  name: Joi.string().max(100).required(),
});

const loginUserValidation = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

export { registrationUserValidation, loginUserValidation };
