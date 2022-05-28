import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import * as React from "react";
import {useState} from "react";
import Grid from "@mui/material/Grid";
import {Avatar, Badge, Stack} from "@mui/material";
import {getCategoriesService} from "../service/AuctionService";
import {useNavigate} from "react-router-dom";

interface IAuctionProps {
    auction: Auction,
    categories: Category[]
    myAuction: boolean
}

function AuctionCard(props: IAuctionProps) {

    const [auction] = useState <Auction>(props.auction);
    const [filteredCategory, setFilteredCategory] = useState<Category>({categoryId: -1, name: ""});
    const navigate = useNavigate();

    React.useEffect(() => {
        setFilteredCategory(props.categories.filter(category => category.categoryId === auction.categoryId)[0])
    })

    const differenceInMonths = (currentDate: Date, endDate: Date) => {
        let months = (endDate.getFullYear() - currentDate.getFullYear()) * 12
        months += endDate.getMonth() - currentDate.getMonth();
        return months
    }

    const differenceInDays = (currentDate: Date, endDate: Date) => {
        const day = 1000 * 60 * 60 * 24
        return Math.floor((endDate.getTime() - currentDate.getTime()) / day)
    }

    const differenceInHours = (currentDate: Date, endDate: Date) => {
        const hour = 1000 * 60 * 60
        return Math.floor((endDate.getTime() - currentDate.getTime()) / hour)
    }

    const differenceInMinutes = (currentDate: Date, endDate: Date) => {
        const minute = 1000 * 60
        return Math.floor((endDate.getTime() - currentDate.getTime()) / minute)
    }
    const remainingTime = (auctionEndDate: string) => {
        const endDate = new Date(Date.parse(auctionEndDate))
        const currentDate = new Date();

        const monthsDifference = differenceInMonths(currentDate, endDate)
        const hoursDifference = differenceInHours(currentDate, endDate)
        const daysDifference = differenceInDays(currentDate, endDate)
        const minutesDifference = differenceInMinutes(currentDate, endDate)

        if (monthsDifference > 1) return `Closes : ${monthsDifference} months`
        if (monthsDifference === 1) return `Closes : ${monthsDifference} month`
        if (daysDifference > 1) return `Closes : ${daysDifference} days`
        if (daysDifference === 1) return `Closes tomorrow`
        if (hoursDifference > 1) return `Closes : ${hoursDifference} hours`
        if (hoursDifference === 1) return `Closes : ${hoursDifference} hour`
        if (minutesDifference > 0) return `Closes : ${minutesDifference} minutes`
        if (minutesDifference < 0) return 'Auction Closed'

    }


    return (
        <Grid item key={auction.auctionId} xs={12} sm={6} md={4}>
            <Card
                sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
            >
                <CardMedia
                    component="img"
                    image={`http://localhost:4941/api/v1/auctions/${auction.auctionId}/image`}
                    alt="auction"
                />
                <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                        {auction.title}
                    </Typography>
                    <Stack style={{marginBottom: '20px'}} direction='row' spacing={5}>
                        <Typography variant="h6" style={{color: 'navy'}}>
                            {filteredCategory.name}
                        </Typography>
                        <Typography style={{color: 'red'}}>
                            {remainingTime(auction.endDate)}
                        </Typography>
                    </Stack>
                    <Typography>
                        {auction.highestBid===null? "No Bids!" : 'Bid: $' + auction.highestBid}
                    </Typography>
                    <Typography>
                        {auction.reserve>auction.highestBid? 'Reserve: $' + auction.reserve : "Reserve Met!"}
                    </Typography>
                    <Typography style={{marginTop: '20px'}}>
                        <Badge style={{marginRight: '10px'}}>
                            <Avatar sx={{width:40, height:40}}
                                    src={`http://localhost:4941/api/v1/users/${auction.sellerId}/image`}
                                    onError={() => '<PersonOutlinedIcon/>'}/>
                        </Badge>
                        {auction.sellerFirstName} {auction.sellerLastName}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button size="small" variant='outlined'
                            onClick={() => window.location.href=`http://localhost:8097/auctionDetails/${auction.auctionId}`}
                    >View</Button>
                </CardActions>
            </Card>
        </Grid>
    )
}

export default AuctionCard;