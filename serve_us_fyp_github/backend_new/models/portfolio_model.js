const mongoose = require("mongoose")


const portfolioSchema = new mongoose.Schema({
    professionalSummary: {
        type: String,
        default:""
    },
    projects: [
        {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String
        },
        images: {
            type: [String]
        },
        testimonials:[
            {
                testimonial: {
                    type: String,
                    required: true
                },
                customer: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Customer'
                }
            }
        ]
    }
    ],
    services: [
        {
            title: {
                type: String,
                required: true
            },
            description: {
                type: String
            },
            pricing: {
                type: String,
                required: true
            }
        }
    ]
    
})

module.exports =  mongoose.model("Portfolio", portfolioSchema)