import { ClientConcreteValues } from "../../types";
import { Avatar, makeStyles } from "@material-ui/core";
import md5 from "md5";

export default function ClientAvatar(props: {
  firstName: string;
  lastName: string;
  email: string;
  size: number;
}) {
  const useStyles = makeStyles({
    sized: {
      width: props.size,
      height: props.size,
      margin: "1rem"
    }
  });

  if (!(props && props.firstName)) return <div></div>;

  const classes = useStyles();

  // The url for the backup name image from ui-avatars
  const nameImg = `https://ui-avatars.com/api/${
    props.firstName[0] + props.lastName[0]
  }/${props.size}/318335/ffffff`;

  // The gravatar url, with ui-avatars image encoded as backup
  const gravatar = `https://www.gravatar.com/avatar/${md5(
    props.email.trim()
  )}?s=${props.size}&d=${encodeURI(nameImg)}`;

  // Return mui avatar component
  return (
    <Avatar
      alt={`${props.firstName} ${props.lastName}`}
      src={gravatar}
      className={classes.sized}
    />
  );
}
