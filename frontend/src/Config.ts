
let apiAddress = "http://127.0.0.1:1234/api/v1"
let routes = {
    "token": `${apiAddress}/token`,
    "authorize": `${apiAddress}/authorize`,
    "currentUserInfo": `${apiAddress}/user/me`,
    "devices": `${apiAddress}/devices`,
    "rentDevices": `${apiAddress}/user/me/rentdevices`,
    rentDevice: (devId: string) => `${apiAddress}/device/${devId}/rent`,
    returnDevice: (devId: string) => `${apiAddress}/user/me/rentdevice/${devId}/return`
}


export {apiAddress, routes};