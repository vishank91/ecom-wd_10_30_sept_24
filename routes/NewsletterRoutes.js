const NewsletterRouter = require("express").Router()
const { verifyAdmin } = require("../middleware/verification")
const {
    createRecord,
    getAllRecords,
    getSingleRecord,
    updateRecord,
    deleteRecord
} = require("../controllers/NewsletterController")

NewsletterRouter.post("/", createRecord)
NewsletterRouter.get("/", verifyAdmin, getAllRecords)
NewsletterRouter.get("/:_id", verifyAdmin, getSingleRecord)
NewsletterRouter.put("/:_id", verifyAdmin, updateRecord)
NewsletterRouter.delete("/:_id", verifyAdmin, deleteRecord)

module.exports = NewsletterRouter