import {
    Alert,
    AlertTitle,
    Avatar, Badge, Button, Checkbox,
    CssBaseline, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, Grid,
    IconButton,
    InputAdornment,
    Paper,
    Stack,
    TextField,
    ThemeProvider,
    Typography
} from "@mui/material";
import {createTheme} from "@mui/material/styles";
import HeaderNav from "../fragments/HeaderNav";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {getUserImageService, updatePasswordService, userDetailsService, userLoggedIn} from "../service/UserService";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import Cookies from "js-cookie";

function ChangePassword() {
    const navigate = useNavigate();

    React.useEffect(() => {
        if (!(userLoggedIn())) {
            navigate('/login')
            return
        }
    })

    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("");
    const [errorFlag, setErrorFlag] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    // Handling the password successfully changed dialogue box
    const [openDialog, setOpenDialog] = useState(false);

    const handleDialogOpen = () => {
        setOpenDialog(true);
    };

    const changePassword = async (event: any) => {
        event.preventDefault();

        const userId = parseInt(Cookies.get('UserId') as string, 10);
        const token = Cookies.get('token') as string

        const passwordChange = await updatePasswordService(currentPassword, newPassword, userId, token);
        if (passwordChange !== 200) {
            setErrorFlag(true)
            setErrorMessage("Invalid current password")
            handleDialogOpen();
            return
        }

        setErrorFlag(false);
        handleDialogOpen();

    }

    // Toggle password visibility
    const [passwordShown, setPasswordShown] = useState(false);
    const togglePassword = () => {
        setPasswordShown(!passwordShown);
    };

    const theme = createTheme();

    // Page styling
    const paperStyle = {
        width: 800,
        margin: '70px auto',
        padding: '20px',
        height: '70vh',
        backgroundColor: '#75D4E1'
    }


    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <HeaderNav/>
            <Paper style={paperStyle}>
                <form onSubmit={changePassword}>
                    <h1>Change Password</h1>
                    <Badge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        badgeContent={
                            <>
                                <input hidden type="file" accept=".jpg,.jpeg,.png,.gif" id='file-input'/>
                            </>
                        }>
                        <Avatar sx={{width:150, height:150}} alt='User' src={getUserImageService(Cookies.get('UserId'))}/>
                    </Badge>
                    <Stack direction='column' spacing={3} style={{marginTop: "50px", marginLeft: "50px"}}>
                        <Stack direction='row' spacing={10}>
                            <Typography
                                variant="h6"
                                style={{wordWrap: "break-word", marginTop: "15px"}}
                                sx={{display: {xs: 'none', sm: 'block'}}}>
                                Current Password :
                            </Typography>
                            <TextField
                                name='password'
                                type={passwordShown ? "text" : "password"}
                                label='Current Password'
                                style={{width: 400}}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LockOpenOutlinedIcon/>
                                        </InputAdornment>
                                    )
                                }}
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                            />
                        </Stack>

                        <Stack direction='row' spacing={13}>
                            <Typography
                                variant="h6"
                                style={{wordWrap: "break-word", marginTop: "15px"}}
                                sx={{display: {xs: 'none', sm: 'block'}}}>
                                New Password :
                            </Typography>
                            <TextField
                                name='password'
                                type={passwordShown ? "text" : "password"}
                                label='New Password'
                                style={{width: 405}}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LockOpenOutlinedIcon/>
                                        </InputAdornment>
                                    )
                                }}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </Stack>
                        <FormControlLabel style={{marginTop: '20px'}}
                              control={
                                  <Checkbox name="box" color="primary"
                                            onClick={togglePassword}
                                            onMouseDown={(event) => event.preventDefault()}/>
                              }
                              label="Show Password"
                        />
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

                    <Grid>
                        {errorFlag?
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
                                <Button variant="outlined" color="error" onClick={() => setOpenDialog(false)} autoFocus>
                                    Close
                                </Button>
                            </DialogActions>
                        </Dialog>
                            :
                        <Dialog
                            open={openDialog}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description">
                            <DialogTitle id="alert-dialog-title">
                                {"Success"}
                            </DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                    Password Changed Successfully!
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button variant="outlined" color="success" onClick={() => (navigate('/userProfile'))} autoFocus>
                                    Ok
                                </Button>
                            </DialogActions>
                        </Dialog>
                        }
                    </Grid>

                </form>
            </Paper>
        </ThemeProvider>
    )
}

export default ChangePassword;