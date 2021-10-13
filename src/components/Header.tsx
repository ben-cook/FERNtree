import logo from "./logoWhite.svg";
import {
  IconButton,
  Button,
  Toolbar,
  AppBar,
  Container,
  Grid,
  Typography,
  useMediaQuery,
  Drawer,
  MenuItem
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import Brightness4Icon from "@material-ui/icons/Brightness4";
import Brightness7Icon from "@material-ui/icons/Brightness7";
import MenuIcon from "@material-ui/icons/Menu";
import PersonAddOutlinedIcon from "@material-ui/icons/PersonAddOutlined";
import { useTheme } from "@material-ui/styles";
import firebase from "firebase/app";
import { useState } from "react";
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
      color: "#fff"
    },
    noTextDecorationDrawerItem: {
      textDecoration: "none",
      color: theme.palette.getContrastText(theme.palette.primary.contrastText)
    },
    drawerContainer: {
      padding: "20px 30px"
    }
  })
);

const Header = ({ toggleTheme }: { toggleTheme: () => void }) => {
  const classes = useStyles();
  const location = useLocation();
  const theme: Theme = useTheme();
  const mobileView = useMediaQuery(theme.breakpoints.down("xs"));

  const [open, setOpen] = useState<boolean>(false);
  const [user] = useAuthState(firebase.auth());

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

  if (mobileView) {
    return (
      <AppBar position="static">
        <Toolbar>
          <Container>
            <Grid
              container
              justifyContent={"space-between"}
              alignItems="center"
            >
              <Grid item>
                <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  aria-haspopup="true"
                  onClick={() => setOpen(true)}
                  style={{ marginRight: "1rem" }}
                >
                  <MenuIcon fontSize="large" />
                </IconButton>
              </Grid>
              <Grid item>
                <Link to="/" className={classes.noTextDecoration}>
                  <img src={logo} style={{ width: "3rem", height: "3rem" }} />
                </Link>
              </Grid>
            </Grid>

            <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
              <div className={classes.drawerContainer}>
                <Link
                  to={"/account"}
                  className={classes.noTextDecorationDrawerItem}
                >
                  <MenuItem>
                    <Typography variant="h6">My Account</Typography>
                  </MenuItem>
                </Link>
                <Link to={"/"} className={classes.noTextDecorationDrawerItem}>
                  <MenuItem>
                    <Typography variant="h6">My Contacts</Typography>
                  </MenuItem>
                </Link>
                <Link
                  to={"/client/new"}
                  className={classes.noTextDecorationDrawerItem}
                >
                  <MenuItem>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center"
                    }}
                  >
                    <Typography variant="h6"
                      align="left"
                      display="inline"
                      style={{ marginRight: "0.4rem" }}>
                        New Contact
                    </Typography>
                    <PersonAddOutlinedIcon style={{ flexGrow: 1 }} />
                  </div>
                  </MenuItem>

                </Link>

                <MenuItem>
                  <div
                    onClick={toggleTheme}
                    className={classes.noTextDecorationDrawerItem}
                  >
                    {theme.palette.type === "light" ? (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center"
                        }}
                      >
                        <Typography
                          variant="h6"
                          align="left"
                          display="inline"
                          style={{ marginRight: "0.4rem" }}
                        >
                          Light Mode
                        </Typography>
                        <Brightness4Icon style={{ flexGrow: 1 }} />
                      </div>
                    ) : (
                      <>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center"
                          }}
                        >
                          <Typography
                            variant="h6"
                            align="left"
                            display="inline"
                            style={{ marginRight: "0.4rem" }}
                          >
                            Dark Mode
                          </Typography>
                          <Brightness7Icon style={{ flexGrow: 1 }} />
                        </div>
                      </>
                    )}
                  </div>
                </MenuItem>
              </div>
            </Drawer>
          </Container>
        </Toolbar>
      </AppBar>
    );
  }

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
                style={{ marginRight: "1rem" }}
              >
                {theme.palette.type === "light" ? (
                  <>
                    <Typography
                      variant="body1"
                      style={{ marginRight: "0.4rem" }}
                    >
                      Light Mode
                    </Typography>
                    <Brightness4Icon />
                  </>
                ) : (
                  <>
                    <Typography
                      variant="body1"
                      style={{ marginRight: "0.4rem" }}
                    >
                      Dark Mode
                    </Typography>
                    <Brightness7Icon />
                  </>
                )}
              </IconButton>

              {/* My Contacts Button visible when logged in and not on home page. */}
              <Link to="/" className={classes.noTextDecoration}>
                <Button
                  variant="outlined"
                  color="inherit"
                  className={classes.myClientsButton}
                  disabled={!user || location.pathname == "/"}
                >
                  My Contacts
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
