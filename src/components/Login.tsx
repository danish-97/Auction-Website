import React from 'react';
import {
    Avatar,
    Button,
    Checkbox,
    FormControlLabel,
    Grid,
    Link,
    Paper,
    TextField,
    Typography
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Register from "./Register";

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
                <TextField label='Email' placeholder='Email' style={textFieldStyle} fullWidth required/>
                <TextField label='Password' placeholder='Password' style={textFieldStyle} fullWidth required/>
                <FormControlLabel style={{marginTop: '20px'}}
                    control={
                    <Checkbox name="box" color="primary"/>
                    }
                    label="Remember me"
                />
                <Button type='submit' color='primary' variant='contained' style={buttonStyle} fullWidth>Login</Button>
                <Typography>
                    <Link href="/register">Register</Link>
                </Typography>
            </Paper>
        </Grid>
    )
}

export default Login;