const mongoose = require('mongoose');
require("dotenv").config()

async function connectToDB(){
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

let connection = mongoose.connection

connection.on('error', () =>{
    console.log("Connection to database failed")
})

connection.once('open', () =>{
    console.log("Connected to database")
})

}

module.exports = {
    connectToDB
}