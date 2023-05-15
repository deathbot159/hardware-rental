import {RouteController} from "../../../Helpers/Route";
import buildResponse from "../Response";
import APIResponseStatus from "../../../Helpers/APIResponseStatus";
import TokenService from "../Services/TokenService";
import AccountService from "../Services/AccountService";
import RentDeviceDTO from "../../../DTOs/RentDeviceDTO";
import GetAccountById = AccountService.GetAccountById;


const route: RouteController = {
    async handleGet(req, res) {
        const token = req.header("x-access-token");

        if (token == undefined) {
            res.status(401).send(
                buildResponse(APIResponseStatus.INVALID_TOKEN).toJSON()
            )
            return
        }
        const tokenData = TokenService.untokenize(token);
        if (tokenData.id == "") {
            res.status(401).send(
                buildResponse(APIResponseStatus.INVALID_TOKEN).toJSON()
            )
            return
        }

        const accResp = (await GetAccountById(tokenData.id));

        if (accResp.data.id != undefined) {
            const rentDevices = await AccountService.getRentDevices(tokenData.id);
            res.status(200).send(
                buildResponse<{ name: string, avatar: string, admin: boolean, rentDevices: RentDeviceDTO[] }>
                (APIResponseStatus.SUCCESS, "", accResp.fromCache,
                    {
                        name: accResp.data.name,
                        avatar: accResp.data.avatar,
                        admin: accResp.data.authority == 1,
                        rentDevices
                    }
                ).toJSON()
            )
        } else {
            res.status(404).send(
                buildResponse(APIResponseStatus.DATA_NOT_FOUND).toJSON()
            )
        }


    }
}

export default route;