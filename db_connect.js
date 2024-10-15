const mongoose = require("mongoose")

// mongoose.connect(process.env.DB_KEY)
// .then(()=>{
//     console.log("Database is Connected")
// })
// .catch((error)=>{
//     console.log(error)
// })

async function getConnect() {
    try {
        await mongoose.connect(process.env.DB_KEY)
        console.log("Database is Connected")

    } catch (error) {
        console.log(error);
    }
}
getConnect()