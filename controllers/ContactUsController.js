const ContactUs = require("../models/ContactUs")
const mailer = require("../mailer")

async function createRecord(req, res) {
    try {
        const data = new ContactUs(req.body)
        data.date = new Date()
        await data.save()
        mailer.sendMail({
            from: process.env.MAIL_SENDER,
            to: data.email,
            subject: "Your Query Has Been Received : Team Ecom",
            text: `
                    Hello ${data.name}
                    Your Query Has Been Received
                    Our Team Will Contact You Soon
                    Team : Ecom
                `
        }, (error) => {
            // console.log(error)
        })

        mailer.sendMail({
            from: process.env.MAIL_SENDER,
            to: process.env.MAIL_SENDER,
            subject: "New Query Has Been Received : Team Ecom",
            text: `
                  Name      :    ${data.name}  
                  Email     :    ${data.email}  
                  Phone     :    ${data.phone}  
                  Subject   :    ${data.subject}  
                  Message   :    ${data.message}  
                `
        }, (error) => {
            // console.log(error)
        })
        res.send({ result: "Done", data: data, message: "Record Created SuccessFully" })
    } catch (error) {
        console.log(error)

        const errorMessage = {}
        error.errors?.name ? errorMessage.name = error.errors.name.message : ""
        error.errors?.email ? errorMessage.email = error.errors.email.message : ""
        error.errors?.phone ? errorMessage.phone = error.errors.phone.message : ""
        error.errors?.subject ? errorMessage.subject = error.errors.subject.message : ""
        error.errors?.message ? errorMessage.message = error.errors.message.message : ""

        Object.values(errorMessage).find(x => x !== "") ?
            res.status(500).send({ result: "Fail", ...errorMessage }) :
            res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
    }
}
async function getAllRecords(req, res) {
    try {
        const data = await ContactUs.find().sort({ _id: -1 })
        res.send({ result: "Done", count: data.length, data: data })
    } catch (error) {
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
    }
}
async function getSingleRecord(req, res) {
    try {
        const data = await ContactUs.findOne({ _id: req.params._id })
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
        const data = await ContactUs.findOne({ _id: req.params._id })
        if (data) {
            data.active = req.body.active ?? data.active
            await data.save()
            mailer.sendMail({
                from: process.env.MAIL_SENDER,
                to: data.email,
                subject: "Your Query Has Been Resolved : Team Ecom",
                text: `
                        Hello ${data.name}
                        Your Your Query Has Been Resolved
                        If You Have More Query then freel free to contact us again
                        Team : Ecom
                    `
            }, (error) => {
                // console.log(error)
            })
            res.send({ result: "Done", data: data, message: "Record Updated SuccessFully" })
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
        const data = await ContactUs.findOne({ _id: req.params._id })
        if (data) {
            if (data.active)
                res.send({ result: "Fail", resone: "Can't Delete Active Contact Us Query" })
            else {
                await data.deleteOne()
                res.send({ result: "Done", message: "Record is Deleted" })
            }
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