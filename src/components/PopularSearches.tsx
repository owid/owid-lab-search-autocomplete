import { Box, Typography } from "@mui/material";

interface PopularSearchesProps {
  searches: string[];
  onClick: (search: string) => void;
}

const PopularSearches: React.FC<PopularSearchesProps> = ({
  searches,
  onClick,
}) => {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        Popular searches
      </Typography>
      <Box>
        {searches.map((query) => (
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
            onClick={() => onClick(query)}
          >
            🔍 {query}
          </Typography>
        ))}
      </Box>
    </Box>
  );
};

export default PopularSearches;
