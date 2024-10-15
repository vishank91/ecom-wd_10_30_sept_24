const Wishlist = require("../models/Wishlist")

async function createRecord(req, res) {
    try {
        const data = new Wishlist(req.body)
        await data.save()
        let finalData = await Wishlist.findOne({ _id: data._id }).populate([
            {
                path: "user",
                select: "name"
            },
            {
                path: "product",
                select: "name maincategory subcategory brand color size finalPrice pic stockQuantity",
                populate: [
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
                ],
                options: { slice: { pic: 1 } }
            }
        ])
        res.send({ result: "Done", data: finalData, message: "Record Created SuccessFully" })
    } catch (error) {
        console.log(error)

        const errorMessage = {}
        error.errors?.user ? errorMessage.user = error.errors.user.message : ""
        error.errors?.product ? errorMessage.product = error.errors.product.message : ""

        Object.values(errorMessage).find(x => x !== "") ?
            res.status(500).send({ result: "Fail", ...errorMessage }) :
            res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
    }
}
async function getAllRecords(req, res) {
    try {
        const data = await Wishlist.find().sort({ _id: -1 }).populate([
            {
                path: "user",
                select: "name"
            },
            {
                path: "product",
                select: "name maincategory subcategory brand color size finalPrice pic stockQuantity",
                populate: [
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
                ],
                options: { slice: { pic: 1 } }
            }
        ])
        res.send({ result: "Done", count: data.length, data: data })
    } catch (error) {
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
    }
}
async function getSingleRecord(req, res) {
    try {
        const data = await Wishlist.findOne({ _id: req.params._id }).populate([
            {
                path: "user",
                select: "name"
            },
            {
                path: "product",
                select: "name maincategory subcategory brand color size finalPrice pic stockQuantity",
                populate: [
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
                ],
                options: { slice: { pic: 1 } }
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

async function deleteRecord(req, res) {
    try {
        const data = await Wishlist.findOne({ _id: req.params._id })
        if (data) {
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
    deleteRecord
}