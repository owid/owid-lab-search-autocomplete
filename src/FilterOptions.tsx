import React from "react";
import { Box, Typography, Chip } from "@mui/material";

interface FilterOptionsProps {
  filteredTopics: string[];
  filteredCountries: { name: string; flag: string }[];
  selectedTopics: string[];
  selectedCountries: string[];
  handleTopicToggle: (topic: string) => void;
  handleCountryToggle: (country: string) => void;
  onFilterSelect?: () => void; // New optional callback
}

const FilterOptions: React.FC<FilterOptionsProps> = ({
  filteredTopics,
  filteredCountries,
  selectedTopics,
  selectedCountries,
  handleTopicToggle,
  handleCountryToggle,
  onFilterSelect,
}) => {
  const displayTopics = filteredTopics.length > 0;
  const displayCountries = filteredCountries.length > 0;

  // New wrapper functions to call onFilterSelect after toggling
  const onTopicSelect = (topic: string) => {
    handleTopicToggle(topic);
    if (onFilterSelect) onFilterSelect();
  };

  const onCountrySelect = (country: string) => {
    handleCountryToggle(country);
    if (onFilterSelect) onFilterSelect();
  };

  return (
    <>
      {displayTopics && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Filter by topic
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {filteredTopics.map((topic) => (
              <Chip
                key={topic}
                label={topic}
                onClick={() => onTopicSelect(topic)}
                color={selectedTopics.includes(topic) ? "primary" : "default"}
                size="small"
              />
            ))}
          </Box>
        </Box>
      )}

      {displayCountries && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Filter by country
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {filteredCountries.map(({ name, flag }) => (
              <Chip
                key={name}
                label={`${flag} ${name}`}
                onClick={() => onCountrySelect(name)}
                color={selectedCountries.includes(name) ? "primary" : "default"}
                size="small"
              />
            ))}
          </Box>
        </Box>
      )}
    </>
  );
};

export default FilterOptions;
