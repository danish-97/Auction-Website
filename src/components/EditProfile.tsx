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
    updateUserService,
    userDetailsService,
    userLoggedIn
} from "../service/UserService";
import React, {useState} from "react";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Typography from "@mui/material/Typography";
import Cookies from "js-cookie";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import {deleteUserImageService, getUserImageService, uploadUserImageService} from "../service/UserImageService";

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

    // Image uploading and setting the profile image
    const imageTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif"]
    const [imagePath, setImagePath] = useState("")
    const [image, setImage] = useState(null);
    const [defaultImage, setDefaultImage] = useState(true);


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
            setImagePath(imagePath)

        }

        setUserDetails()
    },[])

    // Image Uploading and deleting

    // Getting the user image
    React.useEffect(() => {
        const getImage = async () => {
            const userId = Cookies.get("UserId") as string

            const getUserImage = await getUserImageService(userId)
            if (getUserImage === 404) {
                setImagePath("")
            }else if (getUserImage !== 200) {
                setErrorFlag(true)
                setErrorMessage("Oops! Something is wrong with your image")
            }
            setImagePath(`http://localhost:4941/api/v1/users/${userId}/image`)
        }
        getImage()
    }, [])

    React.useEffect(() => {
        if (imagePath !== "") {
            setDefaultImage(false)
        }
    }, [defaultImage, imagePath])


    const uploadImage = (event: any) => {
        if (event.target.files.length === 0) {
            setImage(null)
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
                alert("Hi")
                setErrorFlag(true)
                setErrorMessage("Oops! Something went wrong uploading your image, please try again")
                return
            }
        }

        navigate('/userProfile')
    }

    const replaceOnError = (event: any) => {
        event.target.src = '<PersonOutlinedIcon/>'
    }

    // Method to delete the user profile image
    const deleteProfileImage = async () => {
        setImage(null)
        setImagePath("")

        const userId = parseInt(Cookies.get("UserId") as string, 10);
        const token = Cookies.get("token") as string

        const deleteImage = await deleteUserImageService(userId, token)
        if (deleteImage === 404) {
            setErrorFlag(true)
            setErrorMessage("Image does not exist")
            return
        } else if (deleteImage !== 200 && deleteImage !== 201) {
            alert(deleteImage)
            setErrorFlag(true)
            setErrorMessage("Oops! Something went wrong deleting the image, please try again.")
            return
        }
        setDefaultImage(true)
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
                            <DeleteForeverIcon onClick={deleteProfileImage} color='primary' />
                        }>
                        <label htmlFor='file-input' style={{cursor:'pointer'}}>
                            <Avatar sx={{height: 150, width: 150}}
                                    src={defaultImage? '<PersonOutlineOutlinedIcon/>' : imagePath}
                                    onError={replaceOnError}/>
                        </label>
                        <input hidden type="file" accept=".jpg,.jpeg,.png,.gif" id='file-input' onChange={async (e) => uploadImage(e)}/>
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