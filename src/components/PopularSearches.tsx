import React from "react";
import { Box, Typography, Button } from "@mui/material";

interface PopularSearchesProps {
  searches: string[];
  onClick: (term: string) => void;
  focusedIndex: number;
}

const PopularSearches: React.FC<PopularSearchesProps> = ({
  searches,
  onClick,
  focusedIndex,
}) => {
  if (searches.length === 0) return null;

  return (
    <Box>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        Popular searches
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
        {searches.map((search, index) => (
          <Button
            key={index}
            onClick={() => onClick(search)}
            sx={{
              justifyContent: "flex-start",
              textTransform: "none",
              py: 0.5,
              backgroundColor:
                focusedIndex === index ? "rgba(0, 0, 0, 0.04)" : "transparent",
              "&:hover": {
                backgroundColor:
                  focusedIndex === index
                    ? "rgba(0, 0, 0, 0.08)"
                    : "rgba(0, 0, 0, 0.04)",
              },
              border: focusedIndex === index ? "1px solid #bdbdbd" : "none",
              borderRadius: 1,
            }}
          >
            <Typography variant="body2">{search}</Typography>
          </Button>
        ))}
      </Box>
    </Box>
  );
};

export default PopularSearches;
