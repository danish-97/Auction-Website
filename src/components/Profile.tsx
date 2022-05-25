import HeaderNav from "../fragments/HeaderNav";
import {createTheme} from "@mui/material/styles";
import {ThemeProvider} from "@emotion/react";
import {
    Avatar,
    Badge,
    Button,
    CssBaseline, Dialog, DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Paper,
    Stack
} from "@mui/material";
import React, {useState} from "react";
import Typography from "@mui/material/Typography";
import Cookies from "js-cookie";
import {userDetailsService} from "../service/UserService";
import {getUserImageService} from "../service/UserImageService";
import {useNavigate} from "react-router-dom";

function Profile () {

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [errorFlag, setErrorFlag] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [imageURL, setImageURL] = useState("");
    const navigate = useNavigate();

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


    // Getting the user image
    React.useEffect(() => {
        const getImage = async () => {
            const userId = Cookies.get("UserId") as string

            const getUserImage = await getUserImageService(userId)
            if (getUserImage === 404) {
                setImageURL("")
            }else if (getUserImage !== 200) {
                setErrorFlag(true)
                setErrorMessage("Oops! Something is wrong with your image")
            } else {
                setImageURL(`http://localhost:4941/api/v1/users/${userId}/image`)
            }

        }
        getImage()
    }, [])

    React.useEffect(() => {
        const setUserDetails = async () => {
            const userId = parseInt(Cookies.get('UserId') as string, 10)
            const token = Cookies.get('token')

            // Get the user details from the server side
            const view = await userDetailsService(userId, token)
            if (view.status !== 200) {
                setErrorFlag(true)
                setErrorMessage("Oops! Something went wrong displaying your profile, please try again")
                return
            }

            setFirstName(view.data.firstName)
            setLastName(view.data.lastName)
            setEmail(view.data.email)

        }

        setUserDetails()
        })


    // Page styling
    const paperStyle = {
        width: 800,
        margin: '70px auto',
        padding: '20px',
        height: '70vh',
        backgroundColor: '#75D4E1'
    }


    const theme = createTheme();


    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <HeaderNav />
            <Paper style={paperStyle}>
                <h1>User Profile</h1>
                <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={
                        <>
                            <input hidden type="file" accept=".jpg,.jpeg,.png,.gif" id='file-input'/>
                        </>
                    }>
                    <Avatar sx={{width:200, height:200}} src={imageURL===""? '<PersonOutlineIcon/>': imageURL}/>
                </Badge>
                <Stack direction="column" spacing={3} style={{marginTop: "50px", marginLeft: "50px"}}>
                    <Stack direction="row" spacing={10}>
                        <Typography
                            variant="h6"
                            style={{wordWrap: "break-word"}}
                            sx={{display: {xs: 'none', sm: 'block'}}}>
                            First Name :
                        </Typography>
                        <Typography
                        variant="h6"
                        style={{wordWrap: "break-word"}}
                        sx={{display: {xs: 'none', sm: 'block'}}}>
                            {firstName}
                        </Typography>
                    </Stack>
                    <Stack direction="row" spacing={10}>
                        <Typography
                            variant="h6"
                            style={{wordWrap: "break-word"}}
                            sx={{display: {xs: 'none', sm: 'block'}}}>
                            Last Name :
                        </Typography>
                        <Typography
                            variant="h6"
                            style={{wordWrap: "break-word"}}
                            sx={{display: {xs: 'none', sm: 'block'}}}>
                            {lastName}
                        </Typography>
                    </Stack>
                    <Stack direction="row" spacing={16}>
                        <Typography
                            variant="h6"
                            style={{wordWrap: "break-word"}}
                            sx={{display: {xs: 'none', sm: 'block'}}}>
                            Email :
                        </Typography>
                        <Typography
                            variant="h6"
                            style={{wordWrap: "break-word"}}
                            sx={{display: {xs: 'none', sm: 'block'}}}>
                            {email}
                        </Typography>
                    </Stack>

                </Stack>
                <Button onClick={() => navigate('/editProfile')}
                    type='submit'
                    color='primary'
                    variant='contained'
                        style={{marginTop: '30px', width: 300, marginRight: '30px'}}
                >Edit User Profile
                </Button>
                <Button onClick={() => navigate('/changePassword')}
                        type='submit'
                        color='primary'
                        variant='contained'
                        style={{marginTop: '30px', width: 300}}
                >Change Password
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
            </Paper>
        </ThemeProvider>
    )
}

export default Profile;