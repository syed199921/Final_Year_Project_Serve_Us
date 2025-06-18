const mongoose = require('mongoose')

const serviceSchema = new mongoose.Schema({
    serviceTitle:{
        type: String

    },
    serviceDescription:{
        type: String
    },
    appointment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment',
        required: true
    },
    startDate: {
        type: String
    },
    startTime: {
        type: String
    },
    endDate: {
        type: String
    },
    endTime: {
        type: String
    },
    
})

module.exports = mongoose.model("Service", serviceSchema)