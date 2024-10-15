const TestimonialRouter = require("express").Router()
const { testimonialUploader } = require("../middleware/fileUploader")
const { verifyAdmin } = require("../middleware/verification")
const {
    createRecord,
    getAllRecords,
    getSingleRecord,
    updateRecord,
    deleteRecord
} = require("../controllers/TestimonialController")

TestimonialRouter.post("/", verifyAdmin, testimonialUploader.single("pic"), createRecord)
TestimonialRouter.get("/", getAllRecords)
TestimonialRouter.get("/:_id", getSingleRecord)
TestimonialRouter.put("/:_id", verifyAdmin, testimonialUploader.single("pic"), updateRecord)
TestimonialRouter.delete("/:_id", verifyAdmin, deleteRecord)

module.exports = TestimonialRouter