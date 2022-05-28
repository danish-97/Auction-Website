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

const getSimilarAuctionsService = async (categoryId: number, sellerId: number) => {
    return await axios.get(`http://localhost:4941/api/v1/auctions`, {params: {categoryId, sellerId}}
    ).then((response) => {
        return response;
    }, (error) => {
        console.log(error.toString())
        return error.response.status;
    })
}

export { getAllAuctionsService, getCategoriesService, getOneAuctionService, getAuctionBidsService, getSimilarAuctionsService }