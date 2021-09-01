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
import * as Yup from "yup";
import { useParams, matchPath, useLocation } from "react-router-dom"

interface FormValues {
    firstName: string;
    lastName: string;
    business: string;
    address: string;

    category: string;

    email: string;
    phone: string;

    payRate: string;
    jobStatus: "Not Started" | "In Progress" | "Completed";

    notes: string;

    [customField: string]: string | number;
}

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

    const initialValues: FormValues = {
        firstName: "",
        lastName: "",
        business: "",
        address: "",
        category: "",
        email: "",
        phone: "",
        payRate: "",
        jobStatus: "Not Started",
        notes: ""
    };


    const match = matchPath(useLocation().pathname, {
        path: "/client/:clientId",
    });
    //const { clientId } = useParams<{ clientId: string }>();
    const clientId = match.params['clientId'];
    console.log('Client Id: ', clientId);

    return (
        <>
            <Grid container justifyContent="center">
                <Grid item xs={12} sm={8} md={6}>
                    <Typography variant="h4" className={classes.title}>
                        {clientId == "new" && "New Client Profile"}
                        {clientId != "new" && clientId}

                    </Typography>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={Yup.object().shape({
                            firstName: Yup.string(),
                            lastName: Yup.string(),
                            business: Yup.string(),
                            address: Yup.string(),
                            email: Yup.string().email(),
                            phone: Yup.string(),
                            payRate: Yup.string(),
                            jobStatus: Yup.string(),
                            notes: Yup.string()
                        })}
                        onSubmit={(
                            values: FormValues,
                            { setSubmitting }: FormikHelpers<FormValues>
                        ) => {
                            setSubmitting(true);

                            console.log("submitting");
                            console.log(values);
                        }}
                    >
                        {({ isSubmitting }) => (
                            <Form>
                                <Grid container direction={"row"} spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <Field
                                            component={TextField}
                                            variant={"outlined"}
                                            label={"First Name"}
                                            name={"firstName"}
                                            type={"text"}
                                            placeholder={"First Name"}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Field
                                            component={TextField}
                                            variant={"outlined"}
                                            label={"Last Name"}
                                            name={"lastName"}
                                            type={"text"}
                                            placeholder={"Last Name"}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Field
                                            component={TextField}
                                            variant={"outlined"}
                                            label={"Business"}
                                            name={"business"}
                                            type={"text"}
                                            placeholder={"Business"}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Field
                                            component={TextField}
                                            variant={"outlined"}
                                            label={"Address"}
                                            name={"address"}
                                            type={"text"}
                                            placeholder={"Address"}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Field
                                            component={TextField}
                                            variant={"outlined"}
                                            label={"Category"}
                                            name={"category"}
                                            type={"text"}
                                            placeholder={"Category"}
                                            fullWidth
                                            select
                                        >
                                            <MenuItem value="Not Started">Not Started</MenuItem>
                                            <MenuItem value="In Progress">In Progress</MenuItem>
                                            <MenuItem value="Completed">Completed</MenuItem>
                                        </Field>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="h5">Contact Information</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Field
                                            component={TextField}
                                            variant={"outlined"}
                                            label={"Email"}
                                            name={"email"}
                                            type={"text"}
                                            placeholder={"Email"}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Field
                                            component={TextField}
                                            variant={"outlined"}
                                            label={"Phone Number"}
                                            name={"phone"}
                                            type={"text"}
                                            placeholder={"Phone Number"}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="h5">Job Information</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Field
                                            component={TextField}
                                            variant={"outlined"}
                                            label={"Pay Rate"}
                                            name={"payRate"}
                                            type={"text"}
                                            placeholder={"Pay Rate"}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Field
                                            component={TextField}
                                            variant={"outlined"}
                                            label={"Job Status"}
                                            name={"jobStatus"}
                                            type={"text"}
                                            placeholder={"Job Status"}
                                            fullWidth
                                            select
                                        >
                                            <MenuItem value="Not Started">Not Started</MenuItem>
                                            <MenuItem value="In Progress">In Progress</MenuItem>
                                            <MenuItem value="Completed">Completed</MenuItem>
                                        </Field>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="h5">Additional Information</Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Field
                                            component={TextField}
                                            variant={"outlined"}
                                            label={"Notes"}
                                            name={"notes"}
                                            type={"text"}
                                            placeholder={"Notes"}
                                            fullWidth
                                        />
                                    </Grid>
                                </Grid>
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
                            </Form>
                        )}
                    </Formik>
                </Grid>
            </Grid>
        </>
    );
};

export default Client;
