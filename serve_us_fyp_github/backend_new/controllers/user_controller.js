const User = require('../models/user_model')
const Portfolio = require('../models/portfolio_model')
const Technician = require('../models/technician_model')
const Customer = require('../models/customer_model')
const axios = require('axios')

let getUsers = async (req, res) => {
    let users = null
    try{
        users = await User.find()
    }catch(err){
        return res.json({err: err.toString()})
    }
    return res.json({users: users})
}

let removeUser = async (req, res) => {
    let{user_id} = req.body
    let user = null
    try{
        user = await User.findById(user_id)
    }catch(err){
        return res.json({err: err.toString()})
    }
    let userId = user.userId
    let removedUser = null
    if(user.role === "Technician"){
        try{
            removedUser = await Technician.findById(userId)
        }catch(err){
            return res.json({err: err.toString()})
        }
        let portfolioId = removedUser.portfolio

        try{
            await Portfolio.findByIdAndDelete(portfolioId)
        }catch(err){
            return res.json({err: err.toString()})
        }

        try{
            await Technician.findByIdAndDelete(removedUser._id)
        }catch(err){
            return res.json({err: err.toString()})
        }

        
    }
    else if(user.role === "Customer"){
        try{
            await Customer.findByIdAndDelete(user.userId)
        }catch(err){
            return res.json({err: err.toString()})
        }
    }

    try {
        let removeUser = await User.findByIdAndDelete(user_id)
        return res.json({user: removeUser})
    }catch(err){
        return res.json({err: err.toString()})
    }

}

let updateUser = async (req, res) => {
    let {userId, fullName, dateOfBirth, contactNumber, password } = req.body
    let user = null
    try{
        user = await User.findOne({userId: userId})
    }catch(err){
        return res.json({err: err.toString()})
    }


    let updatedUser = null

    if(user.role === "Technician"){
        
        try{
            updatedUser = await Technician.findById(user.userId)
        }catch(err){
            return res.json({err: err.toString()})
        }

        updatedUser.fullName = fullName
        updatedUser.dateOfBirth = dateOfBirth
        updatedUser.contactNumber = contactNumber

        try{
            await updatedUser.save()
        }catch(err){
            return res.json({err: err.toString()})
        }
}

    else if(user.role === "Customer"){
        try{
            updatedUser = await Customer.findById(user.userId)
        }catch(err){
            return res.json({err: err.toString()})
        }

        updatedUser.fullName = fullName
        updatedUser.dateOfBirth = dateOfBirth
        updatedUser.contactNumber = contactNumber

        try{
            await updatedUser.save()
        }catch(err){
            return res.json({err: err.toString()})
        }
    }

    user.contactNumber = contactNumber
    user.password = password
   
    try{
        await user.save()
        return res.json({user: user, updatedUser: updatedUser, message: "User updated"})
    }catch(err){
        return res.json({err: err.toString()})
    }

}
let signUp = async (req, res) => {
    let {fullName, dateOfBirth, role, technicianType, contactNumber, password} = req.body
    
    
    if(role === "Technician"){
        let portfolio = new Portfolio(
            {
                professionalSummary: "hello",
                projects: [],
                services: []
            }
        )
        try {
             await portfolio.save()
        }catch(err){
            return res.json({err: err.toString()})
        }
    
       
        let technician = new Technician(
            {
                fullName: fullName,
                technicianType: technicianType,
                dateOfBirth: dateOfBirth,
                contactNumber: contactNumber,
                portfolio: portfolio._id
            }
        )
        try {
             await technician.save()
        }catch(err){
            return res.json({err: err.toString()})
        }
     let user = new User({
        userId: technician._id,
        role: role,
        contactNumber: contactNumber,
        password: password
    })
    try {
        let savedUser = await user.save()
        return res.json({user: savedUser})
    }catch(err){
        return res.json({err: err.toString()})
    }
     
    }
    else if( role === "Customer"){
        let customer = new Customer({
            fullName: fullName,
            dateOfBirth: dateOfBirth,
            contactNumber: contactNumber,
        })
        try {
             await customer.save()
            
        }catch(err){
            return res.json({err: err.toString()}) 
        }

        let user = new User({
            userId: customer._id,
            role: role,
            contactNumber: contactNumber,
            password: password
        })
        try {
            let savedUser = await user.save()
            return res.json({user: savedUser})
        }catch(err){
            return res.json({err: err.toString()})
        }
    }

    
}

let getGeolocation = async () =>{
    let ip = null
    try{
         await axios.get('http://ip-api.com/json').then(response => {
            ip = response.data.query
         })

    

    }catch(err){
        return null
    }
    let location = null
    try{
     location = await axios.get(`http://ip-api.com/json/${ip}?fields=lat,lon,country,regionName,city`)
     return location.data
    }catch(err){
        return null
    
    }
    
}

let getIP = async (req, res) => {
    let ip = null
    try{
         await axios.get('http://ip-api.com/json').then(response => {
            ip = response.data.query
         })

            return res.json({ip: ip})
    }catch(err){
        return  res.json({err: err.toString()})
    }
}

let logIn = async (req, res) =>{
    let {contactNumber, password} = req.body
    let user = null
    try{
         user = await User.findOne({contactNumber: contactNumber, password: password})
        //  return res.json({"User": user})
    } catch(err){
        return res.json({err: err.toString()})
    }

    try{
        let location = await getGeolocation()
        user.latitude = location.lat
        user.longitude = location.lon
        let userLocation = `${location.city}, ${location.regionName}, ${location.country}`
        user.location = userLocation
        // return res.json({location: location})
    }catch(err){
        return res.json({err: err.toString()})
    }

    try{
        await user.save()
        return res.json({user: user})
    }
    catch(err){
        return res.json({err: err.toString()})
    }

}

module.exports = {
    signUp,
    logIn,
    getGeolocation,
    getIP,
    updateUser,
    removeUser,
    getUsers
}