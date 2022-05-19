import axios from "axios";

const registerService = async (firstName: string, lastName: string, email: string, password: string) => {
    return await axios.post('http://localhost:4941/api/v1/users/register', {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
    }).then(response => {
        response.status
    }, (error => {
        console.log(error.toString())
        error.response.status
    }))
}

export { registerService }