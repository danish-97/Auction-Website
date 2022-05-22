import HeaderNav from "../fragments/HeaderNav";
import {createTheme} from "@mui/material/styles";
import {ThemeProvider} from "@emotion/react";
import {Avatar, CssBaseline, ListItem, Paper, Stack} from "@mui/material";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import React, {useState} from "react";
import {FormatBold, Label} from "@mui/icons-material";
import Typography from "@mui/material/Typography";
import Cookies from "js-cookie";
import {userDetailsService} from "../service/UserService";

function Profile () {

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [errorFlag, setErrorFlag] = useState({misc: ""})

    const setUserDetails = async () => {
        const userId = parseInt(Cookies.get('UserId') as string, 10)
        const token = Cookies.get('token')

        // Get the user details from the server side
        const view = await userDetailsService(userId, token)

        if (view[0] !== 200) {
            const error = {
                ...errorFlag,
                misc: 'Oops! Something went wrong. Please try again'
            }
            setErrorFlag(error)
            return
        }

        setFirstName(view[1].firstName)
        setLastName(view[1].lastName)
        setEmail(view[1].email)

    }

    // Page styling
    const paperStyle = {
        width: 500,
        margin: '70px auto',
        padding: '20px',
        height: '70vh'
    }

    const avatarStyle = {
        margin: '0 150px 20px',
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
                <Stack direction="column" spacing={3} style={{marginTop: "50px"}}>
                    <Stack direction="row" spacing={5}>
                        <Typography
                            variant="h6"
                            noWrap
                            sx={{display: {xs: 'none', sm: 'block'}}}>
                            First Name :
                        </Typography>
                        <Typography>
                            s {firstName}
                        </Typography>
                    </Stack>
                    <Stack direction="row" spacing={5}>
                        <Typography
                            variant="h6"
                            noWrap
                            sx={{display: {xs: 'none', sm: 'block'}}}>
                            Last Name :
                        </Typography>
                    </Stack>
                    <Stack direction="row" spacing={5}>
                        <Typography
                            variant="h6"
                            noWrap
                            sx={{display: {xs: 'none', sm: 'block'}}}>
                            Email :
                        </Typography>
                    </Stack>

                </Stack>
            </Paper>
        </ThemeProvider>
    )
}

export default Profile;