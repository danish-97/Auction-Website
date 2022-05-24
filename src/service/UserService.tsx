import axios from "axios";
import Cookies from "js-cookie";
import {Simulate} from "react-dom/test-utils";
import error = Simulate.error;

const registerService = async (firstName: string, lastName: string, email: string, password: string) => {
    return await axios.post('http://localhost:4941/api/v1/users/register', {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
    }).then((response) => {
        return response.status
    }, ((error) => {
        console.log(error.toString())
        return error.response.status
    }))
}

const loginService = async (email: string, password: string) => {
    return await axios.post('http://localhost:4941/api/v1/users/login', {
        email: email,
        password: password,
    }).then((response) => {
        Cookies.set('UserId', response.data.userId)
        Cookies.set("token", response.data.token)
        return response.status
    }, ((error) => {
        console.log(error.toString())
        return error.response.status
    }))
}

const userLoggedIn = () => {
    const userId  = Cookies.get('UserId')
    return userId !== undefined && userId !== null;
}

const logoutService = async (token: any) => {
    const header = {headers: {"X-Authorization": token}}
    return await axios.post('http://localhost:4941/api/v1/users/logout', {}, header
    ).then((response) => {
        Cookies.remove('UserId')
        Cookies.remove('token')
        return response.status
    }, (error) => {
        console.log(error.toString())
        return error.response.status
    })
}

const userDetailsService = async (userId: number, token: any) => {
    const header = {headers: {"X-Authorization": token}}
    return await axios.get('http://localhost:4941/api/v1/users/' + userId, header)
}

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

const updateUserService = async (firstName: string, lastName: string, email: string, userId: number, token: string) => {
    const header = {headers: {"X-Authorization": token}}
    return await axios.patch('http://localhost:4941/api/v1/users/' + userId, {
        firstName: firstName,
        lastName: lastName,
        email: email
    }, header).then((response) => {
        return response.status
    }, (error) => {
        console.log(error.toString())
        return error.response.status
    })
}

const updatePasswordService = async (currentPassword: string, newPassword: string, userId: number, token: string) => {
    const header = {headers: {"X-Authorization": token}}
    return await axios.patch('http://localhost:4941/api/v1/users/' + userId, {
        password: newPassword,
        currentPassword: currentPassword
    }, header).then((response) => {
        return response.status
    }, (error) => {
        console.log(error.toString())
        return error.response.status
    })
}

export { registerService, loginService, userLoggedIn, logoutService, userDetailsService, uploadUserImageService,
    updateUserService, updatePasswordService }