import { MenuItem, TextField } from "@material-ui/core";
import { Field } from "formik";

export function CategorySelector(props: {
  selectedCategory: string;
  handleChange: (s: string) => void;
  categories: string[];
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
      {props.categories &&
        props.categories.map((category) => (
          <MenuItem value={category} key={category}>
            {category}
          </MenuItem>
        ))}
    </TextField>
  );
}

interface CategorySelectorInputProps {
  name: string;
  categories: string[];
}

export function CategorySelectorInput({
  name,
  categories
}: CategorySelectorInputProps) {
  return (
    <Field name={name} id={name}>
      {({ field: { value }, form: { setFieldValue } }) => (
        <CategorySelector
          selectedCategory={value}
          handleChange={(category) => setFieldValue(name, category)}
          categories={categories}
        />
      )}
    </Field>
  );
}
