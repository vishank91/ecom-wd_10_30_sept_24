const CheckoutRouter = require("express").Router()
const { verifyAdmin, verifyBoth } = require("../middleware/verification")
const {
    createRecord,
    getAllRecords,
    getSingleRecord,
    updateRecord,
    deleteRecord,
    getAllUserRecords,
    order,
    verifyOrder,
} = require("../controllers/CheckoutController")

CheckoutRouter.post("/", verifyBoth, createRecord)
CheckoutRouter.get("/", verifyAdmin, getAllRecords)
CheckoutRouter.get("/user/:userid", verifyBoth, getAllUserRecords)
CheckoutRouter.get("/:_id", verifyBoth, getSingleRecord)
CheckoutRouter.put("/:_id", verifyAdmin, updateRecord)
CheckoutRouter.delete("/:_id", verifyAdmin, deleteRecord)
CheckoutRouter.post("/orders", verifyBoth, order)
CheckoutRouter.post("/verify", verifyBoth, verifyOrder)

module.exports = CheckoutRouter