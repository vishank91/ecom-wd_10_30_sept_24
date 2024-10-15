const passwordValidator = require('password-validator')
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const User = require("../models/User")
const mailer = require("../mailer")

var schema = new passwordValidator();
schema
    .is().min(8)                                    // Minimum length 8
    .is().max(100)                                  // Maximum length 100
    .has().uppercase(1)                              // Must have 1 uppercase  letters
    .has().lowercase(1)                              // Must have 1 lowercase letters
    .has().digits(1)                                // Must have 1 digits
    .has().not().spaces()                           // Should not have spaces
    .is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values

function createRecord(req, res) {
    if (schema.validate(req.body.password)) {
        const data = new User(req.body)
        bcrypt.hash(req.body.password, 12, async (error, hash) => {
            if (error)
                res.status(500).send({ result: "Fail", reason: "Internal Server Error | Hash Password Doesn't Generated" })
            else {
                try {
                    data.role = "Buyer"
                    data.password = hash
                    await data.save()

                    mailer.sendMail({
                        from: process.env.MAIL_SENDER,
                        to: data.email,
                        subject: "Account is Created : Team Ecom",
                        text: `
                                Hello ${data.name}
                                Your Account With Us Has Been Created
                                Now you can buy our latest products with great delas
                                Team : Ecom
                            `
                    }, (error) => {
                        // console.log(error)
                    })
                    jwt.sign({ data }, process.env.JWT_SECRET_KEY_BUYER, (error, token) => {
                        if (error)
                            res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
                        else
                            res.send({ result: "Done", data: data, token: token, message: "Record Created SuccessFully" })
                    })
                } catch (error) {
                    // console.log(error)

                    const errorMessage = {}
                    error.keyValue?.username ? errorMessage.username = "User Name Already Exist" : ""
                    error.keyValue?.email ? errorMessage.email = "Email Address Already Exist" : ""
                    error.errors?.name ? errorMessage.name = error.errors.name.message : ""
                    error.errors?.username ? errorMessage.username = error.errors.username.message : ""
                    error.errors?.email ? errorMessage.email = error.errors.email.message : ""
                    error.errors?.phone ? errorMessage.phone = error.errors.phone.message : ""
                    error.errors?.password ? errorMessage.password = error.errors.password.message : ""

                    Object.values(errorMessage).filter((x) => x !== "").length === 0 ?
                        res.status(500).send({ result: "Fail", reason: "Internal Server Error" }) :
                        res.send({ result: "Fail", reason: errorMessage })
                }
            }
        })
    }
    else
        res.send({ result: "Fail", reason: { password: "Invalid Password!!! Password Must Contains atleast 1 Digit, 1 Upper Case, 1 Lower Case Character and should not contain any space and length must be within 8-100 " } })
}
async function getAllRecords(req, res) {
    try {
        const data = await User.find().sort({ _id: -1 })
        res.send({ result: "Done", count: data.length, data: data })
    } catch (error) {
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
    }
}
async function getSingleRecord(req, res) {
    try {
        const data = await User.findOne({ _id: req.params._id })
        if (data)
            res.send({ result: "Done", data: data })
        else
            res.send({ result: "Fail", reason: "Invalid ID, Record Not Found" })
    } catch (error) {
        console.log(error);
        
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
    }
}

async function updateRecord(req, res) {
    try {
        const data = await User.findOne({ _id: req.params._id })
        if (data) {
            data.name = req.body.name ?? data.name
            data.phone = req.body.phone ?? data.phone
            data.address = req.body.address ?? data.address
            data.pin = req.body.pin ?? data.pin
            data.city = req.body.city ?? data.city
            data.state = req.body.state ?? data.state
            data.active = req.body.active ?? data.active
            if (req.file) {
                try {
                    const fs = require("fs")
                    fs.unlinkSync(data.pic)
                } catch (error) { }
                data.pic = req.file.path
            }
            await data.save()
            res.send({ result: "Done", data: data, message: "Record Updated SuccessFully" })
        }
        else
            res.send({ result: "Fail", reason: "Invalid ID, Record Not Found" })
    } catch (error) {
        console.log(error)

        const errorMessage = []
        error.keyValue ? errorMessage.push({ name: "User Already Exist" }) : ""

        errorMessage.length === 0 ?
            res.status(500).send({ result: "Fail", reason: "Internal Server Error" }) :
            res.status(500).send({ result: "Fail", reason: errorMessage })
    }
}

async function deleteRecord(req, res) {
    try {
        const data = await User.findOne({ _id: req.params._id })
        if (data) {
            try {
                const fs = require("fs")
                fs.unlinkSync(data.pic)
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

async function login(req, res) {
    try {
        let data = await User.findOne({
            $or: [
                { email: req.body.username },
                { username: req.body.username }
            ]
        })
        if (data && await bcrypt.compare(req.body.password, data.password)) {
            let secretKey = data.role === "Buyer" ? process.env.JWT_SECRET_KEY_BUYER : process.env.JWT_SECRET_KEY_ADMIN
            jwt.sign({ data }, secretKey, (error, token) => {
                if (error)
                    res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
                else
                    res.send({ result: "Done", data: data, token: token })
            })
        }
        else
            res.status(401).send({ result: "Fail", reason: "Username or Password Invalid" })
    } catch (error) {
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
    }
}

async function forgetPassword1(req, res) {
    try {
        let data = await User.findOne({
            $or: [
                { username: req.body.username },
                { email: req.body.username }
            ]
        })
        if (data) {
            let otp = parseInt(Math.floor(Math.random() * 1000000).toString().padEnd(6, "1"))
            data.otp = otp
            await data.save()

            mailer.sendMail({
                from: process.env.MAIL_SENDER,
                to: data.email,
                subject: "OTP for Password Reset : Team Ecom",
                text: `
                        Hello ${data.name}
                        We Recieved an Record for Password Reset from your Side
                        OTP for Password Reset is ${otp}
                        Never Share OTP with anyone
                        Team : Ecom
                    `
            }, (error) => {
                // console.log(error)
            })
            res.send({ result: "Done", message: "OTP Has Been sent On Your Registered Email Address" })
        }
        else
            res.status(401).send({ result: "Fail", reason: "Invalid Credentials!!! User Not Found" })
    } catch (error) {
        console.log(error)
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
    }
}

async function forgetPassword2(req, res) {
    try {
        let data = await User.findOne({
            $or: [
                { username: req.body.username },
                { email: req.body.username }
            ]
        })
        if (data) {
            if (data.otp == req.body.otp)
                res.send({ result: "Done" })
            else
                res.send({ result: "Fail", reason: "Invalid OTP" })
        }
        else
            res.status(401).send({ result: "Fail", reason: "UnAuthorized Activity" })
    } catch (error) {
        console.log(error)
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
    }
}

async function forgetPassword3(req, res) {
    try {
        let data = await User.findOne({
            $or: [
                { username: req.body.username },
                { email: req.body.username }
            ]
        })
        if (data) {
            bcrypt.hash(req.body.password, 12, async (error, hash) => {
                if (error)
                    res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
                else {
                    data.password = hash
                    await data.save()
                    res.send({ result: "Done", message: "Your Password Has Been Reset" })
                }
            })
        }
        else
            res.status(401).send({ result: "Fail", reason: "UnAuthorized Activity" })
    } catch (error) {
        console.log("Error", error)
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
    }
}
module.exports = {
    createRecord,
    getAllRecords,
    getSingleRecord,
    updateRecord,
    deleteRecord,
    login,
    forgetPassword1,
    forgetPassword2,
    forgetPassword3
}