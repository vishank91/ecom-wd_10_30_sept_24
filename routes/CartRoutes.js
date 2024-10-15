const CartRouter = require("express").Router()
const { verifyBoth } = require("../middleware/verification")
const {
    createRecord,
    getAllRecords,
    getSingleRecord,
    updateRecord,
    deleteRecord
} = require("../controllers/CartController")

CartRouter.post("/", verifyBoth, createRecord)
CartRouter.get("/:userid", verifyBoth, getAllRecords)
CartRouter.get("/single/:_id", verifyBoth, getSingleRecord)
CartRouter.put("/:_id", verifyBoth, updateRecord)
CartRouter.delete("/:_id", verifyBoth, deleteRecord)

module.exports = CartRouter