import {
  Chip,
  createStyles,
  IconButton,
  InputAdornment,
  makeStyles,
  TextField,
  Theme
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import { useState } from "react";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      justifyContent: "flex-start",
      flexWrap: "wrap",
      listStyle: "none",
      padding: theme.spacing(0.5),
      margin: 0
    },
    chip: {
      margin: theme.spacing(0.5)
    }
  })
);

const Tags = () => {
  const classes = useStyles();
  const [showAddTag, setShowAddTag] = useState<boolean>(false);

  const [chips, setChips] = useState<string[]>(["Example Tag"]);

  const deleteChip = (chipToDelete: string) => () =>
    setChips((chips) => chips.filter((chip) => chip !== chipToDelete));

  const addChip = (chipToAdd: string) =>
    setChips((chips) => [...chips, chipToAdd]);

  const [textFieldValue, setTextFieldValue] = useState<string>("");

  const handleTextFieldChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTextFieldValue(event.target.value);
  };

  return (
    <>
      {/* <Typography variant="caption">Tags:</Typography> */}
      <div className={classes.root}>
        {chips.map((chip, idx) => (
          <Chip
            key={idx}
            label={chip}
            onDelete={deleteChip(chip)}
            className={classes.chip}
          />
        ))}
        <Chip
          label={showAddTag ? <RemoveIcon /> : <AddIcon />}
          color="primary"
          onClick={() =>
            showAddTag ? setShowAddTag(false) : setShowAddTag(true)
          }
          className={classes.chip}
        />

        {showAddTag && (
          <TextField
            variant="outlined"
            label="Add Tag"
            fullWidth
            margin="normal"
            size="small"
            value={textFieldValue}
            onChange={handleTextFieldChange}
            InputProps={{
              style: { backgroundColor: "white" },
              endAdornment: (
                <InputAdornment component="div" position="end">
                  <IconButton
                    onClick={() => {
                      addChip(textFieldValue);
                      setTextFieldValue("");
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        )}
      </div>
    </>
  );
};

export default Tags;
