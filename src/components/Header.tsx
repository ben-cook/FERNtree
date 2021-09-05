import {
  IconButton,
  Button,
  Toolbar,
  AppBar,
  Container,
  Grid
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import EcoIcon from "@material-ui/icons/Eco";
import PersonAddOutlinedIcon from "@material-ui/icons/PersonAddOutlined";
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
      color: "black"
    }
  })
);

const Header = () => {
  const classes = useStyles();
  const location = useLocation();
  const [user] = useAuthState(firebase.auth());

  const LogoIcon = () => (
    <IconButton color="inherit" size="medium" className={classes.logoIcon}>
      <EcoIcon fontSize="large" />
    </IconButton>
  );

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
          <Grid container justifyContent={"space-between"}>
            <Grid item>
              <Link to="/" className={classes.noTextDecoration}>
                <LogoIcon />
              </Link>
            </Grid>
            <Grid item>
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
