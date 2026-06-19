import mongoose,{Schema} from "mongoose";

const applicationSchema = new mongoose.Schema({
    company_name:{
         type: String,
         required: true,
         minlength: 2
        },
    job_title:{
         type: String, 
         required: true
        },
    job_type:{ 
        type: String, 
        required: true,
        enum:['Internship','Full-time', 'Part-time']
    },
    status:{ 
        type: String, 
        required: true,
        enum:['Applied', 'Interviewing', 'Offer', 'Rejected'],
        default: 'Applied'
    },
    applied_Date:{
        type: Date,
        required: true
    },
    notes:{ 
        type: String, 
        required: false
    },
    
},{timestamps: true})
const applicatiomModel = mongoose.model('applicationModel', applicationSchema)
export {applicatiomModel}