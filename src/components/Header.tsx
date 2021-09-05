import {
  IconButton,
  Toolbar,
  AppBar,
  Container,
  Grid
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import EcoIcon from "@material-ui/icons/Eco";
import PersonAddOutlinedIcon from '@material-ui/icons/PersonAddOutlined';
import { useLocation, Link } from "react-router-dom";
import Client from "./Client/Client";

console.log("client: "+Client);
//console.log("Path:" + window.location.pathname); 

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    profileButton: {
      marginRight: theme.spacing(2)
    },
    logoIcon: {
      marginLeft: theme.spacing(2)
    },
    clientButton: {
     // marginRight: theme.spacing(2)
    },
    noTextDecoration: {
      textDecoration: "none",
      color: "black"
    }
  })
);

const Header = () => {
  const classes = useStyles();

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

  const ClientButton = () => (
    <IconButton color="inherit" size="medium" className={classes.clientButton}>
      <PersonAddOutlinedIcon fontSize="large" />
    </IconButton>
  );

  const location = useLocation();
  //console.log(location.pathname);

  // const usePathname = () => {
  //   const location = useLocation();
  //   console.log(location.pathname);
  // }
  

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

              {/* Add Client button only visible on account and any client pages but not new client page */}
              {( (location.pathname == "/account") || ((location.pathname.indexOf("/client")) > -1) ) && (!(location.pathname == "/client/new") ) && (
              <Link
                to="/client/new"
                className={classes.noTextDecoration}
              >
                <ClientButton />
              </Link>)}
            
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
