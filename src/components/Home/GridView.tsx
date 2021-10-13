import {
  ClientConcreteValues,
  ClientCustomFields,
  ClientTags,
  CustomCategory
} from "../../../functions/src/types";
import ClientCard from "./ClientCard";
import {
  Card,
  createStyles,
  Grid,
  IconButton,
  makeStyles
} from "@material-ui/core";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import { Data } from "react-firebase-hooks/firestore/dist/firestore/types";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) =>
  createStyles({
    icon: {
      width: 30,
      height: 30,
      color: theme.palette.getContrastText(theme.palette.primary.contrastText)
    }
  })
);

interface GridViewProps {
  clientData: Data<
    ClientConcreteValues &
      ClientTags &
      ClientCustomFields & {
        id: string;
      },
    "",
    ""
  >[];
  categoryData: Data<
    CustomCategory & {
      name: string;
    },
    "",
    ""
  >[];
}

const GridView = ({ clientData, categoryData }: GridViewProps) => {
  const classes = useStyles();

  const PersonAddButton = () => (
    <IconButton color="primary" size="medium" className={classes.icon}>
      <PersonAddIcon fontSize="large" />
    </IconButton>
  );

  // List of category names to be passed into client cards for category verification
  let categoryNames: string[] = [];
  categoryNames = !categoryData
    ? [] // return empty array if no category data
    : categoryData.map((value) => {
        return value.name;
      });

  return (
    <Grid container spacing={3}>
      {/*Add new client card*/}
      <Grid item key={0} xs={12} sm={6} md={4}>
        <Link to="/client/new">
          <Card style={{ height: "100%", minHeight: 400 }}>
            <Grid
              container
              direction="column"
              justifyContent="center"
              alignContent="stretch"
              alignItems="center"
              style={{ height: "100%" }}
            >
              <Grid item>
                <PersonAddButton />
              </Grid>
            </Grid>
          </Card>
        </Link>
      </Grid>

      {clientData.map((client, idx) => {
        const {
          id,
          firstName,
          lastName,
          address,
          category,
          email,
          phone,
          notes,
          tags,
          ...rest
        } = client;

        return (
          <Grid item key={idx} xs={12} sm={6} md={4}>
            <ClientCard
              id={id}
              concreteValues={{
                firstName,
                lastName,
                address,
                category,
                email,
                phone,
                notes
              }}
              categoryNames={categoryNames}
              tags={tags}
              customFields={rest}
            />
          </Grid>
        );
      })}
    </Grid>
  );
};
export default GridView;
