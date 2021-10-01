import { Field, Form, Formik } from "formik";
import { TextField } from "formik-material-ui";

export function CustomItemsSelector(props: {
  customFields: string[];
  handleChange: (s: string[]) => void;
}) {
  console.log(props.customFields);
  
  return (
    <div>
        <Formik
            initialValues={props.customFields}
            onSubmit={props.handleChange}
        >
            <Form>
                <Field 
                    component={TextField}
                    variant={"outlined"}
                    type={"text"}
                    placeholder={"New Field"}
                    multiline={true}
                    maxRows={5}
                    rows={3}
                    fullWidth
                />
                {
                    props.customFields.map((field: string) => {
                        <Field 
                            component={TextField}
                            variant={"outlined"}
                            type={"text"}
                            value={field}
                            multiline={true}
                            maxRows={5}
                            rows={3}
                            fullWidth
                        />
                    })
                }
            </Form>
        </Formik>
    </div>
  );
}

// Formik-aware wrapper
export function CustomItemsSelectorInput(props: {name: string}) {
    return (
        <Field name={props.name} id={props.name}>
            {
                
                ({field: { value }, form: { setFieldValue }}) => {
                    return (
                        <div>
                            <CustomItemsSelector
                                customFields = {value}
                                handleChange = {(fields: string[]) => setFieldValue(props.name, fields)}

                            />
                        </div>
                    );
                }

            }
        </Field> 
    );

}
