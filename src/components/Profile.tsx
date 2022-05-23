import HeaderNav from "../fragments/HeaderNav";
import {createTheme} from "@mui/material/styles";
import {ThemeProvider} from "@emotion/react";
import {Avatar, Button, CssBaseline, Paper, Stack} from "@mui/material";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import React, {useState} from "react";
import Typography from "@mui/material/Typography";
import Cookies from "js-cookie";
import {userDetailsService} from "../service/UserService";
import {useNavigate} from "react-router-dom";

function Profile () {

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [errorFlag, setErrorFlag] = useState({misc: ""})
    const navigate = useNavigate();

    React.useEffect(() => {
        const setUserDetails = async () => {
            const userId = parseInt(Cookies.get('UserId') as string, 10)
            const token = Cookies.get('token')

            // Get the user details from the server side
            const view = await userDetailsService(userId, token)
            if (view.status !== 200) {
                const error = {
                    ...errorFlag,
                    misc: 'Oops! Something went wrong. Please try again'
                }
                setErrorFlag(error)
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
        height: '70vh'
    }

    const avatarStyle = {
        margin: '0 300px 20px',
        backgroundColor: 'gray',
        width: 150,
        height: 150
    }


    const theme = createTheme();
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <HeaderNav />
            <Paper style={paperStyle}>
                <h1>User Profile</h1>
                <Avatar style={avatarStyle}>
                    <PersonOutlineOutlinedIcon style={{width: 150, height: 150}}/>
                </Avatar>
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
                    style={{marginTop: '30px'}}
                    fullWidth
                >Edit User Profile
                </Button>
            </Paper>
        </ThemeProvider>
    )
}

export default Profile;