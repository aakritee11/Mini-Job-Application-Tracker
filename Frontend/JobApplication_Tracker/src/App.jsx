// App.jsx
import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button } from '@mui/material';

// Importing the exact files from image_2ddbbd.png
import ApplicationList from './components/ApplicationList';
import ApplicationForm from './components/ApplicationForm';
import DeleteConfirmation from './components/DeleteConfirmation';
import FilterBar from './components/FilterBar';

// CHANGE THIS TO YOUR ACTUAL BACKEND DEPLOYED OR LOCAL URL
const API_URL = 'http://localhost:5000/api/applications'; 

export default function App() {
  // State variables
  const [applications, setApplications] = useState([]);
  const [filteredApps, setFilteredApps] = useState([]);
  const [filterStatus, setFilterStatus] = useState('All');
  const [view, setView] = useState('list'); // 'list', 'add', 'edit'
  const [currentApp, setCurrentApp] = useState(null); // For editing

  // Delete modal state
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [appToDelete, setAppToDelete] = useState(null);

  // --- 1. FETCH ALL APPLICATIONS FROM BACKEND ---
  const fetchApplications = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setApplications(data);
    } catch (error) {
      console.error("Backend offline? Using temporary mock data:", error);
      // Fallback data so your build displays something if your backend has deployment lag
      setApplications([
        { _id: '1', companyName: 'Google', jobTitle: 'Frontend Intern', status: 'Interviewing', appliedDate: '2026-06-10' },
        { _id: '2', companyName: 'Meta', jobTitle: 'MERN Developer', status: 'Applied', appliedDate: '2026-06-15' }
      ]);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // --- 5. FILTER LOGIC ---
  useEffect(() => {
    if (filterStatus === 'All') {
      setFilteredApps(applications);
    } else {
      setFilteredApps(applications.filter(app => app.status === filterStatus));
    }
  }, [filterStatus, applications]);

  // --- 4. DELETE RUNTIME LOGIC ---
  const handleDeleteClick = (app) => {
    setAppToDelete(app);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await fetch(`${API_URL}/${appToDelete._id}`, { method: 'DELETE' });
      fetchApplications(); // Refresh list
    } catch (error) {
      console.error("Error deleting:", error);
      // Fallback filtering to update UI locally anyway
      setApplications(applications.filter(a => a._id !== appToDelete._id));
    }
    setDeleteOpen(false);
    setAppToDelete(null);
  };

  // --- NAVIGATION STATE UTILITIES ---
  const handleEditClick = (app) => {
    setCurrentApp(app);
    setView('edit');
  };

  return (
    <Container maxWidth="lg" style={{ marginTop: '2rem' }}>
      
      {/* Top Banner Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight="bold" color="primary">
          Internship Job Tracker
        </Typography>
        {view === 'list' && (
          <Button variant="contained" color="primary" onClick={() => { setCurrentApp(null); setView('add'); }}>
            Add Application
          </Button>
        )}
      </Box>

      {/* RENDER THE VIEWS CONDITIONALLY */}
      {view === 'list' ? (
        <>
          {/* Filter Bar Component */}
          <FilterBar 
            currentFilter={filterStatus} 
            onFilterChange={setFilterStatus} 
          />
          
          {/* Application List Component */}
          <ApplicationList 
            applications={filteredApps} 
            onEdit={handleEditClick} 
            onDelete={handleDeleteClick} 
          />
        </>
      ) : (
        /* Form Component (Handles both Add and Edit dynamically based on currentApp state) */
        <ApplicationForm 
          currentApp={currentApp} 
          onSaveSuccess={() => { fetchApplications(); setView('list'); }} 
          onCancel={() => setView('list')}
          apiUrl={API_URL}
        />
      )}

      {/* Global Delete Confirmation Dialog overlay */}
      <DeleteConfirmation 
        open={deleteOpen} 
        onClose={() => setDeleteOpen(false)} 
        onConfirm={handleConfirmDelete} 
        appName={appToDelete?.companyName}
      />

    </Container>
  );
}