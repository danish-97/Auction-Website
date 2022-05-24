import {
    Alert, AlertTitle,
    Avatar, Badge,
    Button, CssBaseline, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    Grid,
    IconButton,
    InputAdornment,
    Link,
    Paper,
    TextField,
    ThemeProvider,
    Typography
} from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import React, {useState} from "react";
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import {loginService, registerService, uploadUserImageService, userLoggedIn} from "../service/UserService";
import {useNavigate} from "react-router-dom";
import HeaderNav from "../fragments/HeaderNav";
import {createTheme} from "@mui/material/styles";
import EditIcon from '@mui/icons-material/Edit';
import Cookies from "js-cookie";


function Register() {
    const navigate = useNavigate();

    React.useEffect(() => {
        if (userLoggedIn()) {
            navigate('/')
            return
        }
    })

    const initialUserInput = {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    };

    const [userInput, setUserInput] = useState(initialUserInput);
    const [errorFlag, setErrorFlag] = useState(false);
    const [errorMessage, setErrorMessage] = useState("")

    // Save the user input values
    const saveUserInput = (event: any) => {
        const { name, value} = event.target;
        setUserInput({
            ...userInput,
            [name]: value,
        });

    };

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


    // Image uploading and setting the profile image
    const imageTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif"]
    const [imagePath, setImagePath] = useState("")
    const [image, setImage] = useState("");

    const uploadImage = (event: any) => {
        if (event.target.files.length === 0) {
            setImage("")
        } else {
            let userImage = event.target.files[0]
            setImage(userImage)
            if (imageTypes.includes(userImage.type)) {
                const userImageSrc = URL.createObjectURL(userImage);
                setImagePath(userImageSrc)
            }
        }
    }



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
            setErrorFlag(true)
            return;
        }

        const register = await registerService(firstName, lastName, email, password)
        console.log(register)
        if (register === 403) {
            setErrorFlag(true)
            setErrorMessage("Email already exists, please use a different one.")
            return
        }

        const login = await loginService(email, password)

        if (login !== 200) {
            setErrorFlag(true)
            setErrorMessage("Oops! Something went wrong, please try again")
            return
        }

        const token = Cookies.get("token") as string
        const userId = parseInt(Cookies.get("UserId") as string, 10)

        if (image !== undefined && image !== null) {
            const imageUpload = await uploadUserImageService(token, userId, image)
            if (imageUpload !== 200 && imageUpload !== 201) {
                setErrorFlag(true)
                setErrorMessage("Oops! Something went wrong uploading your image, please try again")
            }
        }

        navigate('/')
    }

    // Toggle password visibility
    const [passwordShown, setPasswordShown] = useState(false);
    const togglePassword = () => {
        setPasswordShown(!passwordShown);
    };

    // Validation checks
    const checkFirstName = (firstName: any) => {
        if (!(/\s/g.test(firstName))) {
            return true;
        } else {
            setErrorMessage("Please provide a valid first name (Hint: No whitespaces)")
            return false;
        }
    }

    const checkLastName = (lastName: any) => {
        if (!(/\s/g.test(lastName))) {
            return true;
        } else {
            setErrorMessage("Please provide a valid last name (Hint: No whitespace")
            return false;
        }
    }

    const checkEmail = (email: any) => {
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!(re.test(email))) {
            setErrorMessage("Please provide a valid email address (Hint: Of format abc@xyz.fgh)")
            return false;
        } else {
            return true;
        }
    }

    const checkPassword = (password: any) => {
        if (password !== '' && password.length >= 6) {
            return true;
        } else {
            setErrorMessage("Please provide a valid password (Over 6 characters)")
            return false;
        }
    }



    // Page styling
    const paperStyle = {
        width: 700,
        margin: '70px auto',
        padding: '20px',
        height: '70vh',
        backgroundColor: '#75D4E1'
    }

    const textFieldStyle = {
        marginTop: '20px',
        marginRight: '20px',
        width: 500
    }

    const buttonStyle = {
        marginTop: '20px',
        marginBottom: '20px',
        width: 400
    }

    const theme = createTheme();

    // The html form to be returned
    return (
        <ThemeProvider theme={theme} >
        <CssBaseline />
            <Grid>
                <HeaderNav />
                <Paper elevation={20} style={paperStyle}>
                    <form onSubmit={handleSubmit}>
                        <h1>Register</h1>
                        <Badge
                            overlap="circular"
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            badgeContent={
                                <>
                                    <label htmlFor='file-input' style={{cursor:'pointer'}}>
                                        <EditIcon color='primary' />
                                    </label>
                                    <input hidden type="file" accept=".jpg,.jpeg,.png,.gif" id='file-input' onChange={async (e) => await uploadImage(e)}/>
                                </>
                            }>
                            <Avatar sx={{height: 150, width: 150}} alt="User" src={imagePath} />
                        </Badge>
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
                                    style={{marginTop: '20px',
                                        marginRight: '20px',
                                        marginLeft: '20px',
                                        width: 300}}
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
                                    style={{marginTop: '20px',
                                        marginRight: '20px',
                                        width: 300}}
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
                            required
                            onChange={saveUserInput}
                        />
                        <Button
                            type='submit'
                            color='primary'
                            variant='contained'
                            style={buttonStyle}
                        >Register
                        </Button>
                        <Typography>
                            <Link onClick={() => navigate('/login')} style={{cursor: 'pointer'}}>Already have an account? Sign in</Link>
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

export default Register;