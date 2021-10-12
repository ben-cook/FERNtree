import {
  Button,
  makeStyles,
  TextField,
  createStyles,
  Grid
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import { Field } from "formik";
import { useState } from "react";

const useStyles = makeStyles((theme) =>
  createStyles({
    red: {
      backgroundColor: theme.palette.error.light,
      color: theme.palette.error.contrastText
    }
  })
);

export function CustomItemsSelector(props: {
  customFields: string[];
  handleChange: (s: string[]) => void;
}) {
  const classes = useStyles();
  const [adding, setAdding] = useState(false);
  const [toAdd, setToAdd] = useState("");
  return (
    <>
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <TextField
            variant={"outlined"}
            type={"text"}
            placeholder={"New Field"}
            value={toAdd}
            onChange={(e) => {
              setAdding(true);
              setToAdd(e.target.value);
            }}
          />
        </Grid>
        <Grid item>
          <Button
            variant={"contained"}
            color={"primary"}
            disabled={!adding}
            onClick={() => {
              props.customFields.push(toAdd);
              props.handleChange(props.customFields);

              setToAdd("");
              setAdding(false);
            }}
          >
            <AddIcon />
          </Button>
        </Grid>
      </Grid>
      {props.customFields.map((field, idx) => (
        <Grid container key={idx} spacing={2} alignItems="center">
          <Grid item>
            <TextField
              variant={"outlined"}
              type={"text"}
              defaultValue={field}
              onChange={(e) => {
                field = e.target.value;
              }}
              onBlur={() => {
                props.handleChange(props.customFields);
              }}
            />
          </Grid>
          <Grid item>
            <Button
              variant={"contained"}
              className={classes.red}
              onClick={() => {
                props.customFields.splice(idx, 1);
                props.handleChange(props.customFields);
              }}
            >
              <RemoveIcon />
            </Button>
          </Grid>
        </Grid>
      ))}
    </>
  );
}

// Formik-aware wrapper
export function CustomItemsSelectorInput(props: { name: string }) {
  return (
    <Field name={props.name} id={props.name}>
      {({ field: { value }, form: { setFieldValue } }) => (
        <div>
          <CustomItemsSelector
            customFields={value}
            handleChange={(fields: string[]) =>
              setFieldValue(props.name, fields)
            }
          />
        </div>
      )}
    </Field>
  );
}
