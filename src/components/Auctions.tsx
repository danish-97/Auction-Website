import * as React from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import HeaderNav from "../fragments/HeaderNav";
import AuctionCard from "../fragments/AuctionCard";
import {getAllAuctionsService, getCategoriesService} from "../service/AuctionService";
import {useState} from "react";

const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const theme = createTheme();


function Auctions() {

    const [auctions, setAuctions] = useState<Array<Auction>>([])
    const [category, setCategory] = useState<Array<Category>>([]);

    React.useEffect( () => {
        getAllAuctions();
        getCategories();
    }, [])

    const getAllAuctions = async () => {
        const getAuctions = await getAllAuctionsService();
        if (getAuctions.status !== 200) {
            return
        }
        setAuctions(getAuctions.data.auctions)
    }

    const getCategories = async () => {
        const categories = await getCategoriesService()

        if (categories.status !== 200) {
            return
        }
        setCategory(categories.data)
    }


    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <HeaderNav />
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
                            Auction House
                        </Typography>
                        <Typography variant="h5" align="center" color="text.secondary" paragraph>
                            The place where all dreams come true. As long as you
                            have the money for it. :)
                        </Typography>
                        <Stack
                            sx={{ pt: 4 }}
                            direction="row"
                            spacing={2}
                            justifyContent="center"
                        >
                            <Button variant="contained">Main call to action</Button>
                            <Button variant="outlined">Secondary action</Button>
                        </Stack>
                    </Container>
                </Box>
                <Container sx={{ py: 8 }} maxWidth="md">
                    {/* End hero unit */}
                    <Grid container spacing={4}>
                        {auctions.map((auction) => (
                            <AuctionCard auction={auction} categories={category}/>
                        ))}
                    </Grid>
                </Container>
            </main>
            {/* Footer */}
            <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
                <Typography variant="h6" align="center" gutterBottom>
                    Footer
                </Typography>
                <Typography
                    variant="subtitle1"
                    align="center"
                    color="text.secondary"
                    component="p"
                >
                    Something here to give the footer a purpose!
                </Typography>
            </Box>
            {/* End footer */}
        </ThemeProvider>
    );
}

export default Auctions;