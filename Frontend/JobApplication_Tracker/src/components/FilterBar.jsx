import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Box
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import '../styles/FilterBar.css';

const FilterBar = ({ status, searchTerm, onStatusChange, onSearchChange, onClear }) => {
  return (
    <div className="filter-bar-container">
      <div className="filter-bar">
        <div className="filter-group search-group">
          <TextField
            placeholder="Search by company or job title..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            variant="outlined"
            size="small"
            fullWidth
            InputProps={{
              startAdornment: <SearchIcon className="search-icon" />
            }}
            className="search-input"
          />
        </div>

        <div className="filter-group">
          <FormControl variant="outlined" size="small" fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={status}
              onChange={(e) => onStatusChange(e.target.value)}
              label="Status"
              className="status-select"
            >
              <MenuItem value="">All Statuses</MenuItem>
              <MenuItem value="Applied">Applied</MenuItem>
              <MenuItem value="Interviewing">Interviewing</MenuItem>
              <MenuItem value="Offer">Offer</MenuItem>
              <MenuItem value="Rejected">Rejected</MenuItem>
            </Select>
          </FormControl>
        </div>

        {(status || searchTerm) && (
          <Button
            variant="outlined"
            color="secondary"
            onClick={onClear}
            startIcon={<ClearIcon />}
            className="clear-btn"
          >
            Clear
          </Button>
        )}
      </div>
    </div>
  );
};

export default FilterBar;