import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import * as React from "react";
import {useState} from "react";
import Grid from "@mui/material/Grid";
import {Avatar, Badge} from "@mui/material";

interface IAuctionProps {
    auction: Auction
}

function AuctionCard(props: IAuctionProps) {

    const [auction] = useState <Auction>(props.auction);

    return (
        <Grid item key={auction.auctionId} xs={12} sm={6} md={4}>
            <Card
                sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
            >
                <CardMedia
                    component="img"
                    // sx={{
                    //     // 16:9
                    //     pt: '56.25%',
                    // }}
                    image={`http://localhost:4941/api/v1/auctions/${auction.auctionId}/image`}
                    alt="auction"
                />
                <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                        {auction.title}
                    </Typography>
                    <Typography>
                        {auction.highestBid}
                    </Typography>
                    <Typography>
                        {auction.categoryId}
                    </Typography>
                    <Typography>
                        {auction.reserve}
                    </Typography>
                    <Typography>
                        <Badge style={{marginRight: '10px'}}>
                            <Avatar sx={{width:40, height:40}}
                                    src={`http://localhost:4941/api/v1/users/${auction.sellerId}/image`}
                                    onError={() => '<PersonOutlinedIcon/>'}/>
                        </Badge>
                        {auction.sellerFirstName} {auction.sellerLastName}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button size="small" variant='outlined'>View</Button>
                </CardActions>
            </Card>
        </Grid>
    )
}

export default AuctionCard;