import API from "@/Helpers/API";

async function checkToken(token: string): Promise<boolean>{
    return new Promise<boolean>(async resolve => resolve((await API.checkToken(token)).success))
}

export {checkToken};