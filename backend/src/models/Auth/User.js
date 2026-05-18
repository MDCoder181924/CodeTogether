import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        username: {
            type: String,
            unique: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
        },

        profilePic: {
            type: String,
            default: "",
        },

        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },

        provider: {
            type: String,
            enum: ['local', 'google', 'github'],
            default: 'local',
        },

        isVerified: {
            type: Boolean,
            default: false,
        },

        twoFactorEnabled: {
            type: Boolean,
            default: false,
        },

        twoFactorSecret: {
            type: String,
            default: "",
        },

        refreshToken: {
            type: String,
            default: "",
        },

        lastLogin: {
            type: Date,
        },

        isOnline: {
            type: Boolean,
            default: false,
        },
    },
{timestamps: true,});

const User = mongoose.model('User' , userSchema);

export default User;