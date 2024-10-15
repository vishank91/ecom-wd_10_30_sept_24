const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Full Name is Mendatory"]
    },
    username: {
        type: String,
        required: [true, "User Name is Mendatory"],
        unique: true
    },
    email: {
        type: String,
        required: [true, "Email Address is Mendatory"],
        unique: true
    },
    phone: {
        type: String,
        required: [true, "Phone Number is Mendatory"]
    },
    password: {
        type: String,
        required: [true, "Password is Mendatory"]
    },
    address: {
        type: String,
        default:""
    },
    pin: {
        type: String,
        default:""
    },
    city: {
        type: String,
        default:""
    },
    state: {
        type: String,
        default:""
    },
    role: {
        type: String,
        default:"Buyer"
    },
    otp: {
        type: Number,
        default:-23456753421345
    },
    pic: {
        type: String,
        default:""
    },
    active: {
        type: Boolean,
        default: true
    }
})
const User = new mongoose.model("User", UserSchema)
module.exports = User