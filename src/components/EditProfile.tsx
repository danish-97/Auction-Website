import HeaderNav from "../fragments/HeaderNav";
import {createTheme} from "@mui/material/styles";
import {ThemeProvider} from "@emotion/react";
import {CssBaseline, Paper} from "@mui/material";

function EditProfile() {

    const theme = createTheme();

    //Page Styling
    const paperStyle = {
        width: 800,
        margin: '70px auto',
        padding: '20px',
        height: '70vh'
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <HeaderNav />
            <Paper style={paperStyle} >
                <h1>Edit User Profile</h1>
            </Paper>
        </ThemeProvider>
    )
}

export default EditProfile;