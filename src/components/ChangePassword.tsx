import {
    Avatar, Button, Checkbox,
    CssBaseline, FormControlLabel,
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
import {updatePasswordService, userDetailsService, userLoggedIn} from "../service/UserService";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
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
    const [errorFlag, setErrorFlag] = useState({misc:""})

    React.useEffect(() => {
        const setUserPassword = async () => {
            const userId = parseInt(Cookies.get("UserId") as string, 10)
            const token = Cookies.get('token')

            // Get the user password from the server side
            const getUserPassword = await userDetailsService(userId, token)
            if (getUserPassword.status !== 200) {
                const error = {
                    ...errorFlag,
                    misc: 'Oops! Something went wrong. Please try again'
                }
                setErrorFlag(error)
                return
            }

            setCurrentPassword(getUserPassword.data.password)
        }

        setUserPassword()
    }, [])

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
        backgroundColor: '#BEEAAE'
    }

    const avatarStyle = {
        margin: '0 300px 20px',
        backgroundColor: 'gray',
        width: 150,
        height: 150
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <HeaderNav/>
            <Paper style={paperStyle}>
                <h1>Change Password</h1>
                <Avatar style={avatarStyle}>
                    <PersonOutlineOutlinedIcon style={{width: 150, height: 150}}/>
                </Avatar>
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
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
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
            </Paper>
        </ThemeProvider>
    )
}

export default ChangePassword;