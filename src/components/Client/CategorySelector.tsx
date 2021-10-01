import { MenuItem, TextField } from "@material-ui/core";
import { Field } from "formik";


export function CategorySelector(props: {
  selectedCategory: string,
  handleChange: (s: string) => void,
  categories: string[]

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
        
        onChange={(event) => props.handleChange(event.target.value)}
        
    >
        {/* Allow user to select a category to apply to the client */}
        {/* Map the names of each category into a dropdown menu */}
        {props.categories && props.categories.map((category) => (
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
        categories: string[]}) {
    return (
        <Field name={props.name} id={props.name}>
            {
                
                ({field: { value }, form: { setFieldValue }}) => 
                    <div>
                        <CategorySelector
                            selectedCategory = {value}
                            handleChange = {(category) => setFieldValue(props.name, category)}
                            categories={props.categories}

                        />
                    </div>

            }
        </Field> 
    );

}