export default {
    "v1": {
        "/authorize": {
            "fileName": "Authorize",
            "methods": [
                "POST"
            ],
            "disabled": false
        },
        "/token": {
            "fileName": "Token",
            "methods": [
                "POST"
            ],
            "disabled": false
        },
        "/user/me": {
            "fileName": "User",
            "methods": [
                "GET"
            ],
            "disabled": false
        },
        "/user/me/rentdevices": {
            "fileName": "RentDevices",
            "methods": [
                "GET"
            ],
            "disabled": false
        },
        "/user/me/rentdevice/:id/return": {
            "fileName": "ReturnDevice",
            "methods": [
                "DELETE"
            ],
            "disabled": false
        },
        "/devices": {
            "fileName": "Devices",
            "methods": [
                "GET"
            ],
            "disabled": false
        },
        "/device": {
            "fileName": "AddDevice",
            "methods": [
                "POST"
            ],
            "disabled": false
        },
        "/device/:id/remove": {
            "fileName": "RemoveDevice",
            "methods": [
                "DELETE"
            ],
            "disabled": false
        },
        "/device/:id/edit": {
            "fileName": "EditDevice",
            "methods": [
                "PUT"
            ],
            "disabled": false
        },
        "/device/:id/rent": {
            "fileName": "RentDevice",
            "methods": [
                "POST"
            ],
            "disabled": false
        }
    }
};