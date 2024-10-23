import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String,
        required: false
    },
    gender: {
        type: String,
        required: true,
        enum: ['male', 'female']
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;