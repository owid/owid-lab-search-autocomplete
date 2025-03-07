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
              border:
                focusedIndex === index
                  ? "2px solid #ffeb3b"
                  : "2px solid transparent",
              borderRadius: 1,
              transition: "border 0s",
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
