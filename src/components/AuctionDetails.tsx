import {
    Avatar,
    Badge,
    CssBaseline, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, InputAdornment,
    Paper,
    Table, TableBody, TableCell,
    TableContainer,
    TableHead, TablePagination,
    TableRow, TextField,
    ThemeProvider
} from "@mui/material";
import {createTheme} from "@mui/material/styles";
import HeaderNav from "../fragments/HeaderNav";
import {useNavigate, useParams} from "react-router-dom";
import {
    addBidService, getAllAuctionsService,
    getAuctionBidsService,
    getCategoriesService,
    getOneAuctionService, getSimilarCategoriesService, getSimilarSellersService
} from "../service/AuctionService";
import React, {useState} from "react";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import Cookies from "js-cookie";
import {userLoggedIn} from "../service/UserService";

function AuctionDetails () {
    const {auctionId} = useParams();

    const navigate = useNavigate();
    const [auctionDetails, setAuctionDetails] = useState<Auction>({
        auctionId: parseInt(auctionId as string, 10),
        title: "",
        description: "",
        endDate: "",
        imageFilename: "",
        reserve: -1,
        sellerId: -1,
        categoryId: -1,
        sellerFirstName: "",
        sellerLastName: "",
        highestBid: -1,
        numBids: -1,
    });
    const [category, setCategory] = useState<Array<Category>>([]);
    const [bids, setBids] = useState<Array<Bid>>([]);
    const [similarAuctions, setSimilarAuctions] = useState<Array<Auction>>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [auctionPage, setAuctionPage] = useState(0);
    const [rowsPerAuctionPage, setRowsPerAuctionPage] = useState(5);
    const [bidAmount, setBidAmount] = useState(0);
    const [errorFlag, setErrorFlag] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");


    React.useEffect(() => {
        getAuction();
        getCategory();
        getBids();
    }, [])

    React.useEffect(() => {
        similarAuctionList();
    }, [auctionDetails.categoryId, auctionDetails.sellerId])

    // Handling the dialogue box
    const [openDialog, setOpenDialog] = useState(false);

    const handleDialogOpen = () => {
        setOpenDialog(true);
    };
    const handleDialogClose = () => {
        setOpenDialog(false);
        setErrorFlag(false);
    };


    React.useEffect(() => {
        if (errorFlag) {
            handleDialogOpen()
        }
    }, [errorFlag, errorMessage])

    const getAuction = async () => {
        const auction = await getOneAuctionService(parseInt(auctionId as string, 10))
        if (auction.status !== 200) {
            return
        }
        setAuctionDetails(auction.data)
    }

    const getCategory = async () => {
        const auctionCategories = await getCategoriesService();
        if (auctionCategories.status !== 200) {
            return
        }
        setCategory(auctionCategories.data);
    }

    const getCategoryName = () => {

        for (let i = 0; i < category.length; i++) {
            if (category[i].categoryId === auctionDetails.categoryId) {
                return category[i].name
            }
        }
    }

    const getAuctionDate = (auctionDate: string) => {
        const currentDate = new Date();
        const auctionEndDate = new Date(Date.parse(auctionDate));
        if (currentDate > auctionEndDate) {
            return 'Auction Closed'
        } else {
            return 'Auction closes on ' + auctionEndDate.getDate() + '/' + auctionEndDate.getMonth() + '/' + auctionEndDate.getFullYear() + " at "
             + auctionEndDate.getHours() + ':' + auctionEndDate.getMinutes();
        }
    }


    const getBids = async () => {
        const getAuctionBids = await getAuctionBidsService(parseInt(auctionId as string, 10))
        if (getAuctionBids.status !== 200) {
            return
        }
        setBids(getAuctionBids.data)

    }

    const addBid = async (event: any) => {
        if (!(userLoggedIn())) {
            navigate('/login')
        }
        event.preventDefault();
        const token = Cookies.get('token') as string
        const addAuctionBid = await addBidService(token, auctionDetails.auctionId, bidAmount)
        if (addAuctionBid.status !== 201) {
            setErrorFlag(true)
            setErrorMessage(addAuctionBid.statusText)
            return
        }
        window.location.reload();
    }

    const similarAuctionList = async () => {
        const categoryId = auctionDetails.categoryId;
        const sellerId = auctionDetails.sellerId;
        const similar = await getAllAuctionsService();
        if (similar.status !== 200) {
            return
        }
        setSimilarAuctions(similar.data.auctions.filter((auction: Auction) => auction.auctionId !== auctionDetails.auctionId &&
            (sellerId === auction.sellerId || categoryId === auction.categoryId)));
    }

    // Handling pagination for the bidder table
    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - bids.length) : 0;

    // Handling pagination for the similar auctions table
    const handleAuctionChangePage = (event: unknown, newPage: number) => {
        setAuctionPage(newPage);
    };

    const handleAuctionChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerAuctionPage(parseInt(event.target.value, 10));
        setAuctionPage(0);
    };

    const emptyRowsAuctions =
        auctionPage > 0 ? Math.max(0, (1 + auctionPage) * rowsPerAuctionPage - similarAuctions.length) : 0;



    const theme = createTheme();

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <HeaderNav/>
            <Box
                sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
            }}>
                <Box sx={{float: 'top', height: 'auto'}}>
                    <Grid container
                          sx={{height: 'auto',
                              marginTop: '50px',
                              justifyContent: 'center',
                          }}>
                        <Grid
                            item
                            xs={false}
                            sm={4}
                            md={6}
                            sx={{
                                backgroundImage: `url(http://localhost:4941/api/v1/auctions/${auctionId}/image)`,
                                backgroundRepeat: 'no-repeat',
                                backgroundColor: (t) =>
                                    t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                                backgroundSize: 'contain',
                                backgroundPosition: 'center',
                            }}
                        />
                        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                            <Box
                                sx={{
                                    my: 8,
                                    mx: 4,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                }}
                            >
                                <Typography variant='h2'>
                                    {auctionDetails.title}
                                </Typography>
                                <Stack direction='row' spacing={5}>
                                    <Typography variant='h5'>
                                        {getCategoryName()}
                                    </Typography>
                                    <Typography style={{color: 'blue'}}>
                                        <Badge style={{marginRight: '10px'}}>
                                            <Avatar sx={{width:40, height:40}}
                                                    src={`http://localhost:4941/api/v1/users/${auctionDetails.sellerId}/image`}
                                                    onError={() => '<PersonOutlinedIcon/>'}/>
                                        </Badge>
                                        {auctionDetails.sellerFirstName} {auctionDetails.sellerLastName}
                                    </Typography>
                                </Stack>
                                <Typography style={{marginTop: '20px'}}>
                                    {auctionDetails.description}
                                </Typography>
                                <Stack direction='row' spacing={5} style={{marginTop: '20px'}}>
                                    <Typography>
                                        <strong>Current Highest Bid: </strong>
                                        {auctionDetails.highestBid === null? 'No bids placed yet':'$'+auctionDetails.highestBid}
                                    </Typography>
                                    <Typography>
                                        <strong>Reserve: </strong>
                                        {auctionDetails.reserve <= auctionDetails.highestBid? 'Reserve Met!':'$'+auctionDetails.reserve}
                                    </Typography>
                                </Stack>
                                <Typography variant='h6' style={{marginTop: '20px', color: 'red'}}>
                                    {getAuctionDate(auctionDetails.endDate)!=="Auction Closed"? getAuctionDate(auctionDetails.endDate)
                                        : getAuctionDate(auctionDetails.endDate)}
                                </Typography>
                                {getAuctionDate(auctionDetails.endDate)!=='Auction Closed'?
                                    <Box component={"form"} onSubmit={addBid} style={{marginTop: '30px'}}>
                                        <TextField
                                            placeholder='Bid Amount'
                                            label='Place Bid'
                                            type='number'
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <MonetizationOnIcon/>
                                                    </InputAdornment>
                                                ),
                                                inputProps: {min: 0}
                                            }}
                                            onChange={(e) => setBidAmount(parseInt(e.target.value as string, 10))}
                                        /><Button
                                            type='submit'
                                            color='primary'
                                            variant='contained'
                                            style={{marginTop: '10px', marginLeft: '10px'}}
                                        > Bid!
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
                                    </Box>
                                        : ""}

                            </Box>
                        </Grid>
                    </Grid>
                </Box>
                <Box sx={{height: 'auto', marginLeft: '30px'}}>
                    <Grid container
                          sx={{height: 'auto', marginTop: '50px'}}>
                        <Grid  item
                               xs={12}
                               sm={4}
                               md={6}
                               sx={{marginLeft: '50px'}}>
                            <Paper sx={{width: '100%', mb: 2, backgroundColor:'lightblue'}}>
                                <Typography variant='h5'>Bid History</Typography>
                                <TableContainer>
                                    <Table sx={{ minWidth: 650}} aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Bidder Name</TableCell>
                                                <TableCell>Amount</TableCell>
                                                <TableCell>Time Stamp</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {bids.length>0?bids
                                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                .map((bid) => (
                                                    <TableRow
                                                        key={bid.timestamp}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                    >
                                                        <TableCell>
                                                            <Badge style={{marginRight: '10px'}}>
                                                                <Avatar sx={{width:40, height:40}}
                                                                        src={`http://localhost:4941/api/v1/users/${bid.bidderId}/image`}
                                                                        onError={() => '<PersonOutlinedIcon/>'}/>
                                                            </Badge>
                                                            {bid.firstName} {bid.lastName}
                                                        </TableCell>
                                                        <TableCell>{bid.amount}</TableCell>
                                                        <TableCell>
                                                            {bid.timestamp.replace('T', " ").slice(0, 16)}
                                                        </TableCell>
                                                    </TableRow>
                                                )): <Typography variant='h5' color='red'>No Bidders</Typography>}
                                            {emptyRows > 0 && (
                                                <TableRow
                                                    style={{
                                                        height: (73) * emptyRows,
                                                    }}
                                                >
                                                    <TableCell colSpan={6} />
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25]}
                                    component="div"
                                    count={bids.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                            </Paper>
                        </Grid>
                        <Grid  item
                               xs={false}
                               sm={4}
                               md={5}
                               sx={{marginLeft: '10px'}}>
                            <Paper sx={{width: '100%', mb: 2, backgroundColor:'gray'}}>
                                <Typography variant='h5'>Similar Auctions</Typography>
                                <TableContainer>
                                    <Table sx={{ minWidth: 400}} aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Auction</TableCell>
                                                <TableCell>View</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {similarAuctions.length>0?similarAuctions
                                                .slice(auctionPage * rowsPerAuctionPage, auctionPage * rowsPerAuctionPage + rowsPerAuctionPage)
                                                .map((similarAuction) => (
                                                    <TableRow
                                                        key={similarAuction.auctionId}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                    >
                                                        <TableCell>{similarAuction.title}</TableCell>
                                                        <TableCell>
                                                            <Button
                                                                type='button'
                                                                variant='contained'
                                                                onClick={() =>
                                                                    window.location.href=`http://localhost:8097/auctionDetails/${similarAuction.auctionId}`}
                                                                style={{marginTop: '10px', marginLeft: '10px', backgroundColor: 'black'}}>
                                                                View
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                )): <Typography variant='h5' color='white'>No Similar Auction</Typography>}
                                            {emptyRowsAuctions > 0 && (
                                                <TableRow
                                                    style={{
                                                        height: (73) * emptyRowsAuctions,
                                                    }}
                                                >
                                                    <TableCell colSpan={6} />
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25]}
                                    component="div"
                                    count={similarAuctions.length}
                                    rowsPerPage={rowsPerAuctionPage}
                                    page={auctionPage}
                                    onPageChange={handleAuctionChangePage}
                                    onRowsPerPageChange={handleAuctionChangeRowsPerPage}
                                />
                            </Paper>

                        </Grid>
                    </Grid>
                </Box>
            </Box>

        </ThemeProvider>
    )
}

export default AuctionDetails;