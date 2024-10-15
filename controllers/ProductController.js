const Product = require("../models/Product")
const Newsletter = require("../models/Newsletter")

const mailer = require("../mailer")
async function createRecord(req, res) {
    try {
        const data = new Product(req.body)
        if (req.files) {
            data.pic = Array.from(req.files).map((x) => x.path)
        }
        await data.save()
        let finalData = await Product.findOne({ _id: data._id })
            .populate([
                {
                    path: "maincategory",
                    select: "name"
                },
                {
                    path: "subcategory",
                    select: "name"
                },
                {
                    path: "brand",
                    select: "name"
                }
            ])

        const newsletters = await Newsletter.find()
        newsletters.forEach((x) => {
            mailer.sendMail({
                from: process.env.MAIL_SENDER,
                to: x.email,
                subject: "Checkout Our Latest Products : Team Ecom",
                text: `
                            Hello ${data.name}
                            Checkout Our Latest Products
                            Team : Ecom
                        `
            }, (error) => {
                // console.log(error)
            })
        })
        res.send({ result: "Done", data: finalData, message: "Record Created SuccessFully" })
    } catch (error) {
        console.log(error)

        const errorMessage = {}
        error.keyValue ? errorMessage.name = "Brand Already Exist" : ""
        error.errors?.name ? errorMessage.name = error.errors.name.message : ""
        error.errors?.maincategory ? errorMessage.maincategory = error.errors.maincategory.message : ""
        error.errors?.subcategory ? errorMessage.subcategory = error.errors.subcategory.message : ""
        error.errors?.brand ? errorMessage.brand = error.errors.brand.message : ""
        error.errors?.color ? errorMessage.color = error.errors.color.message : ""
        error.errors?.size ? errorMessage.size = error.errors.size.message : ""
        error.errors?.basePrice ? errorMessage.basePrice = error.errors.basePrice.message : ""
        error.errors?.stock ? errorMessage.stock = error.errors.stock.message : ""
        error.errors?.stockQuantity ? errorMessage.stockQuantity = error.errors.stockQuantity.message : ""
        error.errors?.pic ? errorMessage.pic = error.errors.pic.message : ""
        error.errors?.discount ? errorMessage.discount = error.errors.discount.message : ""

        Object.values(errorMessage).find(x => x !== "") ?
            res.status(500).send({ result: "Fail", ...errorMessage }) :
            res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
    }
}
async function getAllRecords(req, res) {
    try {
        const data = await Product.find().sort({ _id: -1 }).populate([
            {
                path: "maincategory",
                select: "name"
            },
            {
                path: "subcategory",
                select: "name"
            },
            {
                path: "brand",
                select: "name"
            }
        ])
        res.send({ result: "Done", count: data.length, data: data })
    } catch (error) {
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
    }
}
async function getSingleRecord(req, res) {
    try {
        const data = await Product.findOne({ _id: req.params._id }).populate([
            {
                path: "maincategory",
                select: "name"
            },
            {
                path: "subcategory",
                select: "name"
            },
            {
                path: "brand",
                select: "name"
            }
        ])
        if (data)
            res.send({ result: "Done", data: data })
        else
            res.send({ result: "Fail", reason: "Invalid ID, Record Not Found" })
    } catch (error) {
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
    }
}

async function updateRecord(req, res) {
    try {
        const data = await Product.findOne({ _id: req.params._id })
        if (data) {
            data.name = req.body.name ?? data.name
            data.maincategory = req.body.maincategory ?? data.maincategory
            data.subcategory = req.body.subcategory ?? data.subcategory
            data.brand = req.body.brand ?? data.brand
            data.color = req.body.color ?? data.color
            data.size = req.body.size ?? data.size
            data.basePrice = req.body.basePrice ?? data.basePrice
            data.discount = req.body.discount ?? data.discount
            data.finalPrice = req.body.finalPrice ?? data.finalPrice
            data.stock = req.body.stock ?? data.stock
            data.description = req.body.description ?? data.description
            data.stockQuantity = req.body.stockQuantity ?? data.stockQuantity
            data.active = req.body.active ?? data.active
            if (req.files) {
                try {
                    data.pic.forEach((x, index) => {
                        if (!(req.body.oldPics?.split(",").includes(x))) {
                            const fs = require("fs")
                            fs.unlinkSync(x)
                        }
                    })
                } catch (error) {
                    // console.log(error)
                }
                if (req.body.oldPics === "")
                    data.pic = req.files.map((x) => x.path)
                else
                    data.pic = req.body.oldPics?.split(",").concat(req.files.map((x) => x.path))
            }
            await data.save()
            let finalData = await Product.findOne({ _id: data._id })
                .populate([
                    {
                        path: "maincategory",
                        select: "name"
                    },
                    {
                        path: "subcategory",
                        select: "name"
                    },
                    {
                        path: "brand",
                        select: "name"
                    }
                ])
            res.send({ result: "Done", data: finalData, message: "Record Updated SuccessFully" })
        }
        else
            res.send({ result: "Fail", reason: "Invalid ID, Record Not Found" })
    } catch (error) {
        console.log(error)
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
    }
}

async function updateRecordQuantity(req, res) {
    try {
        const data = await Product.findOne({ _id: req.params._id })
        if (data) {
            data.stock = req.body.stock ?? data.stock
            data.stockQuantity = req.body.stockQuantity ?? data.stockQuantity
            await data.save()
            let finalData = await Product.findOne({ _id: data._id })
                .populate([
                    {
                        path: "maincategory",
                        select: "name"
                    },
                    {
                        path: "subcategory",
                        select: "name"
                    },
                    {
                        path: "brand",
                        select: "name"
                    }
                ])
            res.send({ result: "Done", data: finalData, message: "Record Updated SuccessFully" })
        }
        else
            res.send({ result: "Fail", reason: "Invalid ID, Record Not Found" })
    } catch (error) {
        console.log(error)
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
    }
}

async function deleteRecord(req, res) {
    try {
        const data = await Product.findOne({ _id: req.params._id })
        if (data) {
            try {
                const fs = require("fs")
                data.pic.forEach((x) => fs.unlinkSync(x))
            } catch (error) { }
            await data.deleteOne()
            res.send({ result: "Done", message: "Record is Deleted" })
        }
        else
            res.send({ result: "Fail", reason: "Invalid ID, Record Not Found" })
    } catch (error) {
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
    }
}

module.exports = {
    createRecord,
    getAllRecords,
    getSingleRecord,
    updateRecord,
    deleteRecord,
    updateRecordQuantity
}


