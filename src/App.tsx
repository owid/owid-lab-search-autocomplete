import { useState, useEffect } from "react";
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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import "./App.css";
import { topics, countries, sampleResults } from "./data";

const popularSearches = ["death rate from air pollution", "political regime"];

const SearchApp = () => {
  const [searchTerm, setSearchTerm] = useState("po");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<typeof sampleResults>([]);

  const theme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  useEffect(() => {
    // Simulate search results based on search term or filters
    // Shuffle and select random results
    const shuffled = [...sampleResults].sort(() => 0.5 - Math.random());
    const selectedResults = shuffled.slice(
      0,
      Math.floor(Math.random() * 6) + 2
    ); // 2-7 results
    setSearchResults(selectedResults);
    console.log("Search results updated", selectedResults);
  }, [searchTerm, selectedTopics, selectedCountries]);

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

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container
        maxWidth="md"
        sx={{
          mt: 4,
          width: "100%",
        }}
      >
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
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

          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />

          {displayTopics && (
            <>
              <Typography variant="subtitle1">Filter by topic</Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                {filteredTopics.map((topic) => (
                  <Chip
                    key={topic}
                    label={topic}
                    onClick={() =>
                      setSelectedTopics((prev) =>
                        prev.includes(topic)
                          ? prev.filter((t) => t !== topic)
                          : [...prev, topic]
                      )
                    }
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
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                {filteredCountries.map(({ name, flag }) => (
                  <Chip
                    key={name}
                    label={`${flag} ${name}`}
                    onClick={() =>
                      setSelectedCountries((prev) =>
                        prev.includes(name)
                          ? prev.filter((c) => c !== name)
                          : [...prev, name]
                      )
                    }
                    color={
                      selectedCountries.includes(name) ? "primary" : "default"
                    }
                  />
                ))}
              </Box>
            </>
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
    </ThemeProvider>
  );
};

export default SearchApp;
