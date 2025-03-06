import {
  Drawer,
  Box,
  Typography,
  Divider,
  FormControlLabel,
  Switch,
} from "@mui/material";

interface SettingsDrawerProps {
  open: boolean;
  onClose: () => void;
  autoRefresh: boolean;
  setAutoRefresh: (value: boolean) => void;
  useDropdownFilters: boolean;
  setUseDropdownFilters: (value: boolean) => void;
}

const SettingsDrawer: React.FC<SettingsDrawerProps> = ({
  open,
  onClose,
  autoRefresh,
  setAutoRefresh,
  useDropdownFilters,
  setUseDropdownFilters,
}) => {
  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
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
  );
};

export default SettingsDrawer;
