import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
  Box
} from '@mui/material';
import '../styles/ApplicationForm.css';

const ApplicationForm = ({ isEdit = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [formData, setFormData] = useState({
    company_name: '',
    job_title: '',
    job_type: 'Internship',
    status: 'Applied',
    applied_date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const [validationErrors, setValidationErrors] = useState({});

  
  useEffect(() => {
    if (isEdit && id) {
      fetchApplication();
    }
  }, [isEdit, id]);

  const fetchApplication = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/applications/${id}`);
      if (!response.ok) throw new Error('Failed to fetch application');

      const data = await response.json();
      setFormData({
        company_name: data.company_name,
        job_title: data.job_title,
        job_type: data.job_type,
        status: data.status,
        applied_date: new Date(data.applied_date).toISOString().split('T')[0],
        notes: data.notes || ''
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.company_name.trim() || formData.company_name.trim().length < 2) {
      errors.company_name = 'Company name required (min 2 characters)';
    }

    if (!formData.job_title.trim()) {
      errors.job_title = 'Job title is required';
    }

    if (!formData.job_type) {
      errors.job_type = 'Job type is required';
    }

    if (!formData.status) {
      errors.status = 'Status is required';
    }

    if (!formData.applied_date) {
      errors.applied_date = 'Applied date is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
   
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: null
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const url = isEdit
        ? `http://localhost:5000/applications/${id}`
        : 'http://localhost:5000/applications';

      const method = isEdit ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save application');
      }

      setSuccess(isEdit ? 'Application updated successfully!' : 'Application created successfully!');
      
     
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={5}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className="application-form-container">
      <div className="form-wrapper">
        <h2>{isEdit ? 'Edit Application' : 'Add New Application'}</h2>

        {error && <Alert severity="error" className="alert">{error}</Alert>}
        {success && <Alert severity="success" className="alert">{success}</Alert>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <TextField
              label="Company Name"
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              fullWidth
              error={Boolean(validationErrors.company_name)}
              helperText={validationErrors.company_name}
              placeholder="e.g., Google, Microsoft"
            />
          </div>

          <div className="form-group">
            <TextField
              label="Job Title"
              name="job_title"
              value={formData.job_title}
              onChange={handleChange}
              fullWidth
              error={Boolean(validationErrors.job_title)}
              helperText={validationErrors.job_title}
              placeholder="e.g., Full Stack Engineer"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <FormControl fullWidth error={Boolean(validationErrors.job_type)}>
                <InputLabel>Job Type</InputLabel>
                <Select
                  name="job_type"
                  value={formData.job_type}
                  onChange={handleChange}
                  label="Job Type"
                >
                  <MenuItem value="Internship">Internship</MenuItem>
                  <MenuItem value="Full-time">Full-time</MenuItem>
                  <MenuItem value="Part-time">Part-time</MenuItem>
                </Select>
              </FormControl>
              {validationErrors.job_type && (
                <p className="error-text">{validationErrors.job_type}</p>
              )}
            </div>

            <div className="form-group">
              <FormControl fullWidth error={Boolean(validationErrors.status)}>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  label="Status"
                >
                  <MenuItem value="Applied">Applied</MenuItem>
                  <MenuItem value="Interviewing">Interviewing</MenuItem>
                  <MenuItem value="Offer">Offer</MenuItem>
                  <MenuItem value="Rejected">Rejected</MenuItem>
                </Select>
              </FormControl>
              {validationErrors.status && (
                <p className="error-text">{validationErrors.status}</p>
              )}
            </div>
          </div>

          <div className="form-group">
            <TextField
              label="Applied Date"
              name="applied_date"
              type="date"
              value={formData.applied_date}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
              error={Boolean(validationErrors.applied_date)}
              helperText={validationErrors.applied_date}
            />
          </div>

          <div className="form-group">
            <TextField
              label="Notes (Optional)"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              fullWidth
              multiline
              rows={4}
              placeholder="e.g., Great company, interesting tech stack..."
            />
          </div>

          <div className="form-actions">
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={submitting}
              className="submit-btn"
            >
              {submitting ? 'Saving...' : isEdit ? 'Update Application' : 'Create Application'}
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/')}
              disabled={submitting}
              className="cancel-btn"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationForm;