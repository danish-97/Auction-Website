import {createTheme} from "@mui/material/styles";
import {ThemeProvider} from "@emotion/react";
import {CssBaseline} from "@mui/material";
import HeaderNav from "../fragments/HeaderNav";
import React, {useState} from "react";
import Cookies from "js-cookie";
import {
    getAllAuctionsService,
    getAuctionBidsService, getBidAuctionsService,
    getCategoriesService,
    getSimilarCategoriesService
} from "../service/AuctionService";
import Grid from "@mui/material/Grid";
import AuctionCard from "../fragments/AuctionCard";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

function MyAuctions () {

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
                        <Typography variant="h5" align="center" color="text.secondary" paragraph>
                            The place where the things you no longer need are placed.
                        </Typography>
                        <Stack
                            sx={{ pt: 4 }}
                            direction="row"
                            spacing={2}
                            justifyContent="center"
                        >
                            <Button variant="contained">Create Auction</Button>
                            <Button variant="outlined">Secondary action</Button>
                        </Stack>
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
                <Container sx={{ py: 8 }} maxWidth="md">
                    {/* End hero unit */}
                    <Grid container spacing={4}>
                        {myAuctions.map((auction) => (
                            <AuctionCard auction={auction} categories={categories} myAuction={true}/>
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
                    Auctions I Placed Bids On
                </Typography>
                <Container sx={{ py: 8 }} maxWidth="md">
                    {/* End hero unit */}
                    <Grid container spacing={4}>
                        {bidAuctions.map((auction) => (
                            <AuctionCard auction={auction} categories={categories} myAuction={true}/>
                        ))}
                    </Grid>
                </Container>
            </main>
        </ThemeProvider>
    )
}

export default MyAuctions;