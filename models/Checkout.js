const mongoose = require("mongoose")

const CheckoutSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User Id is Mendatory"]
    },
    orderStatus: {
        type: String,
        default: "Order is Placed"
    },
    paymentMode: {
        type: String,
        default: "COD"
    },
    paymentStatus: {
        type: String,
        default: "Pending"
    },
    subtotal: {
        type: Number,
        required: [true, "Subtotal Amount is Mendatory"],
    },
    shipping: {
        type: Number,
        required: [true, "Shipping Amount is Mendatory"],
    },
    total: {
        type: Number,
        required: [true, "Total Amount is Mendatory"],
    },
    rppid: {
        type: String,
        default: ""
    },
    date: {
        type: String,
        default: ""
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: [true, "Product Id is Mendatory"]
            },
            qty: {
                type: Number,
                required: [true, "Checkout Product Quantity is Mendatory"],
            },
            total: {
                type: Number,
                required: [true, "Total Amount is Mendatory"],
            }
        }
    ]
})
const Checkout = new mongoose.model("Checkout", CheckoutSchema)
module.exports = Checkout