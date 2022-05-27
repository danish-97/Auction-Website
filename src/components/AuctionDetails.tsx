import {
    Avatar,
    Badge,
    CssBaseline, InputAdornment,
    Paper,
    Table, TableBody, TableCell,
    TableContainer,
    TableHead,
    TableRow, TextField,
    ThemeProvider
} from "@mui/material";
import {createTheme} from "@mui/material/styles";
import HeaderNav from "../fragments/HeaderNav";
import {useParams} from "react-router-dom";
import {getAuctionBidsService, getCategoriesService, getOneAuctionService} from "../service/AuctionService";
import React, {useState} from "react";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
function AuctionDetails () {
    const {auctionId} = useParams();

    const [auctionDetails, setAuctionDetails] = useState<Auction>({
        auctionId: -1,
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
    const [bids, setBids] = useState<Array<Bid>>([])

    React.useEffect(() => {
        getAuction();
        getCategory();
        getBids();
    }, [])

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


    const theme = createTheme();

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <HeaderNav/>
            <Grid container
                  sx={{height: '10vh',
                      marginTop: '50px',
                      justifyContent: 'center',
                      paddingBottom: '10%'}}>
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
                        backgroundSize: 'cover',
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
                    </Box>
                </Grid>
            </Grid>

            <Grid container
                  sx={{height: '10vh', marginTop: '400px', marginLeft: '50px'}}>
                <Grid  item
                       xs={false}
                       sm={4}
                       md={6}>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650, backgroundColor:'lightblue'}} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Bidder Name</TableCell>
                                    <TableCell>Amount</TableCell>
                                    <TableCell>Time Stamp</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {bids.length>0?bids.map((bid) => (
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
                                            {bid.timestamp}
                                        </TableCell>
                                    </TableRow>
                                )): <Typography variant='h5' color='red'>No Bidders</Typography>}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
                {getAuctionDate(auctionDetails.endDate)!=='Auction Closed'?
                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                    <TextField
                        placeholder='Bid Amount'
                        label='Place Bid'
                        style={{marginTop: '10px'}}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <MonetizationOnIcon/>
                                </InputAdornment>
                            ),
                        }}/>
                    <Button
                        type='submit'
                        color='primary'
                        variant='contained'
                        style={{marginTop: '20px', marginLeft: '10px'}}
                        > Bid!
                </Button>
                </Grid> : ""}
            </Grid>
        </ThemeProvider>
    )
}

export default AuctionDetails;