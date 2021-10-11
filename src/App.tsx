import Router from "./Router";
import Header from "./components/Header";
import { darkTheme, lightTheme, ThemeValue } from "./theme";
import { Container, CssBaseline } from "@material-ui/core";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { useState } from "react";

const App = () => {
  const [themeToggle, setThemeToggle] = useState<ThemeValue>("light");
  const toggleTheme = () =>
    setThemeToggle((currentTheme) =>
      currentTheme === "light" ? "dark" : "light"
    );

  const theme = themeToggle === "light" ? lightTheme : darkTheme;

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Header toggleTheme={toggleTheme} />
      <Container>
        <Router />
      </Container>
    </MuiThemeProvider>
  );
};

export default App;
