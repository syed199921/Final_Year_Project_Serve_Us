
let technicians = require('../data/technicians.json')
const Technician = require('../models/technician_model')
const Portfolio = require('../models/portfolio_model')
const User = require('../models/user_model')


let getTechnician = async (req, res) => {
    let {id} = req.body
    let technician = null
    try{
        technician = await Technician.findById(id)
    }catch(err){
        return res.json({err: err.toString()})
    }
    return res.json({technician: technician})
}





function haversineDistance(lat1, lon1, lat2, lon2) {
    const radians = (degrees) => (degrees * Math.PI) / 180;
    // Convert latitude and longitude from degrees to radians
    [lat1, lon1, lat2, lon2] = [lat1, lon1, lat2, lon2].map(radians);

    // Haversine formula
    const dlat = lat2 - lat1;
    const dlon = lon2 - lon1;

    const a = Math.sin(dlat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    // Radius of the Earth in kilometers (mean value)
    const earthRadius = 6371.0;

    // Calculate the distance in kilometers
    const distance = earthRadius * c;

    return distance;
};

let getNearbyTechnicians = async (req, res) => {
    let {customer, technicianType} = req.body
    let customerUser = null
    try{
        customerUser = await User.findOne({"userId": customer})
        // return res.json({customer: customerUser})
    }
    catch(err){
        return res.json({err: err.toString()})
    }
    let technicianUsers = null
    try{
        technicianUsers = await User.find({role: "Technician"})
        // return res.json({technicians: technicianUsers, customer: customer})
    }catch(err){
        return res.json({err: err.toString()})
    }

    let requiredTechnicians = await Promise.all( technicianUsers.map( async (technicianUser) => {
        let technician = null
        try{
            technician = await Technician.findById(technicianUser.userId)
        }catch(err){
            return res.json({err: err.toString()})
        }

        if( technician.technicianType === technicianType){
            return technicianUser
        }
    }))
    requiredTechnicians = requiredTechnicians.filter(technician => technician != null)
    // return res.json({technicians: requiredTechnicians, customer: customer})
    let nearbyTechnicians = requiredTechnicians.map((technician) => {
        if(haversineDistance(technician.latitude, technician.longitude, customerUser.latitude, customerUser.longitude) < 10){
            let distance = haversineDistance(technician.latitude, technician.longitude, customerUser.latitude, customerUser.longitude)
            return {"technician": technician, "distance": distance }
        }
    })

    nearbyTechnicians = nearbyTechnicians.filter(technician => technician != null)
    return res.json({"technicians": nearbyTechnicians, customer: customerUser})
}

let setLocation = (req, res) => {
    let {latitude, longitude, id} = req.body
    technicians.forEach((technician) => {
        if(technician.id == id){
            technician.latitude = latitude
            technician.longitude = longitude
        }
    })
    return res.json({message: "Location updated", technicians: technicians})
}

let generateReviewScore = (req, res) =>{
    let {review_results, nearby_technicians} = req.body
   let reviewScores =  nearby_technicians.map((technician) => {
    let totalRatings = technician.rating
    let reviewScore = 0
    review_results.forEach((reviewResult) => {
    if(reviewResult["id"] == technician.id){
        totalRatings += reviewResult["good reviews"]
        console.log({totalRatings: totalRatings, reviewResult: typeof (reviewResult["total reviews"]) })
        reviewScore = totalRatings / (reviewResult["total reviews"] + 10 )
        console.log({reviewScore: reviewScore})
        //The technician is rated out of 10
        //That is why we add 10 to the total reviews
    }
})
    return {technician: technician, reviewScore: reviewScore}
   })

return res.json({reviewScores: reviewScores})

}




module.exports = {
    getNearbyTechnicians,
    setLocation,
    generateReviewScore,
    getTechnician,

}