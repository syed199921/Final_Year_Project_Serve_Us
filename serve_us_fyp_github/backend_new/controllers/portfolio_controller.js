const Portfolio = require("../models/portfolio_model")
const Technician = require("../models/technician_model")

let viewPortfolio = async (req, res) => {
    let {technician_id} = req.body
    let technician = null
    try{
        technician = await Technician.findById(technician_id)
       
    }
    catch(err){
        return res.json({err: err.toString()})
    }

    let portfolio_id = technician.portfolio
    let portfolio = null
    try{
        portfolio = await Portfolio.findById(portfolio_id)
        return res.json({technician: technician, portfolio: portfolio})
    }catch(err){
        return res.json({err: err.toString()})
    }



}


let addProfessionalSummary = async (req, res) => {
    let {professionalSummary, technicianId} = req.body
    let technician = null
    try{
      technician = await Technician.findById(technicianId)
    }catch(err){
        return res.json({err: err.toString()})
    }
    let portfolio_id = technician.portfolio
    let portfolio = null
    try{
        portfolio = await Portfolio.findById(portfolio_id)
    }catch(err){
        return res.json({err: err.toString()})
    }
    portfolio.professionalSummary = professionalSummary
    try{
        await portfolio.save()
        return res.json({portfolio: portfolio})
    }catch(err){
        return res.json({err: err.toString()})
    }

}



let addProject = async (req, res) => {
  let {title,description,images, testimonials, technicianId} = req.body
  let technician = null
  try{
    technician = await Technician.findById(technicianId)
  }catch(err){
    return res.json({err: err.toString()})
  }
  
  let portfolio_id = technician.portfolio
    let portfolio = null
    try{
        portfolio = await Portfolio.findById(portfolio_id)
    }catch(err){
        return res.json({err: err.toString()})
    }
    let project = {
        title: title,
        description: description,
        images: images,
        testimonials: testimonials 
    }
    let portfolioProjects = portfolio.projects
    portfolioProjects.push(project)
try{
    await portfolio.save()
}catch(err){
    return res.json({err: err.toString()})
}
    

    return res.json({portfolio: portfolio})
}

let removeProject = async(req, res) =>{
    let projectId = req.body.projectId
    let technicianId = req.body.technicianId
    let technician = null
    try{
      technician = await Technician.findById(technicianId)
    }catch(err){
      return res.json({err: err.toString()})
    }

    let portfolio_id = technician.portfolio
    let portfolio = null
    try{
        portfolio = await Portfolio.findById(portfolio_id)
    }catch(err){
        return res.json({err: err.toString()})
    }

    let portfolioProjects = portfolio.projects
    
    portfolioProjects = portfolioProjects.filter((project) => project._id != projectId)

    portfolio.projects = portfolioProjects

    try{
         await portfolio.save()
        return res.json({portfolio: portfolio})
    }catch(err){
        return res.json({err: err.toString()})
    }
    

}

let editProject = async(req, res) => {
    let {projectId, title, description, images, testimonials, technicianId} = req.body;
    let technician = null;
    try {
        technician = await Technician.findById(technicianId);
    } catch(err) {
        return res.json({err: err.toString()});
    }

    let portfolio_id = technician.portfolio;
    let portfolio = null;
    try {
        portfolio = await Portfolio.findById(portfolio_id);
    } catch(err) {
        return res.json({err: err.toString()});
    }

    let portfolioProjects = portfolio.projects;
    
    let projectIndex = portfolioProjects.findIndex((project) => project._id == projectId);

    if (projectIndex === -1) {
        return res.json({err: "Project not found"});
    }

    let project = {
        _id: projectId,
        title: title,
        description: description,
        images: images,
        testimonials: testimonials 
    };
    portfolioProjects[projectIndex] = project;
    try {
        await portfolio.save();
        return res.json({portfolio: portfolio});
    } catch(err) {
        return res.json({err: err.toString()});
    }
}

let addService = async (req, res) =>{
    let {title, description, pricing, technicianId} = req.body
    let technician = null
    try{
      technician = await Technician.findById(technicianId)
    }catch(err){
        return res.json({err: err.toString()})
        
    }
    let portfolio_id = technician.portfolio
    let portfolio = null
    try{
        portfolio = await Portfolio.findById(portfolio_id)
    }catch(err){
        return res.json({err: err.toString()})
    }

    let service = {
        title: title,
        description: description,
        pricing: pricing
    }

    let portfolioServices = portfolio.services

    portfolioServices.push(service)

    try{
        await portfolio.save()
        return res.json({portfolio: portfolio})
    }catch(err){
        return res.json({err: err.toString()})
    }

}

let removeService = async(req, res) =>{
    let {serviceId, technicianId} = req.body

    let technician = null
    try{
      technician = await Technician.findById(technicianId)
    }catch(err){
        return res.json({err: err.toString()})
        
    }

    let portfolio_id = technician.portfolio
    let portfolio = null
    
    try{
        portfolio = await Portfolio.findById(portfolio_id)
    }
    catch(err){
        return res.json({err: err.toString()})
    }

    let portfolioServices = portfolio.services

    portfolioServices = portfolioServices.filter(service => service._id != serviceId)

    portfolio.services = portfolioServices
    try {
        await portfolio.save()
        return res.json({portfolio: portfolio})
    }catch(err){
        return res.json({err: err.toString()})
    }
}

let editService = async (req, res) => {
    let {serviceId, title, description, pricing, technicianId} = req.body;
    let technician = null;
    try {
        technician = await Technician.findById(technicianId);
    } catch(err) {
        return res.json({err: err.toString()});
    }

    let portfolio_id = technician.portfolio;

    let portfolio = null;

    try{
        portfolio = await Portfolio.findById(portfolio_id)
    }catch(err){
        return res.json({err: err})
    }

    let portfolioServices = portfolio.services

    let serviceIndex = portfolioServices.findIndex(service => service._id == serviceId)

    if(serviceIndex === -1){
        return res.json({err: "Service not found"})
    }

    let service = {
        _id: serviceId,
        title: title,
        description: description,
        pricing: pricing
    }

    portfolioServices[serviceIndex] = service

    portfolio.services = portfolioServices

    try{
        await portfolio.save()
        return res.json({portfolio: portfolio}) 
    }catch(err){
        return res.json({err: err.toString()})
    }
}
module.exports = {
    addProject,
    removeProject,
    editProject,
    addService,
    removeService,
    editService,
    addProfessionalSummary,
    viewPortfolio
}