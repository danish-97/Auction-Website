type Auction = {
    auctionId: number,
    title: string,
    description: string,
    endDate: string,
    imageFilename: string,
    reserve: number,
    sellerId: number,
    categoryId: number,
    sellerFirstName: string,
    sellerLastName: string,
    highestBid: number,
    numBids: number,
}

type Category = {
    categoryId: number,
    name: string
}

type Bid = {
    bidderId: number,
    amount: number,
    firstName: string
    lastName: string,
    timestamp: string
}

interface AuctionSearchQuery {
    startIndex?: number,
    count?: number,
    q?: string,
    categoryIds?: number[],
    sellerId?: number,
    bidderId?: number,
    sortBy?: string,
    status?: string
}