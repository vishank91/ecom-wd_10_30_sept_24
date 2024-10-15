const ProductRouter = require("express").Router()
const { productUploader } = require("../middleware/fileUploader")
const { verifyAdmin, verifyBoth } = require("../middleware/verification")
const {
    createRecord,
    getAllRecords,
    getSingleRecord,
    updateRecord,
    deleteRecord,
    updateRecordQuantity
} = require("../controllers/ProductController")

ProductRouter.post("/", verifyAdmin, productUploader.array("pic"), createRecord)
ProductRouter.get("/", getAllRecords)
ProductRouter.get("/:_id", getSingleRecord)
ProductRouter.put("/:_id", verifyAdmin, productUploader.array("pic"), updateRecord)
ProductRouter.put("/quantity/:_id", verifyBoth, updateRecordQuantity)
ProductRouter.delete("/:_id", verifyAdmin, deleteRecord)

module.exports = ProductRouter