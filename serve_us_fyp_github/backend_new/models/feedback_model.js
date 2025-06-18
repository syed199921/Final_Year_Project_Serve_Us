const mongoose = require('mongoose')

const feedbackSchema = new mongoose.Schema({
    review: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    // service: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Appointment',
    //     required: true
    // },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    technician: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Technician',
        required: true
    }

})

module.exports = mongoose.model("Feedback", feedbackSchema)