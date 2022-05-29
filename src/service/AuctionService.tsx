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

const addAuctionService = async (token: string, title: string, description: string, reserve: number, categoryId: number,
                                 endDate: string, sellerId: number) => {
    const header = {headers: {"X-Authorization": token}}
    return await axios.post(`http://localhost:4941/api/v1/auctions`, {
        title: title,
        description:  description,
        categoryId:  categoryId,
        sellerId: sellerId,
        reserve: reserve,
        endDate: endDate
    }, header
    ).then((response) => {
        return response
    }, (error) => {
        console.log(error.toString())
        return error.response
    })
}

const putAuctionImageService = async (token: string, auctionId: number, image: any) => {
    const header = {headers: {"content-type": image.type, "X-Authorization": token}}
    if (image.type === 'image/jpg') {
        image.type = 'image/jpeg'
    }

    return await axios.put(`http://localhost:4941/api/v1/auctions/${auctionId}/image`, image, header
    ).then((response) => {
        return response;
    }).catch((error) => {
        console.log(error.toString())
        return error.response
    })
}

const deleteAuctionService = async (token: string, auctionId: number) => {
    const header = {headers: {"X-Authorization": token}}
    return await axios.delete(`http://localhost:4941/api/v1/auctions/${auctionId}`, header
    ).then((response) => {
        return response
    }, (error) => {
        console.log(error.toString())
        return error.response
    })
}

const updateAuctionService = async (token: string, title: string, description: string, reserve: number, auctionId: number,
                                    categoryId: number, endDate: string, sellerId: number) => {
    const header = {headers: {"X-Authorization": token}}
    return await axios.patch(`http://localhost:4941/api/v1/auctions/${auctionId}`, {
            title: title,
            description:  description,
            categoryId:  categoryId,
            sellerId: sellerId,
            reserve: reserve,
            endDate: endDate
        }, header
    ).then((response) => {
        return response
    }, (error) => {
        console.log(error.toString())
        return error.response
    })
}

export { getAllAuctionsService, getCategoriesService, getOneAuctionService, getAuctionBidsService,
    addBidService, getBidAuctionsService, addAuctionService, putAuctionImageService, deleteAuctionService, updateAuctionService }