import { TextField } from "@material-ui/core";
import { Field } from "formik";


export function CustomItemsSelector(props: {
  customFields: string[];
  handleChange: (s: string[]) => void;
}) {
  console.log(props.customFields);
  
  return (
    <div>
        <TextField
            variant={"outlined"}
            type={"text"}
            placeholder={"New Field"}
            fullWidth
        />
        {
            props.customFields.map((field: string) => 
                <TextField
                    variant={"outlined"}
                    key={field}
                    type={"text"}
                    value={field}
                    fullWidth
                />
            )
        }
    </div>
  );
}

// Formik-aware wrapper
export function CustomItemsSelectorInput(props: {name: string}) {
    return (
        <Field name={props.name} id={props.name}>
            {
                
                ({field: { value }, form: { setFieldValue }}) => 
                    <div>
                        <CustomItemsSelector
                            customFields = {value}
                            handleChange = {(fields: string[]) => setFieldValue(props.name, fields)}

                        />
                    </div>

            }
        </Field> 
    );

}
