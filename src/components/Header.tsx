import logo from "./logo.svg";
import {
  IconButton,
  Button,
  Toolbar,
  AppBar,
  Container,
  Grid,
  Typography
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import Brightness4Icon from "@material-ui/icons/Brightness4";
import Brightness7Icon from "@material-ui/icons/Brightness7";
import PersonAddOutlinedIcon from "@material-ui/icons/PersonAddOutlined";
import { useTheme } from "@material-ui/styles";
import firebase from "firebase/app";
import { useAuthState } from "react-firebase-hooks/auth";
import { useLocation, Link } from "react-router-dom";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    profileButton: {
      marginRight: theme.spacing(2)
    },
    logoIcon: {
      marginLeft: theme.spacing(2)
    },
    newClientButton: {
      marginRight: theme.spacing(2)
    },
    myClientsButton: {
      marginRight: theme.spacing(2)
    },
    noTextDecoration: {
      textDecoration: "none",
      color: theme.palette.primary.contrastText
    }
  })
);

const Header = ({ toggleTheme }: { toggleTheme: () => void }) => {
  const classes = useStyles();
  const location = useLocation();
  const [user] = useAuthState(firebase.auth());
  const theme: Theme = useTheme();

  const ProfileButton = () => (
    <IconButton color="inherit" size="medium" className={classes.profileButton}>
      <AccountCircleIcon fontSize="large" />
    </IconButton>
  );

  const NewClientButton = () => (
    <IconButton
      color="inherit"
      size="medium"
      className={classes.newClientButton}
      disabled={!user || location.pathname == "/client/new"}
    >
      <PersonAddOutlinedIcon fontSize="large" />
    </IconButton>
  );

  return (
    <AppBar position="static">
      <Toolbar>
        <Container>
          <Grid container justifyContent={"space-between"} alignItems="center">
            <Grid item>
              <Link to="/" className={classes.noTextDecoration}>
                <img src={logo} style={{ width: "3rem", height: "3rem" }} />
              </Link>
            </Grid>
            <Grid item>
              <IconButton
                onClick={toggleTheme}
                className={classes.noTextDecoration}
              >
                {theme.palette.type === "light" ? (
                  <>
                    <Typography variant="body1">light mode</Typography>
                    <Brightness4Icon />
                  </>
                ) : (
                  <>
                    <Typography>dark mode</Typography>
                    <Brightness7Icon />
                  </>
                )}
              </IconButton>

              {/* My Clients Button visible when logged in and not on home page. */}
              <Link to="/" className={classes.noTextDecoration}>
                <Button
                  variant="outlined"
                  color="inherit"
                  className={classes.myClientsButton}
                  disabled={!user || location.pathname == "/"}
                >
                  My Clients
                </Button>
              </Link>

              {/* Add Client button visible everywhere when logged in expect new client page */}
              <Link to="/client/new" className={classes.noTextDecoration}>
                <NewClientButton />
              </Link>

              <Link
                to="/account"
                className={classes.noTextDecoration}
                data-cy="profile-button"
              >
                <ProfileButton />
              </Link>
            </Grid>
          </Grid>
        </Container>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
