import {Avatar, Button, Grid, IconButton, InputAdornment, Link, Paper, TextField, Typography} from "@mui/material";
import HowToRegIcon from '@mui/icons-material/HowToReg';
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import React, {useState} from "react";
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import axios from "axios";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';


function Register() {

    const initialUserInput = {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    };

    const [userInput, setUserInput] = useState(initialUserInput);
    const [errorFlag, setErrorFlag] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");


    // Save the user input values
    const saveUserInput = (event: any) => {
        const { name, value} = event.target;
        setUserInput({
            ...userInput,
            [name]: value,
        });

    };

    // Save the data to the database
    const handleSubmit = (event: any) => {
        axios.post('http://localhost:4941/api/v1/users/register', {
            firstName: userInput.firstName,
            lastName: userInput.lastName,
            email: userInput.email,
            password: userInput.password,
        })
            .then(response => {
                alert("User Registered Successfully")
                console.log(response.data)
                setErrorFlag(false)
                setErrorMessage("")
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage(error.toString())
                console.log(error.toString())
                alert("No shit")

            })
    }

    // Toggle password visibility
    const [passwordShown, setPasswordShown] = useState(false);
    const togglePassword = () => {
        setPasswordShown(!passwordShown);
    };

    // Validation checks
    const checkFirstName = {}


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
                                    <IconButton onClick={togglePassword}>
                                        {userInput.password ? <VisibilityIcon /> : <VisibilityOffIcon />}
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
                        <Link href='/login'>Already have an account? Sign in</Link>
                    </Typography>
                </form>
            </Paper>

        </Grid>
    )
}

export default Register;