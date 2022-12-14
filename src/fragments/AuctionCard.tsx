import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import * as React from "react";
import {useState} from "react";
import Grid from "@mui/material/Grid";
import {
    Avatar,
    Badge,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Stack
} from "@mui/material";
import Cookies from "js-cookie";
import {deleteAuctionService} from "../service/AuctionService";

interface IAuctionProps {
    auction: Auction,
    categories: Category[]
    isMyAuction: boolean
}

function AuctionCard(props: IAuctionProps) {

    const [auction] = useState <Auction>(props.auction);
    const [filteredCategory, setFilteredCategory] = useState<Category>({categoryId: -1, name: ""});
    const [errorFlag, setErrorFlag] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [openDialog, setOpenDialog] = useState(false);
    const [deletePrompt, setDeletePrompt] = useState(false);

    const handleDialogClose = () => {
        setOpenDialog(false);
        setErrorFlag(false);
        setDeletePrompt(false)
    };

    const handleDialogOpen = () => {
        setOpenDialog(true);
    };


    React.useEffect(() => {
        if (errorFlag) {
            handleDialogOpen()
        }
    }, [errorFlag, errorMessage])

    React.useEffect(() => {
        setFilteredCategory(props.categories.filter(category => category.categoryId === auction.categoryId)[0])
    }, [])

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
        if (monthsDifference > 0) return `Closes : ${monthsDifference} month`
        if (daysDifference > 1) return `Closes : ${daysDifference} days`
        if (daysDifference > 0) return `Closes tomorrow`
        if (hoursDifference > 1) return `Closes : ${hoursDifference} hours`
        if (hoursDifference === 1) return `Closes : ${hoursDifference} hour`
        if (minutesDifference > 0) return `Closes : ${minutesDifference} minutes`
        if (minutesDifference < 0) return 'Auction Closed'

    }

    const handleDelete = async () => {
        const token = Cookies.get("token") as string

        const deleteAuction = await deleteAuctionService(token, auction.auctionId)
        if (deleteAuction.status !== 200) {
            setErrorFlag(true)
            setErrorMessage(deleteAuction.statusText)
            return
        }
        window.location.reload();
    }


    return (
        <Grid item key={auction.auctionId} xs={12} sm={6} md={4}>
            <Card
                sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
            >
                <CardMedia
                    component="img"
                    image={`http://localhost:4941/api/v1/auctions/${auction.auctionId}/image`}
                    onError={(e: any) => (e.target.src="https://atasouthport.com/wp-content/uploads/2017/04/default-image.jpg")}
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
                    {props.isMyAuction?
                        <><Button size="small" variant='outlined' color='success'
                                onClick={() => window.location.href=`http://localhost:8097/editAuction/${auction.auctionId}`}
                        >Edit</Button>
                        <Button size="small" variant='outlined' color='error'
                                onClick={() => setDeletePrompt(true)}
                        >Delete</Button></>
                        : ""
                    }
                </CardActions>
            </Card>
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

            <Dialog
                open={deletePrompt}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">
                    {"Delete"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete this item?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" color="error" onClick={handleDelete}
                            autoFocus>
                        Delete
                    </Button>
                    <Button variant="outlined" color="primary" onClick={() => setDeletePrompt(false)}
                            autoFocus>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Grid>
    )
}

export default AuctionCard;