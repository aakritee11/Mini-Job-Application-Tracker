import e from "express";
import { applicatiomModel } from "../models/application.js";

const getAll = async (req, res) => {
  try {
    const { status, search } = req.query;
    let filter = {};
 
    if (status) {
      filter.status = status;
    }
 
    if (search) {
      filter.$or = [
        { company_name: { $regex: search, $options: 'i' } },
        { job_title: { $regex: search, $options: 'i' } }
      ];
    }
 
    const applications = await applicatiomModel.find(filter).sort({ applied_date: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
 

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const application = await applicatiomModel.findById(id);
 
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }
 
    res.json(application);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
 

const create = async (req, res) => {
  try {
    const { company_name, job_title, job_type, status, applied_date, notes } = req.body;
 
    
    if (!company_name || company_name.trim().length < 2) {
      return res.status(400).json({ error: 'Company name required (min 2 chars)' });
    }
    if (!job_title || job_title.trim().length === 0) {
      return res.status(400).json({ error: 'Job title required' });
    }
    if (!job_type || !['Internship', 'Full-time', 'Part-time'].includes(job_type)) {
      return res.status(400).json({ error: 'Invalid job type' });
    }
    if (!status || !['Applied', 'Interviewing', 'Offer', 'Rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    if (!applied_date) {
      return res.status(400).json({ error: 'Applied date required' });
    }
 
    const application = new applicatiomModel({
      company_name: company_name.trim(),
      job_title: job_title.trim(),
      job_type,
      status,
      applied_date: new Date(applied_date),
      notes: notes ? notes.trim() : ''
    });
 
    const savedApplication = await application.save();
    res.status(201).json(savedApplication);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
 

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { company_name, job_title, job_type, status, applied_date, notes } = req.body;
 
    
    const updateData = {};
 
    if (company_name !== undefined) {
      if (company_name.trim().length < 2) {
        return res.status(400).json({ error: 'Company name must be min 2 chars' });
      }
      updateData.company_name = company_name.trim();
    }
 
    if (job_title !== undefined) {
      if (job_title.trim().length === 0) {
        return res.status(400).json({ error: 'Job title cannot be empty' });
      }
      updateData.job_title = job_title.trim();
    }
 
    if (job_type !== undefined) {
      if (!['Internship', 'Full-time', 'Part-time'].includes(job_type)) {
        return res.status(400).json({ error: 'Invalid job type' });
      }
      updateData.job_type = job_type;
    }
 
    if (status !== undefined) {
      if (!['Applied', 'Interviewing', 'Offer', 'Rejected'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }
      updateData.status = status;
    }
 
    if (applied_date !== undefined) {
      updateData.applied_date = new Date(applied_date);
    }
 
    if (notes !== undefined) {
      updateData.notes = notes.trim();
    }
 
    const application = await applicatiomModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });
 
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }
 
    res.json(application);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
 

const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;
 
    const application = await applicatiomModel.findByIdAndDelete(id);
 
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }
 
    res.json({ message: 'Application deleted successfully' });
  } catch (error) {
    console.error("Delete error:",error)
    res.status(500).json({ error: error.message });
  }
};
 
export  {
  getAll,
  getById,
  create,
  update,
  deleteApplication
};