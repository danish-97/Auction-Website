import HeaderNav from "../fragments/HeaderNav";
import {createTheme} from "@mui/material/styles";
import {ThemeProvider} from "@emotion/react";
import {
    Avatar, Badge,
    Button,
    CssBaseline, Dialog, DialogActions,
    DialogContent, DialogContentText,
    DialogTitle,
    InputAdornment,
    Paper,
    Stack,
    TextField
} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {
    getUserImageService,
    updateUserService,
    uploadUserImageService,
    userDetailsService,
    userLoggedIn
} from "../service/UserService";
import React, {useState} from "react";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import Typography from "@mui/material/Typography";
import Cookies from "js-cookie";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import EditIcon from "@mui/icons-material/Edit";

function EditProfile() {
    const navigate = useNavigate();

    React.useEffect(() => {
        if (!(userLoggedIn())) {
            navigate('/login')
            return
        }
    })

    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")

    const [errorFlag, setErrorFlag] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

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


    // Get the existing user information to populate the fields
    React.useEffect(() => {
        const setUserDetails = async () => {
            const userId = parseInt(Cookies.get('UserId') as string, 10)
            const token = Cookies.get('token')

            // Get the user details from the server side
            const view = await userDetailsService(userId, token)
            if (view.status !== 200) {
                setErrorFlag(true)
                setErrorMessage("Oops! Something went wrong, please try again")
                return
            }
            setFirstName(view.data.firstName);
            setLastName(view.data.lastName);
            setEmail(view.data.email)
            setImagePath(getUserImageService(userId))

        }

        setUserDetails()
    },[])

    // Image uploading and setting the profile image
    const imageTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif"]
    const [defaultImage, setDefaultImage] = useState(true);
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
                setDefaultImage(false)
                setImagePath(userImageSrc)
            }
        }
    }


    const updateUserDetails = async (event: any) => {
        event.preventDefault();

        const userId = parseInt(Cookies.get("UserId") as string, 10);
        const token = Cookies.get("token") as string

        // Check the validation using the check methods
        const validEmail = checkEmail(email)
        const validLastName = checkLastName(lastName)
        const validFirstName = checkFirstName(firstName)

        // If checks fail then stop
        if (!(validEmail && validLastName && validFirstName)) {
            setErrorFlag(true)
            return
        }

        const update = await updateUserService(firstName, lastName, email, userId, token);

        if (update !== 200) {
            setErrorFlag(true)
            setErrorMessage("Email already exists, please use a different one.")
            return
        }

        if (image !== undefined && image !== null) {
            const imageUpload = await uploadUserImageService(token, userId, image)
            if (imageUpload !== 200 && imageUpload !== 201) {
                setErrorFlag(true)
                setErrorMessage("Oops! Something went wrong uploading your image, please try again")
            }
        }

        navigate('/userProfile')
    }

    // Validation checks
    const checkEmail = (email: any) => {
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!(re.test(email))) {
            setErrorMessage("Please provide a valid email address (Hint: Of format abc@xyz.fgh)")
            return false;
        } else {
            return true;
        }
    }

    const checkLastName = (lastName: any) => {
        if (!(/\s/g.test(lastName))) {
            return true;
        } else {
            setErrorMessage("Please provide a valid last name (Hint: No whitespace)")
            return false;
        }
    }

    const checkFirstName = (firstName: any) => {
        if (!(/\s/g.test(firstName))) {
            return true;
        } else {
            setErrorMessage("Please provide a valid first name (Hint: No whitespaces)")
            return false;
        }
    }


    const theme = createTheme();

    //Page Styling
    const paperStyle = {
        width: 800,
        margin: '70px auto',
        padding: '20px',
        height: '70vh',
        backgroundColor: '#75D4E1'
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <HeaderNav />
            <Paper style={paperStyle} >
                <form onSubmit={updateUserDetails}>
                    <h1>Edit User Profile</h1>
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
                        <Avatar sx={{height: 150, width: 150}}
                                src={defaultImage? '<PersonOutlineOutlinedIcon/>' : imagePath} />
                    </Badge>
                    <Stack direction='column' spacing={2} style={{marginTop: "50px", marginLeft: "50px"}}>
                        <Stack direction='row' spacing={10}>
                            <Typography
                                variant="h6"
                                style={{wordWrap: "break-word", marginTop: "15px"}}
                                sx={{display: {xs: 'none', sm: 'block'}}}>
                                First Name :
                            </Typography>
                            <TextField
                                name='firstName'
                                type='text'
                                label='First Name'
                                style={{width: 500}}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PersonOutlineOutlinedIcon/>
                                        </InputAdornment>
                                    ),
                                }}
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </Stack>

                        <Stack direction='row' spacing={10}>
                            <Typography
                                variant="h6"
                                style={{wordWrap: "break-word", marginTop: "15px"}}
                                sx={{display: {xs: 'none', sm: 'block'}}}>
                                Last Name :
                            </Typography>
                            <TextField
                                type='text'
                                name='lastName'
                                label='Last Name'
                                style={{width: 500}}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PersonOutlineOutlinedIcon/>
                                        </InputAdornment>
                                    ),
                                }}
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </Stack>

                        <Stack direction='row' spacing={16}>
                            <Typography
                                variant="h6"
                                style={{wordWrap: "break-word", marginTop: "15px"}}
                                sx={{display: {xs: 'none', sm: 'block'}}}>
                                Email :
                            </Typography>
                            <TextField
                                type='email'
                                name='email'
                                label='Email'
                                style={{width: 500}}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <EmailOutlinedIcon/>
                                        </InputAdornment>
                                    ),
                                }}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Stack>
                    </Stack>
                    <Button
                            type='submit'
                            color='primary'
                            variant='contained'
                            style={{marginTop: '30px', width: 300, marginRight: '30px'}}
                    >Update
                    </Button>
                    <Button onClick={() => navigate('/userProfile')}
                            type='submit'
                            color='primary'
                            variant='contained'
                            style={{marginTop: '30px', width: 300}}
                    >Cancel
                    </Button>

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
        </ThemeProvider>
    )
}

export default EditProfile;