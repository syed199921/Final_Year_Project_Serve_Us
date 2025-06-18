const mongoose = require('mongoose')

const billSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer'
    },
    technician:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Technician'
    },
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service'
    },
    date: {
        type: String
    },
    time: {
        type: String
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Paid'],
        default: 'Pending'
    }
})

module.exports = mongoose.model("Bill", billSchema)
