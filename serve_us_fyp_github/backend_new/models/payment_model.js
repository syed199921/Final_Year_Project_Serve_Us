const mongoose = require('mongoose')

const paymentSchema = new mongoose.Schema(
    {
        bill:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Bill',
            required: true
        },
        paymentMethod: {
            type: String
        },
        amountPaid: {
            type: Number,
            required: true
        },
        remainingAmount: {
            type: Number,
            required: true
        },
        paymentDate: {
            type: String
        },
        paymentTime:{
            type: String
        }
        
    }
)

module.exports = mongoose.model("Payment", paymentSchema)