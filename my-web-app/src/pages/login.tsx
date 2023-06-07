import { useDispatch } from 'react-redux';
import { setUsername, setPassword } from '../store/userSlice';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextField, InputAdornment, IconButton, Checkbox, Button, Divider } from '@mui/material';
import { Visibility, VisibilityOff, ExitToApp, AccountCircle } from '@mui/icons-material';
import styles from './login.module.css'

const validationSchema = Yup.object({
    username1: Yup.string().required('Username is required'),
    password1: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const LoginPage = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const [username1, setUsername1] = useState('');
    const [password1, setPassword1] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    useEffect(() => {
        const savedUsername = localStorage.getItem('username');
        const savedPassword = localStorage.getItem('password');
        if (savedUsername && savedPassword) {
            setUsername1(savedUsername);
            setPassword1(savedPassword);
        }
    }, []);

    const formik = useFormik({
        initialValues: {
            username1: '',
            password1: '',
        },
        validationSchema,
        onSubmit: (values: any) => {
            handleLogin(values.username1, values.password1);
        },
    });

    const handleLogin = (username: any, password: any) => {
        // Dispatch your login action and handle authentication logic here
        // For simplicity, we'll just log the username and password for now
        if (username === 'hamid' && password === '123456') {
            // Save the credentials to Local Storage
            localStorage.setItem('username', username);
            localStorage.setItem('password', password);

            dispatch(setUsername(username));
            dispatch(setPassword(password));
            router.push('/dashboard');
        }
    };

    return (
        <div className={styles.grayDiv}>
            <div className={styles.card}>
                <div style={{ padding: 20 }}>
                    <div style={{ fontSize: '1.2rem', color: 'blue', fontWeight: 'bold', fontFamily: 'sans-serif' }}>
                        Login Organization CMS
                    </div>

                    <div style={{ fontSize: '0.8rem', color: 'grey', marginBottom: '2rem' }}>
                        Silahkan isi form dibawah untuk login ke dashboard
                    </div>
                    <TextField
                        name="username1"
                        label="Username"
                        value={formik.values.username1}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={!!(formik.touched.username1 && formik.errors.username1)}
                        helperText={
                            formik.touched.username1 && formik.errors.username1
                                ? formik.errors.username1.toString()
                                : ''
                        }
                        sx={{ width: '100%', marginBottom: '1rem' }}
                    />

                    <TextField
                        type={showPassword ? 'text' : 'password'}
                        label="Password"
                        name="password1"
                        value={formik.values.password1}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={!!(formik.touched.password1 && formik.errors.password1)}
                        helperText={formik.touched.password1 && formik.errors.password1 ? formik.errors.password1.toString()
                            : ''}
                        sx={{ width: '100%', marginBottom: '1rem' }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={handleTogglePassword} edge="end">
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
                        <Checkbox
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                        />
                        <span>Remember Me</span>
                    </div>

                    <Button
                        variant="contained"
                        type="submit"
                        fullWidth
                        startIcon={<ExitToApp />}
                        sx={{ marginBottom: '1rem' }}
                        onClick={() => handleLogin(formik?.values?.username1, formik?.values?.password1)
                        }
                    >
                        Login
                    </Button>

                    <Divider sx={{ marginBottom: '1rem' }}>
                        <span style={{ padding: '0 0.5rem', color: 'grey' }}>OR</span>
                    </Divider>

                    <Button
                        variant="contained"
                        fullWidth
                        startIcon={<AccountCircle />}
                        sx={{ backgroundColor: 'purple' }}
                    >
                        Login with Active Directory
                    </Button>
                </div>
            </div>
        </div>

    );
};

export default LoginPage;
