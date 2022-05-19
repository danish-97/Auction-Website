import React from 'react';
import {
    Avatar,
    Button,
    Checkbox,
    FormControlLabel,
    Grid, InputAdornment,
    Link,
    Paper,
    TextField,
    Typography
} from "@mui/material";
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';


const Login = () => {

    const paperStyle = {
        padding: 20,
        height: '70vh',
        width: 300,
        margin: "70px auto",
        backgroundColor: 'white'
    }

    const avatarStyle = {
        margin: '0 130px 0',
        backgroundColor: 'blue'
    }

    const textFieldStyle = {
        marginTop: '20px'
    }

    const buttonStyle = {
        marginTop: '20px',
        marginBottom: '20px'
    }

    return (
        <Grid>

            <Paper elevation={20} style={paperStyle}>
                <Avatar style={avatarStyle}><LockOutlinedIcon/></Avatar>
                <h1>Login</h1>
                <TextField
                    label='Email'
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <EmailOutlinedIcon/>
                            </InputAdornment>
                        ),
                    }}
                    placeholder='Email'
                    style={textFieldStyle}
                    fullWidth
                    required
                />
                <TextField
                    label='Password'
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <LockOpenOutlinedIcon/>
                            </InputAdornment>
                        ),
                    }}
                    placeholder='Password'
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
                <Button type='submit' color='primary' variant='contained' style={buttonStyle} fullWidth>Login</Button>
                <Typography>
                    <Link href="/register">Don't have an account? Create one now</Link>
                </Typography>
            </Paper>
        </Grid>
    )
}

export default Login;