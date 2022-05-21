import axios from "axios";

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
        return response.status
    }, ((error) => {
        console.log(error.toString())
        return error.response.status
    }))
}

export { registerService, loginService }