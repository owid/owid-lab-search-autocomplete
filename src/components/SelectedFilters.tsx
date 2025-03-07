import React from "react";
import { Box, Chip } from "@mui/material";

// Define country type
type Country = {
  name: string;
  flag: string;
};

interface SelectedFiltersProps {
  selectedTopics: string[];
  selectedCountries: Country[]; // Now an array of country objects
  handleTopicToggle: (topic: string) => void;
  handleCountryToggle: (country: Country) => void; // Updated to handle country objects
  countries: Country[];
}

const SelectedFilters: React.FC<SelectedFiltersProps> = ({
  selectedTopics,
  selectedCountries,
  handleTopicToggle,
  handleCountryToggle,
}) => {
  const hasSelectedFilters =
    selectedTopics.length > 0 || selectedCountries.length > 0;

  if (!hasSelectedFilters) return null;

  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {selectedTopics.map((topic) => (
          <Chip
            key={topic}
            label={topic}
            onDelete={() => handleTopicToggle(topic)}
            onClick={() => handleTopicToggle(topic)}
            color="primary"
            size="small"
            sx={{ cursor: "pointer" }}
          />
        ))}
        {selectedCountries.map((country) => (
          <Chip
            key={country.name}
            label={`${country.flag} ${country.name}`}
            onDelete={() => handleCountryToggle(country)}
            onClick={() => handleCountryToggle(country)}
            color="primary"
            size="small"
            sx={{ cursor: "pointer" }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default SelectedFilters;
