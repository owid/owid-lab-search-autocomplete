import { Box, Typography } from "@mui/material";
import LightbulbIcon from "@mui/icons-material/Lightbulb";

const InfoBox = () => {
  return (
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
        This is an interactive search prototype to check how jarring it would be
        to have filter suggestions appear and disappear as you type (see{" "}
        <a
          href="https://www.figma.com/board/WAEixjqYsOJ3ztqTrBNXc5/R%26D-Search?node-id=409-2291&t=0SUzo3D5FdTS5lca-0"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "inherit" }}
        >
          figma
        </a>
        ). The search results are random and do not reflect actual data. Topics
        and countries are neither exhaustive nor accurate.
      </Typography>
    </Box>
  );
};

export default InfoBox;
