const SubcategoryRouter = require("express").Router()
const { verifyAdmin } = require("../middleware/verification")
const {
    createRecord,
    getAllRecords,
    getSingleRecord,
    updateRecord,
    deleteRecord
} = require("../controllers/SubcategoryController")

SubcategoryRouter.post("/", verifyAdmin, createRecord)
SubcategoryRouter.get("/", getAllRecords)
SubcategoryRouter.get("/:_id", getSingleRecord)
SubcategoryRouter.put("/:_id", verifyAdmin, updateRecord)
SubcategoryRouter.delete("/:_id", verifyAdmin, deleteRecord)

module.exports = SubcategoryRouter