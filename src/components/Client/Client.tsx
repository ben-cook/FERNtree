import {
    Typography,
    makeStyles,
    createStyles,
    Button,
    Grid,
    Box,
    MenuItem
} from "@material-ui/core";
import { Field, Form, Formik, FormikHelpers } from "formik";
import { TextField } from "formik-material-ui";
import { useState } from "react";
import { useParams, matchPath, useLocation } from "react-router-dom";
import * as Yup from "yup";

// interface FormValues {
//     firstName: string;
//     lastName: string;
//     business: string;
//     address: string;

//     category: string;

//     email: string;
//     phone: string;

//     payRate: string;
//     jobStatus: "Not Started" | "In Progress" | "Completed";

//     notes: string;

//     [customField: string]: string | number;
// }

const useStyles = makeStyles((theme) =>
    createStyles({
        title: {
            marginTop: theme.spacing(5),
            marginBottom: theme.spacing(2)
        },
        submitButton: {
            marginTop: theme.spacing(3),
            marginBottom: theme.spacing(3)
        }
    })
);

const Client = () => {
    const classes = useStyles();
    //temp dummy array to emulate category 'fields' (attribute of category object)
    const category = ["firstName", "lastName", "dateOfBirth"];

    /* Commented this out - not sure if needed? */
    // const initialValues: FormValues = {
    //     firstName: "",
    //     lastName: "",
    //     business: "",
    //     address: "",
    //     category: "",
    //     email: "",
    //     phone: "",
    //     payRate: "",
    //     jobStatus: "Not Started",
    //     notes: ""
    // };

    const match = matchPath(useLocation().pathname, {
        path: "/client/:clientId"
    });
    //const { clientId } = useParams<{ clientId: string }>();
    const clientId = match.params["clientId"];
    console.log("Client Id: ", clientId);

    return (
        <>
            <Grid container justifyContent="center">
                <Grid item xs={12} sm={8} md={6}>
                    <Typography variant="h4" className={classes.title}>
                        {clientId == "new" && "New Client Profile"}
                        {clientId != "new" && clientId}
                    </Typography>
                    <Formik
                        initialValues={Array(category.length).fill("")}
                        onSubmit={(
                            values: any,
                            { setSubmitting }: FormikHelpers<any>
                        ) => {
                            setSubmitting(true);

                            console.log("submitting");
                            console.log(values);
                        }}
                    >


                        {({ isSubmitting }) => (
                            <Form>
                                <Grid container direction={"row"} spacing={2}>
                                    {/* dynamic form fields occurs here - done by mapping category fields */}
                                    {category.map((attb) => (
                                        <Grid item key={attb} xs={12} sm={6}>
                                            <Field
                                                type="text"
                                                name={attb}
                                                placeholder={attb}
                                                Fullwidth
                                            />
                                        </Grid>
                                    ))}
                                    <Box textAlign="center">
                                        <Button
                                            type={"submit"}
                                            variant={"contained"}
                                            color={"primary"}
                                            disabled={isSubmitting}
                                            className={classes.submitButton}
                                        >
                                            Save
                                        </Button>
                                    </Box>
                                </Grid>
                            </Form>
                        )}
                    </Formik>
                </Grid>
            </Grid>
        </>
    );
};

export default Client;
