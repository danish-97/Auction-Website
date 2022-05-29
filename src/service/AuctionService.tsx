import axios from "axios";

const getAllAuctionsService = async () => {
    return await axios.get('http://localhost:4941/api/v1/auctions'
    ).then((response) => {
        return response
    }, (error) => {
        console.log(error.toString())
        return error.response
    })
}

const getCategoriesService = async () => {
    return await axios.get('http://localhost:4941/api/v1/auctions/categories'
    ).then((response) => {
        return response
    }, (error) => {
        console.log(error.toString())
        return error.response
    })
}

const getOneAuctionService = async (auctionId: number) => {
    return await axios.get(`http://localhost:4941/api/v1/auctions/${auctionId}`
    ).then((response) => {
        return response
    }, (error) => {
        console.log(error.toString())
        return error.response.status
    })
}

const getAuctionBidsService = async (auctionId: number) => {
    return await axios.get(`http://localhost:4941/api/v1/auctions/${auctionId}/bids`
    ).then((response) => {
        return response
    }, (error) => {
        console.log(error.toString())
        return error.response.status
    })
}


const getSimilarCategoriesService = async (categoryId: number) => {
    return await axios.get(`http://localhost:4941/api/v1/auctions?categoryIds=`+ categoryId
    ).then((response) => {
        return response
    }, (error) => {
        console.log(error.toString())
        return error.response.status
    })
}

const getSimilarSellersService = async (sellerId: number) => {
    return await axios.get(`http://localhost:4941/api/v1/auctions?sellerId=`+ sellerId
    ).then((response) => {
        return response
    }, (error) => {
        console.log(error.toString())
        return error.response.status
    })
}

const getBidAuctionsService = async (bidderId: number) => {
    return await axios.get(`http://localhost:4941/api/v1/auctions?bidderId=` + bidderId
    ).then((response) => {
        return response
    }, (error) => {
        console.log(error.toString())
        return error.response
    })
}

const addBidService = async (token: string, auctionId: number, bidAmount: number) => {
    const header = {headers: {"X-Authorization": token}}
    return await axios.post(`http://localhost:4941/api/v1/auctions/${auctionId}/bids`, {
        amount: bidAmount
        }, header
    ).then((response) => {
        return response
    }, (error) => {
        console.log(error.toString())
        return error.response
    })
}

export { getAllAuctionsService, getCategoriesService, getOneAuctionService, getAuctionBidsService,
    getSimilarCategoriesService, addBidService, getSimilarSellersService, getBidAuctionsService }