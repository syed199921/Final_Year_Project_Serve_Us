const Bill = require('../models/bill_model')
const Customer = require('../models/customer_model')
const Service = require('../models/service_model')
const Technician = require('../models/technician_model')


let generateBill = async (req, res) => {

    let {customer,technician, service, amount} = req.body
    let dateAndTime = new Date()
    currentDateAndTime = dateAndTime.toLocaleString()
    currentDateAndTime = currentDateAndTime.split(",")

    let bill = new Bill({
        customer: customer,
        technician: technician,
        service: service,
        date: currentDateAndTime[0],
        time: currentDateAndTime[1], 
        amount: amount
    })

    let customerDetails = null
    try{
        customerDetails = await Customer.findById(customer)
    }
    catch(err){
        return res.json({err: err.toString()})
    }

    let technicianDetails = null
    try{
        technicianDetails = await Technician.findById(technician)
    }
    catch(err){
        return res.json({err: err.toString()})
    }

    let serviceDetails = null
    try {
        serviceDetails = await Service.findById(service)
    } catch (err){
        return res.json({err: err.toString()})
    }



    try{
        await bill.save()
        return res.json({"_id": bill._id, customer: customerDetails, technician: technicianDetails, service: serviceDetails, "bill date": bill.date, "bill time": bill.time, "bill amount": bill.amount })
    }catch(err){
        return res.json({err: err.toString()})
    }
}

let getBills = async (req, res) => {
    let {customer} = req.body
    
    try{
        let bills = await Bill.find({customer: customer})
        return res.json({bills: bills})
    }
    catch(err){
        return res.json({err: err.toString()})
    }

}

let getBill = async (req, res) => {
    let {id} = req.body

    try{
        let bill = await Bill.findById(id)
        return res.json({bill: bill})
    }
    catch(err){
        return res.json({err: err.toString()})
    }
}

module.exports = {
    generateBill,
    getBills,
    getBill
}