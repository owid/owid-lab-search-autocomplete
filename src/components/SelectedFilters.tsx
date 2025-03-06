import { Box, Chip } from "@mui/material";

interface SelectedFiltersProps {
  selectedTopics: string[];
  selectedCountries: string[];
  handleTopicToggle: (topic: string) => void;
  handleCountryToggle: (country: string) => void;
  countries: { name: string; flag: string }[];
}

const SelectedFilters: React.FC<SelectedFiltersProps> = ({
  selectedTopics,
  selectedCountries,
  handleTopicToggle,
  handleCountryToggle,
  countries,
}) => {
  if (selectedTopics.length === 0 && selectedCountries.length === 0) {
    return null;
  }

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
      {selectedTopics.map((topic) => (
        <Chip
          key={topic}
          label={topic}
          onDelete={() => handleTopicToggle(topic)}
          color="primary"
          size="small"
        />
      ))}
      {selectedCountries.map((country) => (
        <Chip
          key={country}
          label={
            countries.find((c) => c.name === country)?.flag + " " + country
          }
          onDelete={() => handleCountryToggle(country)}
          color="primary"
          size="small"
        />
      ))}
    </Box>
  );
};

export default SelectedFilters;
