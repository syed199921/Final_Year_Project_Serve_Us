let customers = require('../data/customers.json')
let Customer = require('../models/customer_model')

let getCustomer = async (req, res) => {
    let {id} = req.body

    let customer = null

    try{
        customer = await Customer.findById(id)
    }
    catch(err){
        res.json({err: err.toString()})
    }

    res.json({customer: customer})
}



module.exports = {
    getCustomer
}