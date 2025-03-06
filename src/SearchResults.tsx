import { Grid, Card, CardContent, CardMedia, Typography } from "@mui/material";

interface SearchResultsProps {
  searchResults: {
    title: string;
    subtitle: string;
    image: string;
  }[];
}

const SearchResults: React.FC<SearchResultsProps> = ({ searchResults }) => {
  return (
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
  );
};

export default SearchResults;
