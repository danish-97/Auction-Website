import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import HeaderNav from "../fragments/HeaderNav";
import AuctionCard from "../fragments/AuctionCard";
import {getAllAuctionsService, getCategoriesService} from "../service/AuctionService";
import {useState} from "react";
import {FormControl, InputAdornment, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';


const theme = createTheme();


function Auctions() {

    const [auctions, setAuctions] = useState<Array<Auction>>([])
    const [category, setCategory] = useState<Array<Category>>([]);

    const [searchQuery, setSearchQuery] = useState("");
    const [sortQuery, setSortQuery] = useState("");

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
                        <TextField
                            name="search"
                            type='search'
                            label='Search'
                            fullWidth
                            placeholder='Search...'
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon/>
                                    </InputAdornment>
                                )
                            }}
                        />
                        <FormControl fullWidth sx={{marginTop: '20px'}}>
                            <InputLabel>Sort By</InputLabel>
                            <Select
                                // value={age}
                                label="Sort By"
                                // onChange={handleChange}
                            >
                                <MenuItem value={'ALPHABETICAL_ASC'}>Order by Alphabetical Ascending</MenuItem>
                                <MenuItem value={'ALPHABETICAL_DESC'}>Order by Alphabetical Descending</MenuItem>
                                <MenuItem value={'BIDS_ASC'}>Order by Bids Ascending</MenuItem>
                                <MenuItem value={'BIDS_DESC'}>Order by Bids Descending</MenuItem>
                                <MenuItem value={'RESERVE_ASC'}>Order by Reserve Ascending</MenuItem>
                                <MenuItem value={'RESERVE_DESC'}>Order by Reserve Descending</MenuItem>
                                <MenuItem value={'CLOSING_LAST'}>Order by Closing Late</MenuItem>
                                <MenuItem value={'CLOSING_SOON'}>Order By Closing Soon</MenuItem>
                            </Select>
                        </FormControl>
                    </Container>
                </Box>
                <Container sx={{ py: 8 }} maxWidth="md">
                    {/* End hero unit */}
                    <Grid container spacing={4}>
                        {auctions.map((auction) => (
                            <AuctionCard auction={auction} categories={category} isMyAuction={false}/>
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