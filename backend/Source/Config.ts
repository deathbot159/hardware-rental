export default {
    "port": 1234,
    "database": {
      "host": "172.17.0.3",
      "port": 27017,
      "name": "HR",
      "collections": {
        "AccountsCollection": "Accounts",
        "DevicesCollection": "Devices",
        "RentDevicesCollection": "RentDevices"
      }
    },
    "cacheServer": {
      "host": "172.17.0.4",
      "port": 6379
    },
    "authTokens": {
      "secret": "za_duzo_wiesz_:gun:",
      "tokenLifetime": 10800
    }
  };