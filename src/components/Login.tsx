import React, {useState} from 'react';
import {
    Avatar,
    Button,
    Checkbox, CssBaseline, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    FormControlLabel,
    Grid, IconButton, InputAdornment,
    Link,
    Paper,
    TextField, ThemeProvider,
    Typography
} from "@mui/material";
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import {useNavigate} from "react-router-dom";
import {loginService, userLoggedIn} from "../service/UserService";
import HeaderNav from "../fragments/HeaderNav";
import {createTheme} from "@mui/material/styles";


function Login() {
    const navigate = useNavigate();

    React.useEffect(() => {
        if (userLoggedIn()) {
            navigate('/')
            return
        }
    })

    const initialUserInput = {
        email: "",
        password: "",
    };

    const [userInput, setUserInput] = useState(initialUserInput);
    const [errorFlag, setErrorFlag] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");


    // Handling the dialogue box
    const [openDialog, setOpenDialog] = useState(false);

    const handleDialogOpen = () => {
        setOpenDialog(true);
    };
    const handleDialogClose = () => {
        setOpenDialog(false);
        setErrorFlag(false);
    };


    React.useEffect(() => {
        if (errorFlag) {
            handleDialogOpen()
        }
    }, [errorFlag, errorMessage])


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
            setErrorFlag(true)
            return;
        }

        const login = await loginService(email, password)
        if (login === 400) {
            setErrorFlag(true)
            setErrorMessage("Invalid Email/Password")
            return
        } else if (login !== 200) {
            setErrorFlag(true)
            setErrorMessage("Oops! Something went wrong, please try again.")
            return
        }

        navigate('/')
    }

    // Toggle password visibility
    const [passwordShown, setPasswordShown] = useState(false);
    const togglePassword = () => {
        setPasswordShown(!passwordShown);
    };

    // Validation checks
    const checkEmail = (email: any) => {
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!(re.test(email))) {
            setErrorMessage("Please provide a valid email address.")
            return false;
        } else {
            return true;
        }
    }

    const checkPassword = (password: any) => {
        if (password !== '' && password.length >= 6) {
            return true;
        } else {
            setErrorMessage("Please provide a valid password (Hint: Over 6 characters)")
            return false;
        }
    }


    const paperStyle = {
        padding: 20,
        height: '70vh',
        width: 500,
        margin: "70px auto",
        backgroundColor: '#75D4E1'
    }

    const avatarStyle = {
        margin: '0 210px 0',
        backgroundColor: 'blue'
    }

    const textFieldStyle = {
        marginTop: '20px'
    }

    const buttonStyle = {
        marginTop: '20px',
        marginBottom: '20px',
    }

    const theme = createTheme();

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Grid>
                <HeaderNav />
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
                        <Button type='submit' variant='contained' style={buttonStyle} fullWidth>Login</Button>
                        <Typography>
                            <Link onClick={() => navigate('/register')} style={{cursor: 'pointer'}}>Don't have an account? Create one now</Link>
                        </Typography>

                        <Dialog
                            open={openDialog}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description">
                            <DialogTitle id="alert-dialog-title">
                                {"Error"}
                            </DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                    {errorMessage}
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button variant="outlined" color="error" onClick={handleDialogClose}
                                        autoFocus>
                                    Close
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </form>
                </Paper>
            </Grid>
        </ThemeProvider>
    )
}

export default Login;