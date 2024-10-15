const UserRouter = require("express").Router()
const { userUploader } = require("../middleware/fileUploader")
const { verifyAdmin, verifyBoth } = require("../middleware/verification")
const {
    createRecord,
    getAllRecords,
    getSingleRecord,
    updateRecord,
    deleteRecord,
    login,
    forgetPassword1,
    forgetPassword2,
    forgetPassword3
} = require("../controllers/UserController")

UserRouter.post("/", createRecord)
UserRouter.get("/", verifyAdmin, getAllRecords)
UserRouter.get("/:_id", verifyBoth, getSingleRecord)
UserRouter.put("/:_id", verifyBoth, userUploader.single("pic"), updateRecord)
UserRouter.delete("/:_id", verifyAdmin, deleteRecord)
UserRouter.post("/login", login)
UserRouter.post("/forget-password-1", forgetPassword1)
UserRouter.post("/forget-password-2", forgetPassword2)
UserRouter.post("/forget-password-3", forgetPassword3)

module.exports = UserRouter