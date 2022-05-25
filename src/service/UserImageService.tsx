import axios from "axios";

const uploadUserImageService = async (token: any, userId: any, image: any) => {
    const header = {headers: {"content-type": image.type, "X-Authorization": token}}
    if (image.type === 'image/jpg') {
        image.type = 'image/jpeg'
    }

    return await axios.put(`http://localhost:4941/api/v1/users/${userId}/image`, image, header
    ).then((response) => {
        return response.status;
    }).catch((error) => {
        console.log(error.toString())
        return error.response.status
    })
}

const getUserImageService = async (userId: any) => {
    return await axios.get(`http://localhost:4941/api/v1/users/${userId}/image`
    ).then((response) => {
        return response.status;
    }).catch ((error) => {
        return error.response.status
    })
}

const deleteUserImageService = async (userId: any, token: any) => {
    const header = {headers: {"X-Authorization": token}}
    return await axios.delete(`http://localhost:4941/api/v1/users/${userId}/image`, header
    ).then((response) => {
        return response.status;
    }, (error) => {
        console.log(error.toString())
        return error.response.status
    })
}

export { uploadUserImageService, getUserImageService, deleteUserImageService}