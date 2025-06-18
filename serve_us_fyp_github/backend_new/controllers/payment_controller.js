const Payment = require('../models/payment_model')
const Bill = require('../models/bill_model')
const Customer = require('../models/customer_model')
const Technician = require('../models/technician_model')
let date = new Date()
let payByCash = async (req, res) => {
    let {bill, customer, technician, amountPaid,  paymentMethod} = req.body
    let dueBill = null
    try{
        dueBill = await Bill.findById(bill)
        // return res.json({dueBill: dueBill})
    }catch(err){
        return res.json({err: err.toString()})
    }
    let dateAndTime = new Date()
    currentDateAndTime = dateAndTime.toLocaleString()
    currentDateAndTime = currentDateAndTime.split(",")
    remaingAmount =  amountPaid - dueBill.amount

    let payment = new Payment({
        bill: bill,
        customer: customer,
        technician: technician,
        paymentMethod: paymentMethod,
        amountPaid: amountPaid,
        remainingAmount: remaingAmount,
        paymentDate: currentDateAndTime[0],
        paymentTime: currentDateAndTime[1],
    })

    if (remaingAmount >= 0){
    dueBill.status = "Paid"
    }
    else{
        dueBill.status = "Pending"
    }

    let customerDetails = null
    try {
        customerDetails = await Customer.findById(customer)
    } catch (err){
        return res.json({err: err.toString()})
    }

    let technicianDetails = null
    try {
        technicianDetails = await Technician.findById(technician)
    } catch (err){
        return res.json({err: err.toString()})
    }

    let billDetails = null
    try {
        billDetails = await Bill.findById(bill)
    }catch(err){
        return res.json({err: err.toString()})
    }

    try{
        await dueBill.save()
    }catch(err){
        return res.json({err: err.toString()})
    }

    try{
        await payment.save()
        return res.json({payment:payment, billDetails: billDetails, customerDetails: customerDetails, technicianDetails: technicianDetails})
    }catch(err){
        return res.json({err: err.toString()})
    }
}

module.exports = {
    payByCash
}