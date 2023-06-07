import React from 'react';
import { unwrapResult } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { addUser, RootState } from '../redux/store';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import {
    Card,
    CardContent,
    Typography,
    Breadcrumbs,
    Link as MuiLink,
    TextField,
    Button,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

interface AddUserProps {
    // Additional props for your component
}

const AddUser: React.FC<AddUserProps> = () => {
    const dispatch = useDispatch();
    const router = useRouter();

    const validationSchema = Yup.object({
        firstName: Yup.string().required('First Name is required').min(4, 'First Name must be at least 4 characters'),
        lastName: Yup.string().required('Last Name is required').min(4, 'Last Name must be at least 4 characters'),
        email: Yup.string().required('Email is required').email('Invalid email'),
        phone: Yup.string().required('Phone is required').min(4, 'Phone must be at least 4 characters'),
    });

    type AppThunk<ReturnType = void> = ThunkAction<
        ReturnType,
        RootState,
        unknown,
        AnyAction
    >;

    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values: any) => {
            (dispatch as ThunkDispatch<RootState, unknown, AnyAction>)(addUser(values))
                .then(() => {
                    console.log('User added successfully');
                    window.alert('User added successfully!');
                    router.push('/dashboard');
                })
                .catch((error: any) => {
                    // Handle error case
                    window.alert(error);
                });
        },
    });

    const handleCancel = () => {
        router.push('/dashboard');
    };

    return (
        <div style={{ padding: 20 }}>
            <div style={{ marginBottom: '2rem' }}>
                <Typography variant="h4" color="blue">Add User</Typography>
                <Breadcrumbs>
                    <MuiLink color="inherit" href="/dashboard">
                        Dashboard
                    </MuiLink>
                    <Typography color="textPrimary">User</Typography>
                    <Typography color="textPrimary">Add</Typography>
                </Breadcrumbs>
            </div>

            <Card elevation={4} style={{ backgroundColor: 'white' }}>
                <CardContent>
                    <Typography variant="h6" color="blue" style={{ marginBottom: '1rem' }}>Biodata</Typography>

                    <TextField
                        id="firstName"
                        name="firstName"
                        label="First Name"
                        value={formik.values.firstName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                        helperText={
                            formik.touched.firstName && formik.errors.firstName
                                ? formik.errors.firstName.toString()
                                : ''
                        }
                        fullWidth
                        style={{ marginBottom: '1rem' }}
                    />

                    <TextField
                        id="lastName"
                        name="lastName"
                        label="Last Name"
                        value={formik.values.lastName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                        helperText={
                            formik.touched.lastName && formik.errors.lastName
                                ? formik.errors.lastName.toString()
                                : ''
                        }
                        fullWidth
                        style={{ marginBottom: '1rem' }}
                    />

                    <TextField
                        id="email"
                        name="email"
                        label="Email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        helperText={
                            formik.touched.email && formik.errors.email
                                ? formik.errors.email.toString()
                                : ''
                        }
                        fullWidth
                        style={{ marginBottom: '1rem' }}
                    />

                    <TextField
                        id="phone"
                        name="phone"
                        label="Phone"
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.phone && Boolean(formik.errors.phone)}
                        helperText={
                            formik.touched.phone && formik.errors.phone
                                ? formik.errors.phone.toString()
                                : ''
                        }
                        fullWidth
                        style={{ marginBottom: '1rem' }}
                    />

                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => router.push('/dashboard')}
                            type="button" // Add this line
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            disabled={!formik.isValid || !formik.dirty}
                            onClick={() => formik.handleSubmit()}
                            type="button" // Add this line
                        >
                            Add User
                        </Button>

                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AddUser;
