import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#f57c00",
    },
  },
  typography: {
    h2: {
      fontSize: "20px",
      textTransform: "none",
    },
    h4: {
      fontSize: "12px",
      textTransform: "none",
    },
    h5: {
      fontSize: "10px",
      textTransform: "none",
    },
    h3: {
      fontSize: "14px",
      textTransform: "none",
    },
  },
});

export default theme;
