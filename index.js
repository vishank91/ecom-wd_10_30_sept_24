const express = require("express")
const dotenv = require("dotenv").config()
const cors = require("cors")
const path = require("path")

const Router = require("./routes/index")

require("./db_connect")
const app = express()

var whitelist = ['http://localhost:3000', 'http://localhost:8000',]
var corsOptions = {
    origin: function (origin, callback) {
        // console.log("Origin",origin)
        if (whitelist.includes(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('You Are not authenciated to access this api'))
        }
    }
}

app.use(express.json())
app.use(cors(corsOptions))
app.use(express.static(path.join(__dirname, 'build')))
app.use(express.static("./public"))
app.use("/public", express.static("./public"))

app.use("/api", Router)
app.use('*', express.static(path.join(__dirname, 'build')))

let PORT = process.env.PORT || 8000
app.listen(PORT, console.log(`Server is Running at PORT ${PORT}`))

