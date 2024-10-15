const MaincategoryRouter = require("express").Router()
const { verifyAdmin } = require("../middleware/verification")
const {
    createRecord,
    getAllRecords,
    getSingleRecord,
    updateRecord,
    deleteRecord
} = require("../controllers/MaincategoryController")

MaincategoryRouter.post("/", verifyAdmin, createRecord)
MaincategoryRouter.get("/", getAllRecords)
MaincategoryRouter.get("/:_id", getSingleRecord)
MaincategoryRouter.put("/:_id", verifyAdmin, updateRecord)
MaincategoryRouter.delete("/:_id", verifyAdmin, deleteRecord)

module.exports = MaincategoryRouter