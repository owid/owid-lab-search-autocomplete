import React, { useState, useRef } from "react";
import {
  Box,
  TextField,
  InputAdornment,
  Popper,
  Paper,
  ClickAwayListener,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterOptions from "../FilterOptions";
import PopularSearches from "./PopularSearches";
import { popularSearches } from "../data";

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredTopics: string[];
  filteredCountries: { name: string; flag: string }[];
  selectedTopics: string[];
  selectedCountries: string[];
  handleTopicToggle: (topic: string) => void;
  handleCountryToggle: (country: string) => void;
  refreshResults: () => void;
  autoRefresh: boolean;
  useDropdownFilters: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  setSearchTerm,
  filteredTopics,
  filteredCountries,
  selectedTopics,
  selectedCountries,
  handleTopicToggle,
  handleCountryToggle,
  refreshResults,
  autoRefresh,
  useDropdownFilters,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    if (value.length > 0) {
      setDropdownOpen(true);
    } else {
      setDropdownOpen(false);
    }
  };

  // Add key down handler for the input field
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape" && dropdownOpen) {
      setDropdownOpen(false);
      event.preventDefault(); // Prevent other default escape behaviors
    }
  };

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setDropdownOpen(false);
    if (!autoRefresh) {
      refreshResults();
    }
  };

  const handlePopularSearch = (term: string) => {
    setSearchTerm(term);
    setDropdownOpen(false);
    if (!autoRefresh) {
      refreshResults();
    }
  };

  // Close dropdown when clicking away
  const handleClickAway = () => {
    setDropdownOpen(false);
  };

  // Close dropdown when filter is selected
  const handleFilterSelect = () => {
    setDropdownOpen(false);
  };

  const hasFiltersToShow =
    filteredTopics.length > 0 || filteredCountries.length > 0;

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box sx={{ position: "relative", width: "100%" }}>
        <Box component="form" onSubmit={handleSearchSubmit}>
          <TextField
            ref={searchRef}
            fullWidth
            placeholder="Search for a topic or country..."
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown} // Add key down handler here
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />
        </Box>

        {/* Dropdown filter options */}
        {useDropdownFilters && dropdownOpen && hasFiltersToShow && (
          <Popper
            open={true}
            anchorEl={searchRef.current}
            placement="bottom-start"
            style={{
              width: searchRef.current?.clientWidth,
              zIndex: 1301,
            }}
          >
            <Paper
              sx={{
                p: 2,
                mt: 1,
                maxHeight: 300,
                overflow: "auto",
                bgcolor: "background.paper",
              }}
            >
              {/* Filtered topics and countries */}
              <FilterOptions
                filteredTopics={filteredTopics}
                filteredCountries={filteredCountries}
                selectedTopics={selectedTopics}
                selectedCountries={selectedCountries}
                handleTopicToggle={handleTopicToggle}
                handleCountryToggle={handleCountryToggle}
                onFilterSelect={handleFilterSelect} // Pass the callback to close dropdown
              />
              {/* Popular searches display */}
              <PopularSearches
                searches={popularSearches}
                onClick={handlePopularSearch}
              />
            </Paper>
          </Popper>
        )}
      </Box>
    </ClickAwayListener>
  );
};

export default SearchBar;
