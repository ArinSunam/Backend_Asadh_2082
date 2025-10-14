import Joi from "joi";

export const registerValidationSchema = Joi.object({
  fullname: Joi.string().min(3).max(50).required().messages({
    "string.base": "Full name must be a string",
    "string.empty": "Full name is required",
    "string.min": "Full name must be at least 3 characters long",
    "any.required": "Full name is required",
  }),

  email: Joi.string().email().required().messages({
    "string.email": "Invalid email format",
    "string.empty": "Email is required",
    "any.required": "Email is required",
  }),

  password: Joi.string()
    .min(8)
    .max(30)
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"))
    .required()
    .messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 8 characters long",
      "string.pattern.base":
        "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character",
    }),

  profile_pic: Joi.string().uri().optional().messages({
    "string.uri": "Profile picture must be a valid URL",
  }),

  isAdmin: Joi.boolean().optional(),
  refresh_token: Joi.string().optional(),
});
