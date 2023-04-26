
let apiAddress = "http://127.0.0.1:1234/api/v1"
let routes = {
    "token": `${apiAddress}/token`,
    "authorize": `${apiAddress}/authorize`,
    "currentUserInfo": `${apiAddress}/user/me`,
    "devices": `${apiAddress}/devices`
}


export {apiAddress, routes};