import { MenuItem, TextField } from "@material-ui/core";
import { Field } from "formik";

interface CategorySelectorProps {
  selectedCategory: string;
  handleChange: (s: string) => void;
  categoryFields: string[];
}

export const CategorySelector = ({
  selectedCategory,
  handleChange,
  categoryFields
}: CategorySelectorProps) => {
  return (
    <TextField
      variant={"outlined"}
      label={"Category"}
      name={"category"}
      type={"text"}
      placeholder={"Category"}
      fullWidth
      select
      value={selectedCategory}
      onChange={(event) => handleChange(event.target.value)}
    >
      {/* Allow user to select a category to apply to the client */}
      {/* Map the names of each category into a dropdown menu */}
      {categoryFields &&
        categoryFields.map((category) => (
          <MenuItem value={category} key={category}>
            {category}
          </MenuItem>
        ))}
    </TextField>
  );
};

interface CategorySelectorInputProps {
  name: string;
  categoryFields: string[];
}

// Formik-aware wrapper
export const CategorySelectorInput = ({
  name,
  categoryFields
}: CategorySelectorInputProps) => {
  return (
    <Field name={name} id={name}>
      {({ field: { value }, form: { setFieldValue } }) => (
        <div>
          <CategorySelector
            selectedCategory={value}
            handleChange={(category) => setFieldValue(name, category)}
            categoryFields={categoryFields}
          />
        </div>
      )}
    </Field>
  );
};
