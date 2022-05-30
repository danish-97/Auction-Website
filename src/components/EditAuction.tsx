import {createTheme, ThemeProvider} from "@mui/material/styles";
import {
    Avatar,
    Badge,
    Button,
    CssBaseline, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    FormControl,
    InputAdornment,
    InputLabel, Paper,
    Select,
    TextField
} from "@mui/material";
import HeaderNav from "../fragments/HeaderNav";
import {useNavigate, useParams} from "react-router-dom";
import {userLoggedIn} from "../service/UserService";
import React, {useState} from "react";
import Cookies from "js-cookie";
import {getCategoriesService, getOneAuctionService, updateAuctionService} from "../service/AuctionService";
import {getUserImageService} from "../service/UserImageService";
import EditIcon from "@mui/icons-material/Edit";
import TitleOutlinedIcon from "@mui/icons-material/TitleOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import MenuItem from "@mui/material/MenuItem";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";

function EditAuction () {

    const navigate = useNavigate();
    const {auctionId} = useParams();

    React.useEffect(() => {
        if (!(userLoggedIn())) {
            navigate('/login')
            return
        }
    })

    const [errorFlag, setErrorFlag] = useState(false);
    const [errorMessage, setErrorMessage] = useState("")
    const [categories, setCategories] = useState<Array<Category>>([{categoryId: 0, name: ""}])
    const [categoryId, setCategoryId] = useState(0);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [reserve, setReserve] = useState(1);
    const [sellerId, setSellerId] = useState((parseInt(Cookies.get("UserId") as string, 10)));

    React.useEffect(() => {
        if (parseInt(Cookies.get("UserId") as string, 10) !== sellerId) {
            navigate('/')
            return
        }
    }, [sellerId])

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

    // Image uploading and setting the profile image
    const imageTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif"]
    const [imagePath, setImagePath] = useState("")
    const [image, setImage] = useState(null);

    const setAuctionDetails = async () => {
        const id = parseInt(auctionId as string, 10)
        // Get the auction details from the server
        const viewAuction = await getOneAuctionService(id)
        if (viewAuction.status !== 200) {
            setErrorFlag(true)
            setErrorMessage(viewAuction.statusText)
            return
        }
        setTitle(viewAuction.data.title)
        setDescription(viewAuction.data.description)
        setCategoryId(viewAuction.data.categoryId)
        trimDate(viewAuction.data)
        setReserve(viewAuction.data.reserve)
        setImagePath(`http://localhost:4941/api/v1/auctions/${id}/image`)
        setSellerId(viewAuction.data.sellerId);
    }

    React.useEffect(() => {
        setAuctionDetails();
    }, [])

    const trimDate = (auction: Auction) => {
         setDate(auction.endDate.slice(0, 16))
    }


    const uploadImage = (event: any) => {
        if (event.target.files.length === 0) {
            setImage(null)
        } else {
            let auctionImage = event.target.files[0]
            setImage(auctionImage)
            if (imageTypes.includes(auctionImage.type)) {
                const auctionImageSrc = URL.createObjectURL(auctionImage);
                setImagePath(auctionImageSrc)
            }
        }
    }

    const updateAuctionDetails = async (event: any) => {
        event.preventDefault();

        const id = parseInt(auctionId as string, 10)
        const token = Cookies.get("token") as string
        const sellerId = parseInt(Cookies.get("UserId") as string, 10)

        const updateAuction = await updateAuctionService(token, title, description, reserve, id, categoryId, date, sellerId)
        console.log()
        if (updateAuction.status !== 200) {
            setErrorFlag(true)
            setErrorMessage(updateAuction.statusText)
            return
        }

        navigate('/myAuctions')
    }

    const theme = createTheme();

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


    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <HeaderNav/>
            <Paper elevation={20} style={paperStyle}>
                <form onSubmit={updateAuctionDetails}>
                    <h1>Edit Auction</h1>
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
                        value={title}
                        style={textFieldStyle}
                        required
                        onChange={(e) => setTitle(e.target.value)}
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
                        multiline
                        value={description}
                        style={textFieldStyle}
                        required
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <FormControl style={{marginTop: '20px', marginRight: '20px', width: 500}}>
                        <InputLabel required>Category</InputLabel>
                        <Select
                            value={categoryId}
                            label="Category"
                        >
                            {categories.map(({categoryId, name}) => (
                                <MenuItem key={categoryId} value={categoryId} onClick={() => setCategoryId(categoryId)}>
                                    {name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        name='endDate'
                        type='datetime-local'
                        label='End Date'
                        value={date}
                        InputLabelProps={{shrink: true}}
                        style={textFieldStyle}
                        required
                        onChange={(e) => setDate(e.target.value)}
                    />
                    <TextField
                        name='reserve'
                        type="number"
                        label='Reserve (Optional)'
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <MonetizationOnOutlinedIcon/>
                                </InputAdornment>
                            ), inputProps: {min: 1}
                        }}

                        placeholder='Reserve'
                        style={textFieldStyle}
                        value={reserve}
                        onChange={(e) => setReserve(parseInt(e.target.value, 10))}
                    />
                    <Button
                        type='submit'
                        color='secondary'
                        variant='outlined'
                        size='large'
                        style={{marginTop: '20px', width: 200, marginBottom: '20px'}}
                    >Save
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
        </ThemeProvider>
    )
}

export default EditAuction;