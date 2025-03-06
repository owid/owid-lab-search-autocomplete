import React, { useState, useRef } from "react";
import {
  Box,
  TextField,
  InputAdornment,
  Popper,
  Paper,
  ClickAwayListener,
  Typography,
  Button,
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
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);

    // Show dropdown on text input (behavior unchanged)
    if (value.length > 0) {
      setDropdownOpen(true);
    } else {
      // Only close if not focused
      if (!isFocused) {
        setDropdownOpen(false);
      }
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    setDropdownOpen(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Close dropdown on blur
    setTimeout(() => {
      setDropdownOpen(false);
    }, 150); // Small timeout to allow click events to fire first
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
    setIsFocused(false);
    setDropdownOpen(false);
  };

  // Close dropdown when filter is selected
  const handleFilterSelect = () => {
    setDropdownOpen(false);
  };

  // Function to handle clicking on the "Search for [term]" button
  const handleSearchForTerm = () => {
    setDropdownOpen(false);
    if (!autoRefresh) {
      refreshResults();
    }
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
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
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
        {useDropdownFilters &&
          dropdownOpen &&
          (hasFiltersToShow || popularSearches.length > 0 || searchTerm) && (
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
                {hasFiltersToShow && (
                  <FilterOptions
                    filteredTopics={filteredTopics}
                    filteredCountries={filteredCountries}
                    selectedTopics={selectedTopics}
                    selectedCountries={selectedCountries}
                    handleTopicToggle={handleTopicToggle}
                    handleCountryToggle={handleCountryToggle}
                    onFilterSelect={handleFilterSelect}
                  />
                )}

                {/* Show "Search for [term]" when there's a search term */}
                {searchTerm ? (
                  <Box sx={{ mt: hasFiltersToShow ? 2 : 0, mb: 1 }}>
                    <Button
                      fullWidth
                      onClick={handleSearchForTerm}
                      sx={{
                        justifyContent: "flex-start",
                        textTransform: "none",
                        py: 1,
                      }}
                    >
                      <Typography>🔎 Search for "{searchTerm}"</Typography>
                    </Button>
                  </Box>
                ) : (
                  /* Popular searches display when no search term */
                  <PopularSearches
                    searches={popularSearches}
                    onClick={handlePopularSearch}
                  />
                )}
              </Paper>
            </Popper>
          )}
      </Box>
    </ClickAwayListener>
  );
};

export default SearchBar;
