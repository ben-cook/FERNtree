import { Button, TextField } from "@material-ui/core";
import { Field } from "formik";
import { useState } from "react";

export function CustomItemsSelector(props: {
  customFields: string[];
  handleChange: (s: string[]) => void;
}) {
  const [adding, setAdding] = useState(false);
  const [toAdd, setToAdd] = useState("");
  return (
    <div>
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
      <Button
        variant={"contained"}
        color={"primary"}
        disabled={!adding}
        onClick={(e) => {
          props.customFields.push(toAdd);
          props.handleChange(props.customFields);

          setToAdd("");
          setAdding(false);
        }}
      >
        Add
      </Button>
      {Array.from(props.customFields.keys()).map((i: number) => (
        <div key={i}>
          <TextField
            variant={"outlined"}
            type={"text"}
            defaultValue={props.customFields[i]}
            onChange={(e: any) => {
              props.customFields[i] = e.target.value;
            }}
            onBlur={(e: any) => {
              props.handleChange(props.customFields);
            }}
          />
          <Button
            variant={"contained"}
            color={"primary"}
            onClick={(e) => {
              props.customFields.splice(i, 1);
              props.handleChange(props.customFields);
            }}
          >
            Remove
          </Button>
        </div>
      ))}
    </div>
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
