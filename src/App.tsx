import { useState, useEffect, useRef } from "react";
import {
  TextField,
  Chip,
  Box,
  Typography,
  Container,
  Paper,
  InputAdornment,
  createTheme,
  ThemeProvider,
  CssBaseline,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Drawer,
  IconButton,
  AppBar,
  Toolbar,
  Switch,
  FormControlLabel,
  Divider,
  Popover,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import SettingsIcon from "@mui/icons-material/Settings";
import FilterListIcon from "@mui/icons-material/FilterList";
import "./App.css";
import { topics, countries, sampleResults } from "./data";

const popularSearches = ["death rate from air pollution", "political regime"];

const SearchApp = () => {
  const [searchTerm, setSearchTerm] = useState("po");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<typeof sampleResults>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [useDropdownFilters, setUseDropdownFilters] = useState(true);
  const searchInputRef = useRef<HTMLDivElement>(null);
  const [filterMenuAnchorEl, setFilterMenuAnchorEl] =
    useState<null | HTMLElement>(null);
  const [showAutoFilterDropdown, setShowAutoFilterDropdown] = useState(false);

  const theme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  useEffect(() => {
    // Skip auto-refresh if the setting is turned off
    if (!autoRefresh) return;

    // Simulate search results based on search term or filters
    // Shuffle and select random results
    const shuffled = [...sampleResults].sort(() => 0.5 - Math.random());
    const selectedResults = shuffled.slice(
      0,
      Math.floor(Math.random() * 6) + 2
    ); // 2-7 results
    setSearchResults(selectedResults);
    console.log("Search results updated", selectedResults);
  }, [searchTerm, selectedTopics, selectedCountries, autoRefresh]);

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

  const shouldSuggest = searchTerm.length >= 2;

  const filteredTopics = topics.filter(
    (topic) =>
      (shouldSuggest &&
        topic.toLowerCase().includes(searchTerm.toLowerCase())) ||
      selectedTopics.includes(topic)
  );

  const filteredCountries = countries.filter(
    (country) =>
      (shouldSuggest &&
        country.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      selectedCountries.includes(country.name)
  );

  const displayTopics = filteredTopics.length > 0;
  const displayCountries = filteredCountries.length > 0;

  // Show auto filter dropdown when typing and matches are found
  useEffect(() => {
    if (useDropdownFilters && searchTerm.length >= 2) {
      const hasMatches =
        filteredTopics.length > 0 || filteredCountries.length > 0;
      setShowAutoFilterDropdown(hasMatches);
    } else {
      setShowAutoFilterDropdown(false);
    }
  }, [
    filteredCountries.length,
    filteredTopics.length,
    searchTerm,
    useDropdownFilters,
  ]);

  // Filter menu handlers
  const handleFilterMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setFilterMenuAnchorEl(event.currentTarget);
  };

  const handleFilterMenuClose = () => {
    setFilterMenuAnchorEl(null);
  };

  const handleTopicToggle = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
    setShowAutoFilterDropdown(false); // Close the dropdown
  };

  const handleCountryToggle = (country: string) => {
    setSelectedCountries((prev) =>
      prev.includes(country)
        ? prev.filter((c) => c !== country)
        : [...prev, country]
    );
    setShowAutoFilterDropdown(false); // Close the dropdown
  };

  // Handler for search input focus/blur
  const handleSearchFocus = () => {
    if (useDropdownFilters && shouldSuggest) {
      const hasMatches =
        filteredTopics.length > 0 || filteredCountries.length > 0;
      setShowAutoFilterDropdown(hasMatches);
    }
  };

  const handleSearchBlur = (e: React.FocusEvent) => {
    // Check if the relatedTarget (element receiving focus) is within the filter dropdown
    if (
      !e.relatedTarget ||
      !document
        .getElementById("filter-dropdown")
        ?.contains(e.relatedTarget as Node)
    ) {
      // Only hide if the focus is not going to an element in the dropdown
      setTimeout(() => {
        setShowAutoFilterDropdown(false);
      }, 200); // Small delay to allow clicks to register in dropdown
    }
  };

  const displayFilters = displayTopics || displayCountries;
  const hasSelectedFilters =
    selectedTopics.length > 0 || selectedCountries.length > 0;

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
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              mb: 3,
              p: 2,
              bgcolor: "rgba(255, 255, 255, 0.05)",
              borderRadius: 1,
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <LightbulbIcon sx={{ mr: 2, color: "yellow", fontSize: 24 }} />
            <Typography variant="body2">
              This is an interactive search prototype to check how jarring it
              would be to have filter suggestions appear and disappear as you
              type (see{" "}
              <a
                href="https://www.figma.com/board/WAEixjqYsOJ3ztqTrBNXc5/R%26D-Search?node-id=409-2291&t=0SUzo3D5FdTS5lca-0"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "inherit" }}
              >
                figma
              </a>
              ). The search results are random and do not reflect actual data.
              Topics and countries are neither exhaustive nor accurate.
            </Typography>
          </Box>

          <Box sx={{ position: "relative" }} ref={searchInputRef}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    {displayFilters &&
                      useDropdownFilters &&
                      !showAutoFilterDropdown && (
                        <IconButton
                          edge="end"
                          onClick={handleFilterMenuOpen}
                          aria-label="show filters"
                          title="Show filters"
                        >
                          <FilterListIcon
                            color={hasSelectedFilters ? "primary" : "inherit"}
                          />
                        </IconButton>
                      )}
                    {!autoRefresh && (
                      <IconButton
                        edge="end"
                        onClick={refreshResults}
                        aria-label="refresh results"
                        title="Refresh results"
                      >
                        <SearchIcon />
                      </IconButton>
                    )}
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />

            {/* Auto-appearing dropdown when typing */}
            {displayFilters && useDropdownFilters && showAutoFilterDropdown && (
              <Paper
                id="filter-dropdown"
                sx={{
                  p: 2,
                  width: "100%",
                  maxHeight: 300,
                  overflow: "auto",
                  position: "absolute",
                  top: "calc(100% - 20px)", // Move dropdown slightly below the search bar
                  left: 0,
                  zIndex: 1000,
                  mt: 0.5,
                  boxShadow: 3,
                  borderRadius: 1,
                }}
              >
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
                          onClick={() => handleTopicToggle(topic)}
                          color={
                            selectedTopics.includes(topic)
                              ? "primary"
                              : "default"
                          }
                          size="small"
                        />
                      ))}
                    </Box>
                  </Box>
                )}

                {displayCountries && (
                  <Box>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                      Filter by country
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {filteredCountries.map(({ name, flag }) => (
                        <Chip
                          key={name}
                          label={`${flag} ${name}`}
                          onClick={() => handleCountryToggle(name)}
                          color={
                            selectedCountries.includes(name)
                              ? "primary"
                              : "default"
                          }
                          size="small"
                        />
                      ))}
                    </Box>
                  </Box>
                )}
              </Paper>
            )}

            {/* Manual filter dropdown when clicking filter icon */}
            {displayFilters && useDropdownFilters && (
              <Popover
                open={Boolean(filterMenuAnchorEl)}
                anchorEl={filterMenuAnchorEl}
                onClose={handleFilterMenuClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                sx={{ mt: 1 }}
              >
                <Paper
                  sx={{ p: 2, width: 280, maxHeight: 400, overflow: "auto" }}
                >
                  {displayTopics && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle1" sx={{ mb: 1 }}>
                        Topics
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {filteredTopics.map((topic) => (
                          <Chip
                            key={topic}
                            label={topic}
                            onClick={() => handleTopicToggle(topic)}
                            color={
                              selectedTopics.includes(topic)
                                ? "primary"
                                : "default"
                            }
                            size="small"
                          />
                        ))}
                      </Box>
                    </Box>
                  )}

                  {displayCountries && (
                    <Box>
                      <Typography variant="subtitle1" sx={{ mb: 1 }}>
                        Countries
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {filteredCountries.map(({ name, flag }) => (
                          <Chip
                            key={name}
                            label={`${flag} ${name}`}
                            onClick={() => handleCountryToggle(name)}
                            color={
                              selectedCountries.includes(name)
                                ? "primary"
                                : "default"
                            }
                            size="small"
                          />
                        ))}
                      </Box>
                    </Box>
                  )}
                </Paper>
              </Popover>
            )}
          </Box>

          {/* Inline filters display when dropdown is not used */}
          {!useDropdownFilters && (
            <>
              {displayTopics && (
                <>
                  <Typography variant="subtitle1">Filter by topic</Typography>
                  <Box
                    sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}
                  >
                    {filteredTopics.map((topic) => (
                      <Chip
                        key={topic}
                        label={topic}
                        onClick={() => handleTopicToggle(topic)}
                        color={
                          selectedTopics.includes(topic) ? "primary" : "default"
                        }
                      />
                    ))}
                  </Box>
                </>
              )}

              {displayCountries && (
                <>
                  <Typography variant="subtitle1">Filter by country</Typography>
                  <Box
                    sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}
                  >
                    {filteredCountries.map(({ name, flag }) => (
                      <Chip
                        key={name}
                        label={`${flag} ${name}`}
                        onClick={() => handleCountryToggle(name)}
                        color={
                          selectedCountries.includes(name)
                            ? "primary"
                            : "default"
                        }
                      />
                    ))}
                  </Box>
                </>
              )}
            </>
          )}

          {/* Display selected filters as chips regardless of display mode */}
          {hasSelectedFilters && (
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
                    countries.find((c) => c.name === country)?.flag +
                    " " +
                    country
                  }
                  onDelete={() => handleCountryToggle(country)}
                  color="primary"
                  size="small"
                />
              ))}
            </Box>
          )}

          <Typography variant="subtitle1">Popular searches</Typography>
          <Box>
            {popularSearches.map((query) => (
              <Typography
                key={query}
                variant="body2"
                sx={{
                  cursor: "pointer",
                  mb: 1,
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
                onClick={() => setSearchTerm(query)}
              >
                🔍 {query}
              </Typography>
            ))}
          </Box>

          <Box sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              {searchResults.map((result, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Card
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="140"
                      image={`${result.image}&sig=${index}`} // Add sig param to avoid image caching
                      alt={result.title}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h6" component="div">
                        {result.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {result.subtitle}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Paper>
      </Container>

      {/* Settings Drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box sx={{ width: 300, p: 3 }} role="presentation">
          <Typography variant="h6" sx={{ mb: 2 }}>
            Settings
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <FormControlLabel
            control={
              <Switch
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                name="autoRefresh"
                color="primary"
              />
            }
            label="Auto-refresh results as you type"
          />
          <Typography
            variant="body2"
            sx={{ mt: 1, mb: 3, color: "text.secondary" }}
          >
            {autoRefresh
              ? "Results will update automatically as you type or change filters."
              : "Results will only update when you press the search icon."}
          </Typography>

          <FormControlLabel
            control={
              <Switch
                checked={useDropdownFilters}
                onChange={(e) => setUseDropdownFilters(e.target.checked)}
                name="useDropdownFilters"
                color="primary"
              />
            }
            label="Use dropdown for filter suggestions"
          />
          <Typography variant="body2" sx={{ mt: 1, color: "text.secondary" }}>
            {useDropdownFilters
              ? "Filters will appear in a dropdown when typing or clicking the filter icon."
              : "Filters will display inline below the search box."}
          </Typography>
        </Box>
      </Drawer>
    </ThemeProvider>
  );
};

export default SearchApp;
