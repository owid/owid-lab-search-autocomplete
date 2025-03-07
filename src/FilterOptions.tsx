import React from "react";
import { Box, Typography, Chip } from "@mui/material";
import { NavigationItem } from "./components/SearchBar";

// Define country type
type Country = {
  name: string;
  flag: string;
};

interface FilterOptionsProps {
  filteredTopics: string[];
  filteredCountries: Country[];
  selectedTopics: string[];
  selectedCountries: Country[];
  handleTopicToggle: (topic: string) => void;
  handleCountryToggle: (country: Country) => void;
  onFilterSelect?: () => void;
  focusedItem: NavigationItem | null;
}

const FilterOptions: React.FC<FilterOptionsProps> = ({
  filteredTopics,
  filteredCountries,
  selectedTopics,
  selectedCountries,
  handleTopicToggle,
  handleCountryToggle,
  onFilterSelect,
  focusedItem,
}) => {
  const hasFilteredTopics = filteredTopics.length > 0;
  const hasFilteredCountries = filteredCountries.length > 0;

  // New wrapper functions to call onFilterSelect after toggling
  const onTopicSelect = (topic: string) => {
    handleTopicToggle(topic);
    if (onFilterSelect) onFilterSelect();
  };

  const onCountrySelect = (country: Country) => {
    handleCountryToggle(country);
    if (onFilterSelect) onFilterSelect();
  };

  // Get topics that are not selected but in filtered list
  const nonSelectedFilteredTopics = filteredTopics.filter(
    (topic) => !selectedTopics.includes(topic)
  );

  // Get countries that are not selected but in filtered list
  const nonSelectedFilteredCountries = filteredCountries.filter(
    (country) =>
      !selectedCountries.some((selected) => selected.name === country.name)
  );

  return (
    <>
      {/* Always show topic filters if there are either selected topics or filtered topics */}
      {(selectedTopics.length > 0 || hasFilteredTopics) && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Filter by topic
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {/* Show selected topics first */}
            {selectedTopics.map((topic, idx) => (
              <Chip
                key={topic}
                label={topic}
                onClick={() => onTopicSelect(topic)}
                color="primary"
                size="small"
                sx={{
                  outline:
                    focusedItem?.type === "topic" && focusedItem.index === idx
                      ? "2px solid #ffeb3b" // Using a yellow color for better contrast against blue
                      : "none",
                  outlineOffset: "1px", // Adding offset to make outline more visible
                }}
              />
            ))}

            {/* Show up to 5 non-selected topics */}
            {nonSelectedFilteredTopics.slice(0, 5).map((topic, idx) => (
              <Chip
                key={topic}
                label={topic}
                onClick={() => onTopicSelect(topic)}
                color="default"
                size="small"
                sx={{
                  outline:
                    focusedItem?.type === "topic" &&
                    focusedItem.index === idx + selectedTopics.length
                      ? "2px solid #ffeb3b"
                      : "none",
                }}
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Always show country filters if there are either selected countries or filtered countries */}
      {(selectedCountries.length > 0 || hasFilteredCountries) && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Filter by country
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {/* Show selected countries first */}
            {selectedCountries.map((country, idx) => (
              <Chip
                key={country.name}
                label={`${country.flag} ${country.name}`}
                onClick={() => onCountrySelect(country)}
                color="primary"
                size="small"
                sx={{
                  outline:
                    focusedItem?.type === "country" && focusedItem.index === idx
                      ? "2px solid #ffeb3b" // Using a yellow color for better contrast against blue
                      : "none",
                  outlineOffset: "1px", // Adding offset to make outline more visible
                }}
              />
            ))}

            {/* Show up to 5 non-selected countries */}
            {nonSelectedFilteredCountries.slice(0, 5).map((country, idx) => (
              <Chip
                key={country.name}
                label={`${country.flag} ${country.name}`}
                onClick={() => onCountrySelect(country)}
                color="default"
                size="small"
                sx={{
                  outline:
                    focusedItem?.type === "country" &&
                    focusedItem.index === idx + selectedCountries.length
                      ? "2px solid #ffeb3b"
                      : "none",
                }}
              />
            ))}
          </Box>
        </Box>
      )}
    </>
  );
};

export default FilterOptions;
