import {createTheme} from "@mui/material/styles";
import {ThemeProvider} from "@emotion/react";
import {CssBaseline} from "@mui/material";
import HeaderNav from "../fragments/HeaderNav";
import React, {useState} from "react";
import Cookies from "js-cookie";
import {
    getAllAuctionsService, getBidAuctionsService,
    getCategoriesService
} from "../service/AuctionService";
import Grid from "@mui/material/Grid";
import AuctionCard from "../fragments/AuctionCard";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import {useNavigate} from "react-router-dom";

function MyAuctions () {

    const navigate = useNavigate();
    const [myAuctions, setMyAuctions] = useState<Array<Auction>>([]);
    const [categories, setCategories] = useState<Array<Category>>([])
    const [bidAuctions, setBidAuctions] = useState<Array<Auction>>([]);

    React.useEffect(() => {
        getMyAuctions();
        getCategories();
        getBidAuctions();
    }, [])

    const getMyAuctions = async () => {
        const userId = parseInt(Cookies.get('UserId') as string, 10)

        const auctionList = await getAllAuctionsService();
        if (auctionList.status !== 200) {
            return
        }
        setMyAuctions(auctionList.data.auctions.filter((auction: Auction) => auction.sellerId === userId))
    }

    const getCategories = async () => {
        const categoryList = await getCategoriesService()

        if (categoryList.status !== 200) {
            return
        }
        setCategories(categoryList.data)
    }

    const getBidAuctions = async() => {
        const bidderId = parseInt(Cookies.get("UserId") as string, 10);
        const bidAuctionList = await getBidAuctionsService(bidderId);
        if (bidAuctionList.status !== 200) {
            return
        }
       setBidAuctions(bidAuctionList.data.auctions)
    }



    const theme = createTheme()

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <HeaderNav/>
            <main>
                {/* Hero unit */}
                <Box
                    sx={{
                        bgcolor: 'background.paper',
                        pt: 8,
                        pb: 6,
                    }}
                >
                    <Container maxWidth="sm">
                        <Typography
                            component="h1"
                            variant="h2"
                            align="center"
                            color="text.primary"
                            gutterBottom
                        >
                            My Auctions
                        </Typography>
                        <Button variant="outlined" color='secondary' size='large'
                                startIcon={<AddCircleOutlineIcon/>}
                                sx={{ marginTop: '20px'}}
                                onClick={() => navigate('/createAuction')}
                        >Create Auction</Button>
                    </Container>
                </Box>
                <Typography
                    component="h1"
                    variant="h4"
                    align="center"
                    color="text.primary"
                    gutterBottom
                >
                    My Listings
                </Typography>
                <Typography variant="h5" align="center" color="text.secondary" paragraph>
                    The place where the things you no longer need are placed.
                </Typography>
                <Container sx={{ py: 8 }} maxWidth="md">
                    {/* End hero unit */}
                    <Grid container spacing={4}>
                        {myAuctions.map((auction) => (
                            <AuctionCard auction={auction} categories={categories} isMyAuction={true}/>
                        ))}
                    </Grid>
                </Container>
                <Typography
                    component="h1"
                    variant="h4"
                    align="center"
                    color="text.primary"
                    gutterBottom
                >
                    My Bid Listing
                </Typography>
                <Typography variant="h5" align="center" color="text.secondary" paragraph>
                    The place where the things you will soon get are placed, as long as no one else
                    is richer than you :).
                </Typography>
                <Container sx={{ py: 8 }} maxWidth="md">
                    {/* End hero unit */}
                    <Grid container spacing={4}>
                        {bidAuctions.map((auction) => (
                            <AuctionCard auction={auction} categories={categories} isMyAuction={false}/>
                        ))}
                    </Grid>
                </Container>
            </main>
        </ThemeProvider>
    )
}

export default MyAuctions;