import { TextField } from "@material-ui/core";
import { Field } from "formik";


export function CustomItemsSelector(props: {
  customFields: string[];
  handleChange: (s: string[]) => void;
}) {
  
  return (
    <div>
        <TextField
            variant={"outlined"}
            type={"text"}
            placeholder={"New Field"}
            fullWidth
        />
        {
            Array.from(props.customFields.keys()).map((i:number) => 
                <TextField
                    variant={"outlined"}
                    key={props.customFields[i]}
                    type={"text"}
                    defaultValue={props.customFields[i]}
                    fullWidth
                    onChange={(e: any) => {
                        props.customFields[i] = e.target.value;
                    }}
                    onBlur={(e: any) => {
                        props.handleChange(props.customFields);
                    }}
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
