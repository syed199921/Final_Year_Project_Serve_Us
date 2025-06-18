const Service = require('../models/service_model')

let completeService = async (req, res) => {
    let {appointment, startDate, endDate, serviceTitle, serviceDescription} = req.body
    let service = new Service({
        serviceTitle: serviceTitle,
        serviceDescription: serviceDescription,
        appointment: appointment,
        startDate: startDate,
        endDate: endDate
    })

    try{
        await service.save()
        return res.json({service: service})
    }catch(err){
        return res.json({err: err.toString()})
    }
}

module.exports = {
    completeService
}