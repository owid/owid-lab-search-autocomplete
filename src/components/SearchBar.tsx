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

  // Handle arrow down navigation - simplified to use only parentIndex
  const handleArrowDown = () => {
    if (!focusedItem) {
      // First focus item depends on what's available
      if (displayedTopics.length > 0) {
        setFocusedItem({ type: "topic", index: 0 });
      } else if (displayedCountries.length > 0) {
        setFocusedItem({ type: "country", index: 0 });
      } else if (searchTerm) {
        setFocusedItem({ type: "search", index: 0 });
      } else if (arePopularSearchesVisible) {
        setFocusedItem({ type: "popularSearch", index: 0 });
      }
      return;
    }

    // Navigate between categories
    if (focusedItem.type === "topic") {
      if (displayedCountries.length > 0) {
        setFocusedItem({ type: "country", index: 0 });
      } else if (searchTerm) {
        setFocusedItem({ type: "search", index: 0 });
      } else if (arePopularSearchesVisible) {
        setFocusedItem({ type: "popularSearch", index: 0 });
      }
    } else if (focusedItem.type === "country") {
      if (searchTerm) {
        setFocusedItem({ type: "search", index: 0 });
      } else if (arePopularSearchesVisible) {
        setFocusedItem({ type: "popularSearch", index: 0 });
      }
    } else if (focusedItem.type === "search") {
      if (arePopularSearchesVisible) {
        setFocusedItem({ type: "popularSearch", index: 0 });
      }
    } else if (focusedItem.type === "popularSearch") {
      const nextIndex = focusedItem.index + 1;
      if (nextIndex < popularSearches.length) {
        setFocusedItem({ type: "popularSearch", index: nextIndex });
      } else {
        // Cycle back to the first item if at the end
        if (displayedTopics.length > 0) {
          setFocusedItem({ type: "topic", index: 0 });
        } else if (displayedCountries.length > 0) {
          setFocusedItem({ type: "country", index: 0 });
        } else if (searchTerm) {
          setFocusedItem({ type: "search", index: 0 });
        }
      }
    }
  };

  // Handle arrow up navigation - simplified to use only parentIndex
  const handleArrowUp = () => {
    if (!focusedItem) {
      // Focus the last item when pressing up with no focus
      if (arePopularSearchesVisible) {
        setFocusedItem({
          type: "popularSearch",
          index: popularSearches.length - 1,
        });
      } else if (searchTerm) {
        setFocusedItem({ type: "search", index: 0 });
      } else if (displayedCountries.length > 0) {
        setFocusedItem({ type: "country", index: 0 });
      } else if (displayedTopics.length > 0) {
        setFocusedItem({ type: "topic", index: 0 });
      }
      return;
    }

    // Navigate between categories in reverse
    if (focusedItem.type === "popularSearch") {
      if (focusedItem.index > 0) {
        setFocusedItem({
          type: "popularSearch",
          index: focusedItem.index - 1,
        });
      } else if (searchTerm) {
        setFocusedItem({ type: "search", index: 0 });
      } else if (displayedCountries.length > 0) {
        setFocusedItem({ type: "country", index: 0 });
      } else if (displayedTopics.length > 0) {
        setFocusedItem({ type: "topic", index: 0 });
      }
    } else if (focusedItem.type === "search") {
      if (displayedCountries.length > 0) {
        setFocusedItem({ type: "country", index: 0 });
      } else if (displayedTopics.length > 0) {
        setFocusedItem({ type: "topic", index: 0 });
      } else {
        // Cycle to the last popular search only if visible
        if (arePopularSearchesVisible) {
          setFocusedItem({
            type: "popularSearch",
            index: popularSearches.length - 1,
          });
        }
      }
    } else if (focusedItem.type === "country") {
      if (displayedTopics.length > 0) {
        setFocusedItem({ type: "topic", index: 0 });
      } else {
        // Cycle to the last item
        if (arePopularSearchesVisible) {
          setFocusedItem({
            type: "popularSearch",
            index: popularSearches.length - 1,
          });
        } else if (searchTerm) {
          setFocusedItem({ type: "search", index: 0 });
        }
      }
    } else if (focusedItem.type === "topic") {
      // Cycle to the last item
      if (arePopularSearchesVisible) {
        setFocusedItem({
          type: "popularSearch",
          index: popularSearches.length - 1,
        });
      } else if (searchTerm) {
        setFocusedItem({ type: "search", index: 0 });
      } else if (displayedCountries.length > 0) {
        setFocusedItem({ type: "country", index: 0 });
      }
    }
  };

  // Handle horizontal navigation within a category - simplified to use only parentIndex
  const handleArrowRight = () => {
    if (!focusedItem) return;

    if (focusedItem.type === "topic") {
      const nextIndex = focusedItem.index + 1;
      if (nextIndex < displayedTopics.length) {
        setFocusedItem({
          type: "topic",
          index: nextIndex,
        });
      }
    } else if (focusedItem.type === "country") {
      const nextIndex = focusedItem.index + 1;
      if (nextIndex < displayedCountries.length) {
        setFocusedItem({
          type: "country",
          index: nextIndex,
        });
      }
    }
  };

  // Handle horizontal navigation within a category - simplified to use only parentIndex
  const handleArrowLeft = () => {
    if (!focusedItem) return;

    if (focusedItem.type === "topic" || focusedItem.type === "country") {
      const prevIndex = focusedItem.index - 1;
      if (prevIndex >= 0) {
        setFocusedItem({
          ...focusedItem,
          index: prevIndex,
        });
      }
    }
  };

  // Handle selection of focused item - simplified to use only parentIndex
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

  const hasSelectedFilters =
    selectedTopics.length > 0 || selectedCountries.length > 0;

  const hasFiltersToShow =
    filteredTopics.length > 0 ||
    filteredCountries.length > 0 ||
    hasSelectedFilters;

  const arePopularSearchesVisible =
    !searchTerm && !hasSelectedFilters && popularSearches.length > 0;

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
                        py: 1,
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
