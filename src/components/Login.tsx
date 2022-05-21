import React, {useState} from 'react';
import {
    Avatar,
    Button,
    Checkbox,
    FormControlLabel,
    Grid, IconButton, InputAdornment,
    Link,
    Paper,
    TextField,
    Typography
} from "@mui/material";
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import {useNavigate} from "react-router-dom";
import {loginService} from "../service/UserService";


function Login() {

    const initialUserInput = {
        email: "",
        password: "",
    };

    const [userInput, setUserInput] = useState(initialUserInput);
    const [errorFlag, setErrorFlag] = useState({
        email: '',
        password: '',
        misc: ''
    });
    const navigate = useNavigate();

    // Save the user input values
    const saveUserInput = (event: any) => {
        const { name, value} = event.target;
        setUserInput({
            ...userInput,
            [name]: value,
        });

    };

    const handleSubmit = async (event: any) => {
        event.preventDefault();

        // Get the user input data
        const email = userInput.email;
        const password = userInput.password;

        // Validate the given data using the checks functions
        const validEmail = checkEmail(email)
        const validPassword = checkPassword(password)

        // Stop if validation checks fail
        if (!(validEmail && validPassword)) {
            return;
        }

        const login = await loginService(email, password)
        if (login === 400) {
            const error = {
                ...errorFlag,
                misc: 'Invalid email/password'
            }
            setErrorFlag(error)
            return
        } else if (login !== 200) {
            const error = {
                ...errorFlag,
                misc: 'Oops! Something went wrong. Please try again'
            }
            setErrorFlag(error)
            return
        }

        navigate('/auctions')
    }

    // Toggle password visibility
    const [passwordShown, setPasswordShown] = useState(false);
    const togglePassword = () => {
        setPasswordShown(!passwordShown);
    };

    // Validation checks
    const checkEmail = (email: any) => {
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (email === '' || re.test(email)) {
            const newEmail = {
                ...errorFlag,
                email: ''
            }
            setErrorFlag(newEmail)
            return true;
        } else {
            const newEmail = {
                ...errorFlag,
                email: 'Please provide a valid email address'
            }
            setErrorFlag(newEmail)
            return false;
        }
    }

    const checkPassword = (password: any) => {
        if (password === '' || password.length >= 6) {
            const newPassword = {
                ...errorFlag,
                password: ''
            }
            setErrorFlag(newPassword)
            return true;
        } else {
            const newPassword = {
                ...errorFlag,
                password: 'Please provide a valid password (Hint: Over 6 characters)'
            }
            setErrorFlag(newPassword)
            return false;
        }
    }


    const paperStyle = {
        padding: 20,
        height: '70vh',
        width: 300,
        margin: "70px auto",
        backgroundColor: 'white'
    }

    const avatarStyle = {
        margin: '0 130px 0',
        backgroundColor: 'blue'
    }

    const textFieldStyle = {
        marginTop: '20px'
    }

    const buttonStyle = {
        marginTop: '20px',
        marginBottom: '20px'
    }

    return (
        <Grid>

            <Paper elevation={20} style={paperStyle}>
                <form onSubmit={handleSubmit}>
                    <Avatar style={avatarStyle}><LockOutlinedIcon/></Avatar>
                    <h1>Login</h1>
                    <TextField
                        name='email'
                        type='email'
                        label='Email'
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <EmailOutlinedIcon/>
                                </InputAdornment>
                            ),
                        }}
                        placeholder='Email'
                        defaultValue={userInput.email}
                        onChange={saveUserInput}
                        style={textFieldStyle}
                        fullWidth
                        required
                    />
                    <TextField
                        name='password'
                        type={passwordShown ? "text" : "password"}
                        label='Password'
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LockOpenOutlinedIcon/>
                                </InputAdornment>
                            ), endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={togglePassword} onMouseDown={(event) => event.preventDefault()}>
                                        {passwordShown ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                        placeholder='Password'
                        defaultValue={userInput.password}
                        onChange={saveUserInput}
                        style={textFieldStyle}
                        fullWidth
                        required
                    />
                    <FormControlLabel style={{marginTop: '20px'}}
                        control={
                        <Checkbox name="box" color="primary"/>
                        }
                        label="Remember me"
                    />
                    <Button type='submit' color='primary' variant='contained' style={buttonStyle} fullWidth>Login</Button>
                    <Typography>
                        <Link onClick={() => navigate('/register')} style={{cursor: 'pointer'}}>Don't have an account? Create one now</Link>
                    </Typography>
                </form>
            </Paper>
        </Grid>
    )
}

export default Login;