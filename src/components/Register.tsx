import {Avatar, Button, Grid, IconButton, InputAdornment, Link, Paper, TextField, Typography} from "@mui/material";
import HowToRegIcon from '@mui/icons-material/HowToReg';
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import React, {useState} from "react";
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import {loginService, registerService} from "../service/UserService";
import {useNavigate} from "react-router-dom";


function Register() {

    const initialUserInput = {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    };

    const [userInput, setUserInput] = useState(initialUserInput);
    const [errorFlag, setErrorFlag] = useState({
        firstName: '',
        lastName: '',
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

    // Save the data to the database
    const handleSubmit = async (event: any) => {
        event.preventDefault();
        // Get the user input data
        const firstName = userInput.firstName;
        const lastName = userInput.lastName;
        const email = userInput.email;
        const password = userInput.password;

        // Validate the given data using the check functions
        const validFirstName= checkFirstName(firstName)
        const validLastName = checkLastName(lastName)
        const validEmail = checkEmail(email)
        const validPassword = checkPassword(password)

        // Stop if validation checks fail
        if (!(validFirstName && validLastName && validEmail && validPassword)) {
            alert('This')
            return;
        }

        const register = await registerService(firstName, lastName, email, password)
        console.log(register)
        if (register === 403) {
            const error = {
                ...errorFlag,
                email: 'Email is already in use, please use a different one.'
            }
            setErrorFlag(error)
            return
        }

        const login = await loginService(email, password)

        if (login !== 200) {
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
    const checkFirstName = (firstName: any) => {
        if (firstName !== '') {
            const name = {
                ...errorFlag,
                firstName: ''
            }
            setErrorFlag(name)
            return true;
        } else {
            const name = {
                ...errorFlag,
                firstName: 'Please provide a first name'
            }
            setErrorFlag(name)
            return false;
        }
    }

    const checkLastName = (lastName: any) => {
        if (lastName !== '') {
            const name = {
                ...errorFlag,
                lastName: ''
            }
            setErrorFlag(name)
            return true;
        } else {
            const name = {
                ...errorFlag,
                lastName: 'Please provide a last name'
            }
            setErrorFlag(name)
            return false;
        }
    }

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



    // Page styling
    const paperStyle = {
        width: 500,
        margin: '70px auto',
        padding: '20px',
        height: '70vh'
    }

    const avatarStyle = {
        margin: '0 225px 0',
        backgroundColor: 'blue'
    }

    const textFieldStyle = {
        marginTop: '20px',
        marginRight: '20px'
    }

    const buttonStyle = {
        marginTop: '20px',
        marginBottom: '20px'
    }

    // The html form to be returned
    return (
        <Grid>
            <Paper elevation={20} style={paperStyle}>
                <form onSubmit={handleSubmit}>
                    <Avatar style={avatarStyle}><HowToRegIcon/></Avatar>
                    <h1>Register</h1>
                    <Grid style={{display:'flex'}}>
                        <Grid>
                            <TextField
                                name='firstName'
                                type='text'
                                label='First Name'
                                InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PersonOutlineOutlinedIcon/>
                                    </InputAdornment>
                                ),
                            }}
                                placeholder='First Name'
                                defaultValue={userInput.firstName}
                                style={textFieldStyle}
                                required
                                onChange={saveUserInput}
                            />
                        </Grid>
                        <Grid>
                            <TextField
                                name='lastName'
                                type='text'
                                label='Last Name'
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PersonOutlineOutlinedIcon/>
                                        </InputAdornment>
                                    ),
                                }}
                                placeholder='Last Name'
                                defaultValue={userInput.lastName}
                                style={textFieldStyle}
                                fullWidth
                                required
                                onChange={saveUserInput}
                            />
                        </Grid>
                    </Grid>
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
                        style={textFieldStyle}
                        fullWidth
                        required
                        onChange={saveUserInput}
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
                        style={textFieldStyle}
                        defaultValue={userInput.password}
                        fullWidth
                        required
                        onChange={saveUserInput}
                    />
                    <Button
                        type='submit'
                        color='primary'
                        variant='contained'
                        style={buttonStyle}
                        fullWidth
                    >Register
                    </Button>
                    <Typography>
                        <Link onClick={() => navigate('/login')} style={{cursor: 'pointer'}}>Already have an account? Sign in</Link>
                    </Typography>
                </form>
            </Paper>

        </Grid>
    )
}

export default Register;