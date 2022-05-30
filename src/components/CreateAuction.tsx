import {createTheme, ThemeProvider} from "@mui/material/styles";
import {
    Avatar,
    Badge,
    Button,
    CssBaseline, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl,
    Grid,
    InputAdornment, InputLabel,
    Paper, Select,
    TextField
} from "@mui/material";
import HeaderNav from "../fragments/HeaderNav";
import {useNavigate} from "react-router-dom";
import React, {useState} from "react";
import {userLoggedIn} from "../service/UserService";
import Cookies from "js-cookie";
import EditIcon from "@mui/icons-material/Edit";
import TitleOutlinedIcon from '@mui/icons-material/TitleOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';
import {addAuctionService, getCategoriesService, putAuctionImageService} from "../service/AuctionService";
import MenuItem from "@mui/material/MenuItem";

function CreateAuction () {

    const navigate = useNavigate();

    React.useEffect(() => {
        if (!(userLoggedIn())) {
            navigate('/login')
            return
        }
    })

    const initialUserInput = {
        title: "",
        description: "",
        reserve: 1,
        endDate: "",
    };

    const [userInput, setUserInput] = useState(initialUserInput);
    const [categories, setCategories] = useState<Array<Category>>([{categoryId: 0, name: ""}])
    const [categoryId, setCategoryId] = useState(0);
    const [errorMessage, setErrorMessage] = useState("")
    const [errorFlag, setErrorFlag] = useState(false);

    // Handling the dialogue box
    const [openDialog, setOpenDialog] = useState(false);

    const handleDialogClose = () => {
        setOpenDialog(false);
        setErrorFlag(false);
    };

    const handleDialogOpen = () => {
        setOpenDialog(true);
    };


    React.useEffect(() => {
        if (errorFlag) {
            handleDialogOpen()
        }
    }, [errorFlag, errorMessage])


    // Getting the categories
    const getCategories = async () => {
        const categoryList = await getCategoriesService();
        if (categoryList.status !== 200) {
            setErrorFlag(true)
            setErrorMessage(categoryList.statusText)
            return
        }
        setCategories(categoryList.data)
    }

    React.useEffect(() => {
        getCategories();
    }, [])


    // Save the user input values
    const saveUserInput = (event: any) => {
        const { name, value} = event.target;
        setUserInput({
            ...userInput,
            [name]: value,
        });

    };


    // Image uploading and setting the profile image
    const imageTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif"]
    const [imagePath, setImagePath] = useState("")
    const [image, setImage] = useState("");

    const uploadImage = (event: any) => {
        if (event.target.files.length === 0) {
            setImage("")
        } else {
            let auctionImage = event.target.files[0]
            setImage(auctionImage)
            if (imageTypes.includes(auctionImage.type)) {
                const auctionImageSrc = URL.createObjectURL(auctionImage);
                setImagePath(auctionImageSrc)
            }
        }
    }



    // Save the data to the database
    const handleSubmit = async (event: any) => {
        event.preventDefault();

        // Get the user input data
        const title = userInput.title;
        const description = userInput.description;
        const reserve = userInput.reserve;
        const endDate = userInput.endDate;

        const sellerId = parseInt(Cookies.get("UserId") as string, 10)
        const token = Cookies.get("token") as string


        const createAuction = await addAuctionService(token, title, description, reserve, categoryId, endDate, sellerId)
        if (createAuction.status !== 201) {
            setErrorFlag(true)
            setErrorMessage(createAuction.statusText)
            return
        }

        const auctionId = parseInt(createAuction.data.auctionId, 10)

        if (image !== undefined && image !== null) {
            const imageUpload = await putAuctionImageService(token, auctionId, image)
            if (imageUpload !== 200 && imageUpload !== 201) {
                setErrorFlag(true)
                setErrorMessage("Oops! Something went wrong uploading your image, please try again")
            }
        }

        navigate('/myAuctions')
    }


    // Page styling
    const paperStyle = {
        width: 700,
        margin: '50px auto',
        padding: '20px',
        height: 'auto',
        backgroundColor: '#75D4E1'
    }

    const textFieldStyle = {
        marginTop: '20px',
        marginRight: '20px',
        width: 500
    }

    const theme = createTheme();

    // The html form to be returned
    return (
        <ThemeProvider theme={theme} >
            <CssBaseline />
            <Grid>
                <HeaderNav />
                <Paper elevation={20} style={paperStyle}>
                    <form onSubmit={handleSubmit}>
                        <h1>Create Auction</h1>
                        <Badge

                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            badgeContent={
                                <>
                                    <label htmlFor='file-input' style={{cursor:'pointer'}}>
                                        <EditIcon color='secondary' />
                                    </label>
                                    <input hidden type="file" accept=".jpg,.jpeg,.png,.gif" id='file-input' onChange={async (e) => await uploadImage(e)}/>
                                </>
                            }>
                            <Avatar variant={"square"} sx={{height: 150, width: 150}}
                                    src={imagePath}
                            onError={(e: any) => (e.target.src="https://atasouthport.com/wp-content/uploads/2017/04/default-image.jpg")}/>
                        </Badge>

                        <TextField
                            name='title'
                            type='text'
                            label='Title'
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <TitleOutlinedIcon/>
                                    </InputAdornment>
                                ),
                            }}
                            placeholder='Title'
                            defaultValue={userInput.title}
                            style={textFieldStyle}
                            required
                            onChange={saveUserInput}
                        />

                        <TextField
                            name='description'
                            type='text'
                            label='Description'
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <DescriptionOutlinedIcon/>
                                    </InputAdornment>
                                ),
                            }}
                            placeholder='Description'
                            defaultValue={userInput.description}
                            style={textFieldStyle}
                            required
                            multiline
                            onChange={saveUserInput}
                        />
                        <FormControl style={{marginTop: '20px', marginRight: '20px', width: 500}}>
                            <InputLabel required>Category</InputLabel>
                            <Select
                                defaultValue="categories"
                                label="Category"
                            >
                                {categories.map((category) => (
                                    <MenuItem key={category.categoryId} value={category.name} onClick={() => setCategoryId(category.categoryId)}>
                                        {category.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            name='endDate'
                            type='datetime-local'
                            label='End Date'
                            defaultValue={userInput.endDate}
                            InputLabelProps={{shrink: true}}
                            style={textFieldStyle}
                            required
                            onChange={saveUserInput}
                        />
                        <TextField
                            name='reserve'
                            type="number"
                            label='Reserve (Min: 1)'
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <MonetizationOnOutlinedIcon/>
                                    </InputAdornment>
                                ), inputProps: {min: 1}
                            }}

                            placeholder='Reserve'
                            required
                            style={textFieldStyle}
                            defaultValue={userInput.reserve}
                            onChange={saveUserInput}
                        />
                        <Button
                            type='submit'
                            color='secondary'
                            variant='outlined'
                            size='large'
                            style={{marginTop: '20px', width: 200, marginBottom: '20px'}}
                        >Create!
                        </Button>
                        <Button
                            type='submit'
                            color='error'
                            variant='outlined'
                            size='large'
                            style={{marginTop: '20px', width: 200, marginLeft: '20px', marginBottom: '20px'}}
                            onClick={() => window.location.href=`http://localhost:8097/myAuctions`}
                        >Cancel
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
                    </form>
                </Paper>
            </Grid>
        </ThemeProvider>
    )
}

export default CreateAuction;