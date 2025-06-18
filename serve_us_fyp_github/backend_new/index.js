const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors');
const technician_router = require('./routes/technician_routes')
const customer_router = require('./routes/customer_routes')
const appointment_router = require('./routes/appointment_routes')
const user_router = require('./routes/user_routes')
const portfolio_router = require('./routes/portfolio_routes')
const service_router = require('./routes/service_routes')
const bill_router = require('./routes/bill_routes')
const payment_router = require('./routes/payment_routes')
const feedback_router = require('./routes/feedback_routes')
const inventory_router = require('./routes/inventory_routes')
const chatRoutes = require('./routes/chat_routes');
const socketService = require('./services/socket_service');
const chatbotRoutes = require('./routes/chatbot_routes');


const mongoose = require('mongoose');
const app = express()

//configure dotenv 
require('dotenv').config()



//middleware
app.use(bodyParser.json())
app.use(cors());



app.use('/technician', technician_router)
app.use('/customer', customer_router)
app.use('/appointment', appointment_router)
app.use('/user', user_router)
app.use('/portfolio', portfolio_router)
app.use('/service', service_router)
app.use('/bill', bill_router)
app.use('/payment', payment_router)
app.use('/feedback', feedback_router)
app.use('/inventory', inventory_router)
app.use('/chat', chatRoutes);
app.use('/chatbot', chatbotRoutes);

const server = app.listen(process.env.PORT, () =>{

    console.log(`Server running on port ${process.env.PORT}`)
   
    
        mongoose.connect(process.env.MONGODB_URI)
        
        let connection = mongoose.connection
        
        connection.on('error', () =>{
            console.log("Connection to database failed")
        })
        
        connection.once('open', () =>{
            console.log("Connected to database")
        })

        
    
})

// Initialize socket service
socketService.initSocket(server);
