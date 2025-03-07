import React, { useState, useRef, useEffect } from "react";
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

// Define country type
type Country = {
  name: string;
  flag: string;
};

// Define navigation types for keyboard controls - simplified to use only type and parentIndex
export type NavigationItem = {
  type: "topic" | "country" | "search" | "popularSearch";
  index: number; // Used for both horizontal navigation and tracking position
};

// Define the available navigation category types
type NavType = "topic" | "country" | "search" | "popularSearch";

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredTopics: string[];
  filteredCountries: Country[];
  selectedTopics: string[];
  selectedCountries: Country[];
  handleTopicToggle: (topic: string) => void;
  handleCountryToggle: (country: Country) => void;
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
  const inputRef = useRef<HTMLInputElement>(null);

  // Add state for keyboard navigation - simplified structure
  const [focusedItem, setFocusedItem] = useState<NavigationItem | null>(null);

  // Get non-selected filtered topics and countries
  const nonSelectedFilteredTopics = filteredTopics.filter(
    (topic) => !selectedTopics.includes(topic)
  );

  const nonSelectedFilteredCountries = filteredCountries.filter(
    (country) =>
      !selectedCountries.some((selected) => selected.name === country.name)
  );

  // Calculate the total topics and countries (selected + non-selected)
  const displayedTopics = [
    ...selectedTopics,
    ...nonSelectedFilteredTopics.slice(0, 5),
  ];
  const displayedCountries = [
    ...selectedCountries,
    ...nonSelectedFilteredCountries.slice(0, 5),
  ];

  const hasSelectedFilters =
    selectedTopics.length > 0 || selectedCountries.length > 0;

  const hasFiltersToShow =
    filteredTopics.length > 0 ||
    filteredCountries.length > 0 ||
    hasSelectedFilters;

  const arePopularSearchesVisible =
    !searchTerm && !hasSelectedFilters && popularSearches.length > 0;

  // Create an array of visible navigation types in order
  const visibleNavTypes: NavType[] = [];
  if (displayedTopics.length > 0) visibleNavTypes.push("topic");
  if (displayedCountries.length > 0) visibleNavTypes.push("country");
  if (searchTerm) visibleNavTypes.push("search");
  if (arePopularSearchesVisible) visibleNavTypes.push("popularSearch");

  // Helper function to get max index for a given type
  const getMaxIndexForType = (type: NavType): number => {
    switch (type) {
      case "topic":
        return displayedTopics.length - 1;
      case "country":
        return displayedCountries.length - 1;
      case "search":
        return 0; // Only one search button
      case "popularSearch":
        return popularSearches.length - 1;
      default:
        return -1;
    }
  };

  // Reset focus when dropdown closes
  useEffect(() => {
    if (!dropdownOpen) {
      setFocusedItem(null);
    }
  }, [dropdownOpen]);

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

  const onInputFocus = () => {
    setIsFocused(true);
    setDropdownOpen(true);
  };

  const onInputBlur = () => {
    setIsFocused(false);
    // Close dropdown on blur
    setTimeout(() => {
      setDropdownOpen(false);
    }, 150); // Small timeout to allow click events to fire first
  };

  // Enhanced key down handler for navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!dropdownOpen) {
      if (event.key === "ArrowDown") {
        setDropdownOpen(true);
        event.preventDefault();
        // Focus the first item in the first category when opening dropdown with arrow down
        if (visibleNavTypes.length > 0) {
          setTimeout(() => {
            setFocusedItem({ type: visibleNavTypes[0], index: 0 });
          }, 0);
        }
      }
      return;
    }

    switch (event.key) {
      case "Escape":
        setDropdownOpen(false);
        event.preventDefault();
        break;

      case "ArrowDown":
        event.preventDefault();
        handleArrowDown();
        break;

      case "ArrowUp":
        event.preventDefault();
        handleArrowUp();
        break;

      case "ArrowRight":
        event.preventDefault();
        handleArrowRight();
        break;

      case "ArrowLeft":
        event.preventDefault();
        handleArrowLeft();
        break;

      case "Enter":
        event.preventDefault();
        if (focusedItem) {
          handleSelectFocusedItem();
        } else if (searchTerm) {
          handleSearchSubmit(event);
        }
        break;
    }
  };

  // Modified arrow down navigation to always go to the next category
  const handleArrowDown = () => {
    if (!focusedItem) {
      // First focus item in the first visible category
      if (visibleNavTypes.length > 0) {
        setFocusedItem({ type: visibleNavTypes[0], index: 0 });
      }
      return;
    }

    // Find current type index in visible types
    const currentTypeIndex = visibleNavTypes.indexOf(focusedItem.type);

    if (currentTypeIndex === -1) {
      // If the current type isn't visible anymore, focus the first item
      if (visibleNavTypes.length > 0) {
        setFocusedItem({ type: visibleNavTypes[0], index: 0 });
      }
      return;
    }

    // Always move to the next category when pressing down
    const nextTypeIndex = (currentTypeIndex + 1) % visibleNavTypes.length;
    const nextType = visibleNavTypes[nextTypeIndex];

    // Keep the same relative position when moving between categories if possible
    // Or use position 0 if the next category doesn't have as many items
    const maxIndexInNextType = getMaxIndexForType(nextType);
    const nextIndex = Math.min(focusedItem.index, maxIndexInNextType);

    setFocusedItem({
      type: nextType,
      index: nextIndex,
    });
  };

  // Modified arrow up navigation to always go to the previous category
  const handleArrowUp = () => {
    if (!focusedItem) {
      // Start from the last visible type
      if (visibleNavTypes.length > 0) {
        const lastType = visibleNavTypes[visibleNavTypes.length - 1];
        setFocusedItem({ type: lastType, index: 0 });
      }
      return;
    }

    // Find current type index in visible types
    const currentTypeIndex = visibleNavTypes.indexOf(focusedItem.type);

    if (currentTypeIndex === -1) {
      // If the current type isn't visible anymore, focus the first item
      if (visibleNavTypes.length > 0) {
        setFocusedItem({ type: visibleNavTypes[0], index: 0 });
      }
      return;
    }

    // Always move to the previous category when pressing up
    const prevTypeIndex =
      (currentTypeIndex - 1 + visibleNavTypes.length) % visibleNavTypes.length;
    const prevType = visibleNavTypes[prevTypeIndex];

    // Keep the same relative position when moving between categories if possible
    // Or use position 0 if the previous category doesn't have as many items
    const maxIndexInPrevType = getMaxIndexForType(prevType);
    const prevIndex = Math.min(focusedItem.index, maxIndexInPrevType);

    setFocusedItem({
      type: prevType,
      index: prevIndex,
    });
  };

  // Modified horizontal navigation to move within categories
  const handleArrowRight = () => {
    if (!focusedItem) return;

    // Only navigate horizontally within the current category
    const maxIndex = getMaxIndexForType(focusedItem.type);
    if (focusedItem.index < maxIndex) {
      setFocusedItem({
        type: focusedItem.type,
        index: focusedItem.index + 1,
      });
    }
  };

  // Modified horizontal navigation to move within categories
  const handleArrowLeft = () => {
    if (!focusedItem) return;

    // Only navigate horizontally within the current category
    if (focusedItem.index > 0) {
      setFocusedItem({
        type: focusedItem.type,
        index: focusedItem.index - 1,
      });
    }
  };

  // Handle selection of focused item
  const handleSelectFocusedItem = () => {
    if (!focusedItem) return;

    if (focusedItem.type === "topic") {
      if (focusedItem.index < displayedTopics.length) {
        handleTopicToggle(displayedTopics[focusedItem.index]);
        handleFilterSelect();
      }
    } else if (focusedItem.type === "country") {
      if (focusedItem.index < displayedCountries.length) {
        handleCountryToggle(displayedCountries[focusedItem.index]);
        handleFilterSelect();
      }
    } else if (focusedItem.type === "search") {
      handleSearchForTerm();
    } else if (focusedItem.type === "popularSearch") {
      if (focusedItem.index < popularSearches.length) {
        handlePopularSearch(popularSearches[focusedItem.index]);
      }
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

  const handleClickAway = () => {
    setIsFocused(false);
    setDropdownOpen(false);
  };

  const handleFilterSelect = () => {
    setDropdownOpen(() => {
      // Focus the input after the state is updated to false
      if (inputRef.current) {
        inputRef.current?.focus();
      }
      return false;
    });
  };

  const handleSearchForTerm = () => {
    setDropdownOpen(false);
    if (!autoRefresh) {
      refreshResults();
    }
  };

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
            onFocus={onInputFocus}
            onBlur={onInputBlur}
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              inputRef: inputRef,
            }}
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />
        </Box>

        {useDropdownFilters &&
          dropdownOpen &&
          (hasFiltersToShow ||
            (!searchTerm && popularSearches.length > 0) ||
            searchTerm) && (
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
                  mt: 0,
                  maxHeight: 300,
                  overflow: "auto",
                  bgcolor: "background.paper",
                }}
              >
                {hasFiltersToShow && (
                  <FilterOptions
                    filteredTopics={filteredTopics}
                    filteredCountries={filteredCountries}
                    selectedTopics={selectedTopics}
                    selectedCountries={selectedCountries}
                    handleTopicToggle={handleTopicToggle}
                    handleCountryToggle={handleCountryToggle}
                    onFilterSelect={handleFilterSelect}
                    focusedItem={focusedItem}
                  />
                )}

                {searchTerm ? (
                  <Box sx={{ mt: hasFiltersToShow ? 2 : 0, mb: 1 }}>
                    <Button
                      fullWidth
                      onClick={handleSearchForTerm}
                      sx={{
                        justifyContent: "flex-start",
                        textTransform: "none",
                        py: 0.5,
                        backgroundColor:
                          focusedItem?.type === "search"
                            ? "rgba(0, 0, 0, 0.04)"
                            : "transparent",
                        "&:hover": {
                          backgroundColor:
                            focusedItem?.type === "search"
                              ? "rgba(0, 0, 0, 0.08)"
                              : "rgba(0, 0, 0, 0.04)",
                        },
                        border:
                          focusedItem?.type === "search"
                            ? "1px solid #bdbdbd"
                            : "none",
                        borderRadius: 1,
                      }}
                    >
                      <Typography>🔎 Search for "{searchTerm}"</Typography>
                    </Button>
                  </Box>
                ) : (
                  !hasSelectedFilters && (
                    <PopularSearches
                      searches={popularSearches}
                      onClick={handlePopularSearch}
                      focusedIndex={
                        focusedItem?.type === "popularSearch"
                          ? focusedItem.index
                          : -1
                      }
                    />
                  )
                )}
              </Paper>
            </Popper>
          )}
      </Box>
    </ClickAwayListener>
  );
};

export default SearchBar;
