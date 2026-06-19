import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Box,
  Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import '../styles/ApplicationList.css';

const ApplicationList = ({ status, searchTerm }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const navigate = useNavigate();

 
  useEffect(() => {
    fetchApplications();
  }, [status, searchTerm]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);

      let url = 'http://localhost:5000/applications';
      const params = new URLSearchParams();

      if (status) params.append('status', status);
      if (searchTerm) params.append('search', searchTerm);

      if (params.toString()) {
        url += '?' + params.toString();
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch applications');

      const data = await response.json();
      setApplications(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/applications/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete');

      setApplications(applications.filter(app => app._id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit/${id}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">Error: {error}</Alert>;
  }

  if (applications.length === 0) {
    return (
      <Alert severity="info">
        No applications found. {applications.length === 0 && !status && !searchTerm && 'Click "Add Application" to get started!'}
      </Alert>
    );
  }

  return (
    <div className="application-list-container">
      <TableContainer component={Paper} className="table-wrapper">
        <Table>
          <TableHead>
            <TableRow className="table-header">
              <TableCell><strong>Company</strong></TableCell>
              <TableCell><strong>Job Title</strong></TableCell>
              <TableCell><strong>Job Type</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Applied Date</strong></TableCell>
              <TableCell align="center"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {applications.map((app) => (
              <TableRow key={app._id} className="table-row">
                <TableCell>{app.company_name}</TableCell>
                <TableCell>{app.job_title}</TableCell>
                <TableCell>
                  <span className={`badge badge-${app.job_type.toLowerCase().replace('-', '')}`}>
                    {app.job_type}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={`status status-${app.status.toLowerCase().replace(' ', '')}`}>
                    {app.status}
                  </span>
                </TableCell>
                <TableCell>{formatDate(app.applied_date)}</TableCell>
                <TableCell align="center">
                  <Button
                    startIcon={<EditIcon />}
                    onClick={() => handleEdit(app._id)}
                    size="small"
                    variant="outlined"
                    color="primary"
                    className="action-btn"
                  >
                    Edit
                  </Button>
                  <Button
                    startIcon={<DeleteIcon />}
                    onClick={() => setDeleteConfirm(app._id)}
                    size="small"
                    variant="outlined"
                    color="error"
                    className="action-btn"
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog open={Boolean(deleteConfirm)} onClose={() => setDeleteConfirm(null)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this application?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm(null)}>Cancel</Button>
          <Button
            onClick={() => handleDelete(deleteConfirm)}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ApplicationList;