import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import HeaderNav from "../fragments/HeaderNav";
import AuctionCard from "../fragments/AuctionCard";
import {getCategoriesService, updateQueryService} from "../service/AuctionService";
import {useState} from "react";
import {
    Autocomplete,
    FormControl,
    InputAdornment,
    InputLabel,
    MenuItem, Pagination,
    Select,
    SelectChangeEvent, Stack,
    TextField
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';


const theme = createTheme();


function Auctions() {

    const [auctions, setAuctions] = useState<Array<Auction>>([])
    const [category, setCategory] = useState<Array<Category>>([]);

    const [searchQuery, setSearchQuery] = useState("");
    const [sortQuery, setSortQuery] = useState("CLOSING_SOON");
    const [filterCategoriesQuery, setFilterCategoriesQuery] = useState<Array<Category>>([{categoryId: 0, name: ""}]);
    const [status, setStatus] = useState("ANY")
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(6);
    const [auctionCount, setAuctionCount] = useState(0);

    React.useEffect( () => {
        getCategories();
    }, [])

    React.useEffect(() => {
        getFilteredAuctions();
    }, [searchQuery, sortQuery, filterCategoriesQuery, status, count, page, Math.ceil(auctionCount/count)])


    const getCategories = async () => {
        const categories = await getCategoriesService()

        if (categories.status !== 200) {
            return
        }
        setCategory(categories.data)
        setFilterCategoriesQuery(categories.data)
    }

    const getFilteredAuctions = async() => {
        let query = "";
        if (searchQuery !== "") {
            query += "&q=" + searchQuery as string
        }

        if (sortQuery !== "") {
            query += "&sortBy=" + sortQuery as string
        }

        if (filterCategoriesQuery.length > 0) {
            for (let i = 0; i < filterCategoriesQuery.length; i++) {
                query += "&categoryIds=" + filterCategoriesQuery[i].categoryId
            }
        }

        if (status !== "") {
            query += "&status=" + status as string
        }

        if (count !== null) {
            query += "&count=" + count
        }

        if (page !== null) {
            console.log(Math.ceil(auctionCount/count))
            if (Math.ceil(auctionCount/count) === 0) {
                setPage(1)
            }
            query += "&startIndex=" + ((page - 1) * count)
        }

        const getAuctions = await updateQueryService(query);
        if (getAuctions.status !== 200) {
            return
        }
        setAuctionCount(getAuctions.data.count)
        setAuctions(getAuctions.data.auctions)
    }


    const handleSortChange = (event: SelectChangeEvent) => {
        setSortQuery(event.target.value as string)
    }

    const handleFilterCategoryChange = (event: any, value: React.SetStateAction<Category[]>) => {
        event.preventDefault()
        setFilterCategoriesQuery(value)
    }

    const handleStatusChange = (event: SelectChangeEvent) => {
        setStatus(event.target.value as string)
    }

    const handleCountChange = (event: SelectChangeEvent) => {
        setCount(parseInt(event.target.value as string, 10))
    }

    const handlePageChange = (event: any, value: any) => {
        setPage(value)
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
                            sx={{width: 500}}
                            placeholder='Search...'
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon/>
                                    </InputAdornment>
                                )
                            }}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <FormControl sx={{marginTop: '20px', width: 350}}>
                            <InputLabel>Sort By</InputLabel>
                            <Select
                                label="Sort By"
                                value={sortQuery}
                                onChange={handleSortChange}
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
                        <FormControl sx={{marginTop: '20px', marginLeft: '10px', width: 150}}>
                            <InputLabel>Filter by Status</InputLabel>
                            <Select
                                label="Filter by Status"
                                value={status}
                                onChange={handleStatusChange}
                            >
                                <MenuItem value={'ANY'}>ANY</MenuItem>
                                <MenuItem value={'OPEN'}>OPEN</MenuItem>
                                <MenuItem value={'CLOSED'}>CLOSED</MenuItem>
                            </Select>
                        </FormControl>
                        <Autocomplete
                            multiple
                            options={category}
                            getOptionLabel={(chosen) => chosen.name}
                            filterSelectedOptions
                            sx = {{marginTop: '20px', width: 500, marginLeft: '25px'}}
                            fullWidth
                            onChange={handleFilterCategoryChange}
                            isOptionEqualToValue={(chosen, value) => chosen.categoryId === value.categoryId}
                            renderInput={(categories) => (
                                <TextField
                                    {...categories}
                                    label="Filter by Category"
                                    placeholder="Category"
                                />
                            )}
                        />
                    </Container>
                </Box>
                <Stack direction='row' spacing={5} sx={{display: 'flex', justifyContent: 'center'}}>
                    <FormControl sx={{width: 150}}>
                        <InputLabel>Auctions Per Page</InputLabel>
                        <Select
                            label="Auctions Per Page"
                            value={count as unknown as string}
                            onChange={handleCountChange}
                        >
                            <MenuItem value={6}>6</MenuItem>
                            <MenuItem value={12}>12</MenuItem>
                            <MenuItem value={18}>18</MenuItem>
                        </Select>
                    </FormControl>
                    <Pagination sx={{marginTop: '40px'}} count={Math.ceil(auctionCount/count)} page={page} onChange={handlePageChange}
                                variant="outlined" color="secondary" />
                </Stack>
                <Container sx={{ py: 8 }} maxWidth="md">
                    {/* End hero unit */}
                    <Grid container spacing={4}>
                        {auctions.map((auction) => (
                            <AuctionCard key={auction.auctionId} auction={auction} categories={category} isMyAuction={false}/>
                        ))}
                    </Grid>
                </Container>
            </main>
            {/* Footer */}
            <Box sx={{ bgcolor: 'background.paper', p: 6}} component="footer">
                <Stack direction='row' spacing={5} sx={{display: 'flex', justifyContent: 'center'}}>
                    <FormControl sx={{width: 150}}>
                        <InputLabel>Auctions Per Page</InputLabel>
                        <Select
                            label="Auctions Per Page"
                            value={count as unknown as string}
                            onChange={handleCountChange}
                        >
                            <MenuItem value={6}>6</MenuItem>
                            <MenuItem value={12}>12</MenuItem>
                            <MenuItem value={18}>18</MenuItem>
                        </Select>
                    </FormControl>
                    <Pagination sx={{marginTop: '40px'}} count={Math.ceil(auctionCount/count)} page={page} onChange={handlePageChange}
                                variant="outlined" color="secondary" />
                </Stack>
            </Box>
            {/* End footer */}
        </ThemeProvider>
    );
}

export default Auctions;