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
  const hasFilteredTopics = filteredTopics.length > 0;
  const hasFilteredCountries = filteredCountries.length > 0;

  // New wrapper functions to call onFilterSelect after toggling
  const onTopicSelect = (topic: string) => {
    handleTopicToggle(topic);
    if (onFilterSelect) onFilterSelect();
  };

  const onCountrySelect = (country: string) => {
    handleCountryToggle(country);
    if (onFilterSelect) onFilterSelect();
  };

  // Get topics that are not selected but in filtered list
  const nonSelectedFilteredTopics = filteredTopics.filter(
    (topic) => !selectedTopics.includes(topic)
  );

  // Get countries that are not selected but in filtered list
  const nonSelectedFilteredCountries = filteredCountries.filter(
    (country) => !selectedCountries.includes(country.name)
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
            {selectedTopics.map((topic) => (
              <Chip
                key={topic}
                label={topic}
                onClick={() => onTopicSelect(topic)}
                color="primary"
                size="small"
              />
            ))}

            {/* Show up to 5 non-selected topics */}
            {nonSelectedFilteredTopics.slice(0, 5).map((topic) => (
              <Chip
                key={topic}
                label={topic}
                onClick={() => onTopicSelect(topic)}
                color="default"
                size="small"
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
            {selectedCountries.map((countryName) => {
              const country = filteredCountries.find(
                (c) => c.name === countryName
              ) || { name: countryName, flag: "" };
              return (
                <Chip
                  key={country.name}
                  label={`${country.flag} ${country.name}`}
                  onClick={() => onCountrySelect(country.name)}
                  color="primary"
                  size="small"
                />
              );
            })}

            {/* Show up to 5 non-selected countries */}
            {nonSelectedFilteredCountries.slice(0, 5).map(({ name, flag }) => (
              <Chip
                key={name}
                label={`${flag} ${name}`}
                onClick={() => onCountrySelect(name)}
                color="default"
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
