const multer = require("multer")

function createUploader(folderName) {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'public/uploads/'+folderName)
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + file.originalname)
        }
    })
    return multer({ storage: storage })
}

module.exports = {
    brandUploader : createUploader("brands"),
    productUploader : createUploader("products"),
    testimonialUploader : createUploader("testimonials"),
    userUploader : createUploader("users"),
}