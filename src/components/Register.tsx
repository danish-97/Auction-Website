import {Avatar, Button, Grid, InputAdornment, Link, Paper, TextField, Typography} from "@mui/material";
import HowToRegIcon from '@mui/icons-material/HowToReg';
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import React, {useState} from "react";
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import axios from "axios";


const Register = () => {

    const initialUserInput = {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    };

    const [userInput, setUserInput] = useState(initialUserInput);

    const handleSubmit = (event: any) => {
        const { name, value} = event.target;
        setUserInput({
            ...userInput,
            [name]: value,
        });
        alert("User Registered Successfully")
    };

    const [errorFlag, setErrorFlag] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const saveToDatabase = (event: any) => {
        axios.post('http://localhost:4941/api/v1/users/register', {
            firstName: initialUserInput.firstName,
            lastName: initialUserInput.lastName,
            email: initialUserInput.email,
            password: initialUserInput.password,
        })
            .then(response => {
                setErrorFlag(false)
                setErrorMessage("")
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage(error.toString())
            })
    }

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

    return (
        <Grid>
            <Paper elevation={20} style={paperStyle}>
                <form onSubmit={handleSubmit}>
                    <Avatar style={avatarStyle}><HowToRegIcon/></Avatar>
                    <h1>Register</h1>
                    <Grid style={{display:'flex'}}>
                        <Grid>
                            <TextField
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
                                onChange={saveToDatabase}
                                style={textFieldStyle}
                                required
                            />
                        </Grid>
                        <Grid>
                            <TextField
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
                                onChange={saveToDatabase}
                                style={textFieldStyle}
                                fullWidth
                                required
                            />
                        </Grid>
                    </Grid>
                    <TextField
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
                        onChange={saveToDatabase}
                        style={textFieldStyle}
                        fullWidth
                        required
                    />
                    <TextField
                        type='password'
                        label='Password'
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LockOpenOutlinedIcon/>
                                </InputAdornment>
                            ),
                        }}
                        placeholder='Password'
                        style={textFieldStyle}
                        defaultValue={userInput.password}
                        onChange={saveToDatabase}
                        fullWidth
                        required
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