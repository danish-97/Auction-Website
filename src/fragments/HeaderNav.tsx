import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import MoreIcon from '@mui/icons-material/MoreVert';
import {useNavigate} from "react-router-dom";
import {logoutService, userLoggedIn} from "../service/UserService";
import {getUserImageService} from "../service/UserImageService";
import Cookies from "js-cookie";
import {useState} from "react";
import {Avatar} from "@mui/material";
import Button from "@mui/material/Button";


function HeaderNav() {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
        React.useState<null | HTMLElement>(null);

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
    const navigate = useNavigate();
    const [errorFlag, setErrorFlag] = useState({misc: ''});
    const [imageURL, setImageURL] = useState("");

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    // Performs the logout function
    const handleMenuClick = async (event: any) => {
        event.preventDefault();
        const logout = await logoutService(Cookies.get('token'))
        if (logout !== 200) {
            const error = {
                ...errorFlag,
                misc: 'Oops! Something went wrong. Please try again'
            }
            setErrorFlag(error)
            return
        }

        navigate('/')
    }


    // Getting the user image
    React.useEffect(() => {
        const getImage = async () => {
            const userId = Cookies.get("UserId") as string

            const getUserImage = await getUserImageService(userId)
            if (getUserImage === 404) {
                setImageURL("")
            }else if (getUserImage !== 200) {
                const error = {
                    ...errorFlag,
                    misc: 'Oops! Something went wrong. Please try again'
                }
                setErrorFlag(error)
            } else {
                setImageURL(`http://localhost:4941/api/v1/users/${userId}/image`)
            }
        }
        getImage()
    }, [])

    // Changes the nav drop-down items depending on the log in state.
    let menuItems;
    if (userLoggedIn()) {
        menuItems = [<MenuItem key='1' onClick={() => navigate('/userProfile')}>User Profile</MenuItem>,
            <MenuItem key='2' onClick={handleMenuClick}>Logout</MenuItem>];
    } else {
        menuItems = [<MenuItem key='1' onClick={() => navigate('/login')}>Login</MenuItem>,
            <MenuItem key='2' onClick={() => navigate('/register')}>Register</MenuItem>,];
    }

    const menuId = 'primary-search-account-menu';
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            {menuItems}
        </Menu>
    );

    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            <MenuItem onClick={handleProfileMenuOpen}>
                <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                    color="inherit"
                >
                    <Avatar sx={{width:40, height:40}} src={imageURL===""? '<PersonOutlineIcon/>': imageURL}/>
                </IconButton>
                <p>Account</p>
            </MenuItem>
        </Menu>
    );


    return (
        <Box sx={{flexGrow: 1}}>
            <AppBar position="static">
                <Toolbar>
                    <AccountBalanceIcon sx={{mr: 2, width: 30, height: 30, ml: 3}}/>
                    <Typography
                        variant="h6"
                        noWrap
                        fontFamily="MS UI Gothic"
                        component="div"
                        sx={{display: {xs: 'none', sm: 'block'}}}
                    >
                        Auction 101
                    </Typography>
                    <Button
                        type='button'
                        variant='contained'
                        onClick={() => (navigate('/'))}
                        style={{marginLeft: '30px', backgroundColor: 'black'}}>
                        Auctions
                    </Button>
                    {userLoggedIn()?
                    <Button
                        type='button'
                        variant='contained'
                        onClick={() => (navigate('/myAuctions'))}
                        style={{marginLeft: '10px', backgroundColor: 'black'}}>
                        My Auctions
                    </Button> : ""}
                    <Box sx={{flexGrow: 1}}/>
                    <Box sx={{display: {xs: 'none', md: 'flex'}}}>
                        <IconButton
                            size="large"
                            edge="end"
                            aria-label="account of current user"
                            aria-controls={menuId}
                            aria-haspopup="true"
                            onClick={handleProfileMenuOpen}
                            color="inherit"
                        >
                            <Avatar sx={{width:40, height:40}} src={imageURL===""? '<PersonOutlineIcon/>': imageURL}/>
                        </IconButton>
                    </Box>
                    <Box sx={{display: {xs: 'flex', md: 'none'}}}>
                        <IconButton
                            size="large"
                            aria-label="show more"
                            aria-controls={mobileMenuId}
                            aria-haspopup="true"
                            onClick={handleMobileMenuOpen}
                            color="inherit"
                        >
                            <MoreIcon/>
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            {renderMobileMenu}
            {renderMenu}
        </Box>
    );
}

export default HeaderNav;