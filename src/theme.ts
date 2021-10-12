import { createTheme } from "@material-ui/core/styles";

export type ThemeValue = "light" | "dark";

export const ferntreeColor = {
  light: "#49b34e",
  main: "#388e3c",
  dark: "#00600f"
};

export const lightTheme = createTheme({
  palette: {
    type: "light",
    primary: { ...ferntreeColor, contrastText: "#ffffff" }
  }
});

export const darkTheme = createTheme({
  palette: {
    type: "dark",
    primary: { ...ferntreeColor, contrastText: "#000000" }
  }
});
