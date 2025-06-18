const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Technician'
    },
    role: {
        type: String,
        enum: ['Customer', 'Technician'],
        required: true
    },
    contactNumber: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    latitude: {
        type: Number
    },
    longitude: {
        type: Number
    },
    location: {
        type: String
    },
    chatHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
    }]
})

module.exports = mongoose.model("User", userSchema)