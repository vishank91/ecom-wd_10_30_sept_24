const WishlistRouter = require("express").Router()
const { verifyBoth } = require("../middleware/verification")
const {
    createRecord,
    getAllRecords,
    getSingleRecord,
    deleteRecord
} = require("../controllers/WishlistController")

WishlistRouter.post("/", verifyBoth, createRecord)
WishlistRouter.get("/:userid", verifyBoth, getAllRecords)
WishlistRouter.get("/single/:_id", verifyBoth, getSingleRecord)
WishlistRouter.delete("/:_id", verifyBoth, deleteRecord)

module.exports = WishlistRouter