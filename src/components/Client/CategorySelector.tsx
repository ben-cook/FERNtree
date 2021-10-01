import { MenuItem, TextField } from "@material-ui/core";
import { Field } from "formik";
import { CustomCategory } from "../../types";


export function CategorySelector(props: {
  selectedCategory: string,
  handleChange: (s: string) => void,
  categoryFields: string[]

}) {
  
  return (
    <TextField 
        variant={"outlined"}
        label={"Category"}
        name={"category"}
        type={"text"}
        placeholder={"Category"}
        fullWidth
        select
        value={props.selectedCategory}
        // onClick={(event: { target: { value: string; }; }) =>
        //   // When dropdown is changed, update selectedCategory
        //   handleCategoryChange(event.target.value)
        onChange={(event) => props.handleChange(event.target.value)}
        
    >
        {/* Allow user to select a category to apply to the client */}
        {/* Map the names of each category into a dropdown menu */}
        {props.categoryFields && props.categoryFields.map((category) => (
            <MenuItem value={category} key={category}>
            {category}
            </MenuItem>
        ))}
    </TextField>
    
    
  );
}

// Formik-aware wrapper
export function CategorySelectorInput(props: {
        name: string, 
        categoryFields: string[]}) {
    return (
        <Field name={props.name} id={props.name}>
            {
                
                ({field: { value }, form: { setFieldValue }}) => 
                    <div>
                        <CategorySelector
                            selectedCategory = {value}
                            handleChange = {(category) => setFieldValue(props.name, category)}
                            categoryFields={props.categoryFields}

                        />
                    </div>

            }
        </Field> 
    );

}