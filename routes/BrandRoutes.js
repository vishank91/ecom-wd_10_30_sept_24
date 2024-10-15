const BrandRouter = require("express").Router()
const { brandUploader } = require("../middleware/fileUploader")
const { verifyAdmin } = require("../middleware/verification")
const {
    createRecord,
    getAllRecords,
    getSingleRecord,
    updateRecord,
    deleteRecord
} = require("../controllers/BrandController")

BrandRouter.post("/", verifyAdmin, brandUploader.single("pic"), createRecord)
BrandRouter.get("/", getAllRecords)
BrandRouter.get("/:_id", getSingleRecord)
BrandRouter.put("/:_id", verifyAdmin, brandUploader.single("pic"), updateRecord)
BrandRouter.delete("/:_id", verifyAdmin, deleteRecord)

module.exports = BrandRouter