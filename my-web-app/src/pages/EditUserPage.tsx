import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, updateUserData, clearSelectedUser } from '../redux/store';
import { useEffect, useState } from 'react';
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

interface EditUserPageProps {
    userId: string;
}

const EditUserPage: React.FC<EditUserPageProps> = ({ userId }) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const selectedUser = useSelector((state: RootState) => state.user.selectedUser);

    const validationSchema = Yup.object({
        firstName: Yup.string().required('First Name is required').min(4, 'First Name must be at least 4 characters'),
        lastName: Yup.string().required('Last Name is required').min(4, 'Last Name must be at least 4 characters'),
        email: Yup.string().required('Email is required').email('Invalid email'),
        phone: Yup.string().required('Phone is required').min(4, 'Phone must be at least 4 characters'),
    });

    const formik = useFormik({
        initialValues: {
            firstName: selectedUser?.firstName || '',
            lastName: selectedUser?.lastName || '',
            email: selectedUser?.email || '',
            phone: selectedUser?.phone || '',
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            if (selectedUser) {
                const updatedData = {
                    firstName: values.firstName,
                    lastName: values.lastName,
                    email: values.email,
                    phone: values.phone,
                };

                dispatch(updateUserData(updatedData) as any)  // Type assertion to AnyAction
                    .then(() => {
                        console.log('User data updated successfully');
                        window.alert('User edited successfully!');
                        dispatch(clearSelectedUser());
                        router.push('/dashboard');
                    })
                    .catch((error: any) => {
                        console.error('Error updating user data:', error);
                    });
            }
        },
    });

    const handleCancel = () => {
        router.push('/dashboard');
    };

    useEffect(() => {
        // Fetch the user data using the userId and update the selectedUser state
        // You can make an API call or fetch the user data from your data source
        // and update the selectedUser state with the fetched data
    }, [userId]);

    return (
        <div style={{ padding: 20 }}>
            <div style={{ marginBottom: '2rem' }}>
                <Typography variant="h4" color="blue">Edit User</Typography>
                <Breadcrumbs>
                    <MuiLink color="inherit" href="/dashboard">
                        Dashboard
                    </MuiLink>
                    <Typography color="textPrimary">User</Typography>
                    <Typography color="textPrimary">{selectedUser?.firstName} {selectedUser?.lastName}</Typography>
                </Breadcrumbs>
            </div>

            <Card elevation={4} style={{ backgroundColor: 'white' }}>
                <CardContent>
                    <Typography variant="h6" color="blue" style={{ marginBottom: '1rem' }}>Biodata</Typography>

                    <TextField
                        name="firstName"
                        label="First Name"
                        value={formik.values.firstName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                        helperText={formik.touched.firstName && formik.errors.firstName}
                        fullWidth
                        style={{ marginBottom: '1rem' }}
                    />

                    <TextField
                        name="lastName"
                        label="Last Name"
                        value={formik.values.lastName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                        helperText={formik.touched.lastName && formik.errors.lastName}
                        fullWidth
                        style={{ marginBottom: '1rem' }}
                    />

                    <TextField
                        name="email"
                        label="Email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        helperText={formik.touched.email && formik.errors.email}
                        fullWidth
                        style={{ marginBottom: '1rem' }}
                    />

                    <TextField
                        name="phone"
                        label="Phone"
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.phone && Boolean(formik.errors.phone)}
                        helperText={formik.touched.phone && formik.errors.phone}
                        fullWidth
                        style={{ marginBottom: '1rem' }}
                    />

                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button variant="outlined" type="button" onClick={handleCancel} style={{ marginRight: '1rem' }}>
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"  // Specify the type as "submit"
                            disabled={!formik.isValid || !formik.dirty}
                        >
                            Update
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default EditUserPage;
