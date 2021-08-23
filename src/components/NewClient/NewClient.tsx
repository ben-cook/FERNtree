import { Typography, makeStyles, createStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) =>
  createStyles({
    title: {
      marginTop: theme.spacing(5)
    }
  })
);

const NewClient = () => {
  const classes = useStyles();
  return (
    <>
      <Typography variant="h4" className={classes.title}>
        New Client Profile
      </Typography>
    </>
  );
};

export default NewClient;
