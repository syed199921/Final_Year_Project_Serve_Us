const mongoose = require('mongoose')

const customerSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: String
    },
    contactNumber: {
        type: String,
        required: true
    },
    address: {
        type: String
    }
    
})

module.exports = mongoose.model("Customer", customerSchema)