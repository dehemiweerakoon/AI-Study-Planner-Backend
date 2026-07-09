const Joi = require("joi");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: [true, "First name is required"],
            trim: true,
            maxlength: [50, "First name cannot exceed 50 characters"],
        },
        lastName: {
            type: String,
            required: [true, "Last name is required"],
            trim: true,
            maxlength: [50, "Last name cannot exceed 50 characters"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            trim: true,
            lowercase: true,
            maxlength: [255, "Email cannot exceed 255 characters"],
        },
        password: {
            type: String,
            required: function(){
                return !this.googleId;
            },
            maxlength: [255, "Hashed password cannot exceed 255 characters"], // Suitable for bcrypt hashes
        },
        phone: {
            type: String,
            required: false,
            trim: true,
            maxlength: [15, "Phone number cannot exceed 15 characters"],
        },
        profileImage: {
            type: String,
            required: false,
            trim: true,
            maxlength: [2048, "Profile image URL cannot exceed 2048 characters"],
        },
        googleId: {
            type: String,
            unique: true,
            sparse: true,
        },
        role: {
            type: String,
            required: [true, "Role is required"],
            enum: ["user", "admin"],
            default: "user",
        },
        isVerified: {
            type: Boolean,
            required: true,
            default: false,
        },
    },
    {
        // Automatically handles 'createdAt' and 'updatedAt' fields
        timestamps: true,
    },
);

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign(
        { _id: this._id, isAdmin: this.role === "admin" },
        config.get("jwtPrivateKey"),
    );
    return token;
};

const User = mongoose.model("User", userSchema);

// validate user
const validateUser = (user) => {
    const schema = Joi.object({
        firstName: Joi.string().max(50).required().messages({
            "string.empty": "First name is required",
            "string.max": "First name cannot exceed 50 characters",
        }),
        lastName: Joi.string().max(50).required().messages({
            "string.empty": "Last name is required",
            "string.max": "Last name cannot exceed 50 characters",
        }),
        email: Joi.string().max(255).email().required().messages({
            "string.empty": "Email is required",
            "string.email": "Please provide a valid email address",
            "string.max": "Email cannot exceed 255 characters",
        }),
        password: Joi.string().min(8).max(255).required().messages({
            "string.empty": "Password is required",
            "string.min": "Password must be at least 8 characters long",
            "string.max": "Password cannot exceed 255 characters",
        }),
        phone: Joi.string().max(15).allow("", null),
        profileImage: Joi.string().max(2048).uri().allow("", null).messages({
            "string.uri": "Profile image must be a valid URL",
        }),
        role: Joi.string().valid("user", "admin").default("user"),
        isVerified: Joi.boolean().default(false),
        googleId: Joi.string().allow("", null),
    });

    return schema.validate(user, { abortEarly: false }); // Returns all validation errors at once
};

const validateAuth = (req) => {
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(1024).required(),
    });
    return schema.validate(req);
};

module.exports = {
    User,
    validateUser,
    validateAuth,
};
