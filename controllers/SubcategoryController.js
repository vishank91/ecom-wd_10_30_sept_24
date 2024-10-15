const Subcategory = require("../models/Subcategory")

async function createRecord(req, res) {
    try {
        const data = new Subcategory(req.body)
        await data.save()
        res.send({ result: "Done", data: data, message: "Record Created SuccessFully" })
    } catch (error) {
        console.log(error)

        const errorMessage = {}
        error.keyValue ? errorMessage.name = "Subcategory Already Exist" : ""
        error.errors?.name ? errorMessage.name = error.errors.name.message : ""
        error.errors?.pic ? errorMessage.pic = error.errors.pic.message : ""

        Object.values(errorMessage).find(x => x !== "") ?
            res.status(500).send({ result: "Fail", ...errorMessage }) :
            res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
    }
}
async function getAllRecords(req, res) {
    try {
        const data = await Subcategory.find().sort({ _id: -1 })
        res.send({ result: "Done", count: data.length, data: data })
    } catch (error) {
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
    }
}
async function getSingleRecord(req, res) {
    try {
        const data = await Subcategory.findOne({ _id: req.params._id })
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
        const data = await Subcategory.findOne({ _id: req.params._id })
        if (data) {
            data.name = req.body.name ?? data.name
            data.active = req.body.active ?? data.active
            await data.save()
            res.send({ result: "Done", data: data, message: "Record Updated SuccessFully" })
        }
        else
            res.send({ result: "Fail", reason: "Invalid ID, Record Not Found" })
    } catch (error) {
        console.log(error)

        const errorMessage = {}
        error.keyValue ? errorMessage.name = "Subcategory Already Exist" : ""

        Object.values(errorMessage).find(x => x !== "") ?
            res.status(500).send({ result: "Fail", ...errorMessage }) :
            res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
    }
}

async function deleteRecord(req, res) {
    try {
        const data = await Subcategory.findOne({ _id: req.params._id })
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
    updateRecord,
    deleteRecord
}