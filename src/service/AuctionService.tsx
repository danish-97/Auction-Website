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

// const getSimilarAuctionsService = async (params: AuctionSearchQuery) => {
//     return await axios.get(`http://localhost:4941/api/v1/auctions`, {params: params}
//     ).then((response) => {
//         return response;
//     }, (error) => {
//         console.log(error.toString())
//         return error.response;
//     })
// }

const getSimilarAuctionsService = async (catId:number, sellerId:number) => {
    return await axios.get(`http://localhost:4941/api/v1/auctions?categoryIds=`+catId+"?sellerId="+sellerId);

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
    getSimilarAuctionsService, addBidService }