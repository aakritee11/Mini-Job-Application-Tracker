import { applicatiomModel } from "../models/application";


const createApplication = async (req,res)=>{
    const {} = req.body;

    const application = await applicatiomModel.create({
      title,
      description,
      price,
      city,
      type,
      contactPhone,
      photos,
      owner: req.user.userId  
    });
    return res.status(201).json({ message: 'Room created successfully', room });
    
}