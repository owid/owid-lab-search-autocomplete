import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Paper,
  createTheme,
  ThemeProvider,
  CssBaseline,
  IconButton,
  AppBar,
  Toolbar,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import "./App.css";
import { topics, countries, sampleResults } from "./data";
import FilterOptions from "./FilterOptions";
import SearchResults from "./SearchResults";
import SettingsDrawer from "./SettingsDrawer";
import InfoBox from "./components/InfoBox";
import SearchBar from "./components/SearchBar";
import SelectedFilters from "./components/SelectedFilters";

const SearchApp = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [searchResults, setSearchResults] =
    useState<typeof sampleResults>(sampleResults);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [useDropdownFilters, setUseDropdownFilters] = useState(true);

  const theme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  // Function to manually refresh results when auto-refresh is off
  const refreshResults = () => {
    const shuffled = [...sampleResults].sort(() => 0.5 - Math.random());
    const selectedResults = shuffled.slice(
      0,
      Math.floor(Math.random() * 6) + 2
    );
    setSearchResults(selectedResults);
    console.log("Search results manually updated", selectedResults);
  };

  // Auto-refresh effect
  useEffect(() => {
    if (!autoRefresh) return;
    refreshResults();
  }, [searchTerm, selectedTopics, selectedCountries, autoRefresh]);

  const shouldSuggest = searchTerm.length >= 1;

  // Simple filtering without prioritization
  const filteredTopics = topics.filter(
    (topic) =>
      shouldSuggest && topic.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Simple filtering without prioritization
  const filteredCountryNames = countries.filter(
    (country) =>
      shouldSuggest &&
      country.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTopicToggle = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
    setSearchTerm(""); // Clear the search query
  };

  const handleCountryToggle = (country: string) => {
    setSelectedCountries((prev) =>
      prev.includes(country)
        ? prev.filter((c) => c !== country)
        : [...prev, country]
    );
    setSearchTerm(""); // Clear the search query
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton
            color="inherit"
            onClick={toggleDrawer(true)}
            aria-label="settings"
          >
            <SettingsIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container
        maxWidth="md"
        sx={{
          mt: 2,
          width: "100%",
        }}
      >
        <Paper
          elevation={3}
          sx={{ p: 3, borderRadius: 2, bgcolor: "rgba(255, 255, 255, 0.1)" }}
        >
          <InfoBox />

          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filteredTopics={filteredTopics}
            filteredCountries={filteredCountryNames}
            selectedTopics={selectedTopics}
            selectedCountries={selectedCountries}
            handleTopicToggle={handleTopicToggle}
            handleCountryToggle={handleCountryToggle}
            refreshResults={refreshResults}
            autoRefresh={autoRefresh}
            useDropdownFilters={useDropdownFilters}
          />

          {/* Inline filters display when dropdown is not used */}
          {!useDropdownFilters && (
            <FilterOptions
              filteredTopics={filteredTopics}
              filteredCountries={filteredCountryNames}
              selectedTopics={selectedTopics}
              selectedCountries={selectedCountries}
              handleTopicToggle={handleTopicToggle}
              handleCountryToggle={handleCountryToggle}
              // No need to pass onFilterSelect for inline filters
            />
          )}

          {/* Display selected filters as chips */}
          <SelectedFilters
            selectedTopics={selectedTopics}
            selectedCountries={selectedCountries}
            handleTopicToggle={handleTopicToggle}
            handleCountryToggle={handleCountryToggle}
            countries={countries}
          />

          <Box sx={{ mt: 3 }}>
            <SearchResults searchResults={searchResults} />
          </Box>
        </Paper>
      </Container>

      {/* Settings Drawer */}
      <SettingsDrawer
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        autoRefresh={autoRefresh}
        setAutoRefresh={setAutoRefresh}
        useDropdownFilters={useDropdownFilters}
        setUseDropdownFilters={setUseDropdownFilters}
      />
    </ThemeProvider>
  );
};

export default SearchApp;
