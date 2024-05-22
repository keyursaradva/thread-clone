import mongoose from 'mongoose';

const userSchma = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        minLength: 6,
        required: true,
    },
    profilePic:{
        type: String,
        default: "",
    },
    followers:{
        type: [string],
        default: [],
    },
    following:{
        type: [string],
        default: [],
    },
    bio:{
        type: String,
        default: "",
    },
},{
    timestamps: true,
})

const User = mongoose.model('User', userSchma);

export default User;