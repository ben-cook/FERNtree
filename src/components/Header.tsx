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
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    profileButton: {
      marginRight: theme.spacing(2)
    },
    logoIcon: {
      marginLeft: theme.spacing(2)
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

  return (
    <AppBar position="static">
      <Toolbar>
        <Container>
          <Grid container justifyContent={"space-between"}>
            <Grid item>
              <Link component={LogoIcon} to="/" />
            </Grid>
            <Grid item>
              <Link component={ProfileButton} to="/signup" />
            </Grid>
          </Grid>
        </Container>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
