import {Avatar, CssBaseline, Paper, ThemeProvider} from "@mui/material";
import {createTheme} from "@mui/material/styles";
import HeaderNav from "../fragments/HeaderNav";
import {useParams} from "react-router-dom";
import {getOneAuctionService} from "../service/AuctionService";
import React, {useState} from "react";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

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

    React.useEffect(() => {
        getAuction();
    })

    const getAuction = async () => {
        const auction = await getOneAuctionService(parseInt(auctionId as string, 10))
        if (auction.status !== 200) {
            return
        }
        setAuctionDetails(auction.data)
    }


    const theme = createTheme();

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <HeaderNav/>
            <Stack direction='row' spacing={10} style={{marginTop:'50px', marginLeft: '50px'}}>
                <Typography variant='h4' style={{width:500}}>
                    <Avatar style={{width: 300, height: 300, justifyContent: "center"}}
                            src={`http://localhost:4941/api/v1/auctions/${auctionId}/image`}/>
                    {auctionDetails.title}
                </Typography>
                <Paper style={{backgroundColor: '#75D4E1', width: 500}}>
                    <Typography style={{marginTop: '30px', display: 'block'}} variant='h6'>
                        Sold by: {auctionDetails.sellerFirstName} {auctionDetails.sellerLastName}
                        Description: <Typography>{auctionDetails.description}</Typography>
                    </Typography>
                </Paper>
            </Stack>
        </ThemeProvider>
    )
}

export default AuctionDetails;