import { createTheme } from "@material-ui/core/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#4caf50",
      light: "#81c784",
      dark: "#388e3c"
    }
  }
});

// Alternate option for theme from https://material.io/resources/color/#!/?view.left=0&view.right=0&primary.color=388E3C
// main: "#388e3c",
// light: "#6abf69",
// dark: "#00600f"

export default theme;
