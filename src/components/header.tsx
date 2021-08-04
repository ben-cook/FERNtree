import {
  Button,
  IconButton,
  Toolbar,
  Typography,
  AppBar
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import EcoIcon from "@material-ui/icons/Eco";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1
    },
    menuButton: {
      marginRight: theme.spacing(2)
    },
    title: {
      flexGrow: 1
    }
  })
);

const Header = () => {
  const classes = useStyles();
  const history = useHistory();

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          edge="start"
          className={classes.menuButton}
          color="inherit"
          aria-label="menu"
        >
          <MenuIcon />
        </IconButton>

        <Typography
          variant="h6"
          className={classes.title}
          onClick={() => history.push("/")}
        >
          Ferntree
          <EcoIcon />
        </Typography>

        {/* We could use the Link component here, but I forget how to do this without messing up the styling */}
        {/* <Link component={Button} to="/signup">
          Sign Up
        </Link> */}
        <Button color="inherit" onClick={() => history.push("/signup")}>
          Sign Up
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
