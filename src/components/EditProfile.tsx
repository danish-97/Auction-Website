import HeaderNav from "../fragments/HeaderNav";
import {createTheme} from "@mui/material/styles";
import {ThemeProvider} from "@emotion/react";
import {Avatar, Button, CssBaseline, InputAdornment, Paper, Stack, TextField} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {updateUserService, userDetailsService, userLoggedIn} from "../service/UserService";
import React, {useState} from "react";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import Typography from "@mui/material/Typography";
import Cookies from "js-cookie";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";

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

    const [errorFlag, setErrorFlag] = useState({misc: ""})

    // Get the existing user information to populate the fields
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
            setFirstName(view.data.firstName);
            setLastName(view.data.lastName);
            setEmail(view.data.email)

        }

        setUserDetails()
    },[])


    const updateUserDetails = async (event: any) => {
        event.preventDefault();


        const userId = parseInt(Cookies.get("UserId") as string, 10);
        const token = Cookies.get("token") as string

        const update = await updateUserService(firstName, lastName, email, userId, token);

        if (update !== 400) {
            const error = {
                ...errorFlag,
                misc: "Wrong."
            }
            setErrorFlag(error)
        }

        navigate('/userProfile')
    }

    const theme = createTheme();

    //Page Styling
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
            <CssBaseline />
            <HeaderNav />
            <Paper style={paperStyle} >
                <form onSubmit={updateUserDetails}>
                    <h1>Edit User Profile</h1>
                    <Avatar style={avatarStyle}>
                        <PersonOutlineOutlinedIcon style={{width: 150, height: 150}}/>
                    </Avatar>
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
                </form>
            </Paper>
        </ThemeProvider>
    )
}

export default EditProfile;