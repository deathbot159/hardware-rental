import API from "@/Helpers/API";

async function checkToken(token: string): Promise<boolean>{
    return new Promise<boolean>(async resolve => {
        let {success} = await API.checkToken(token);
        resolve(success);
    })
}

export {checkToken};