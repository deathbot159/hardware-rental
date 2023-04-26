import {RouteController} from "../../../Helpers/Route";
import buildResponse from "../Response";
import APIResponseStatus from "../../../Helpers/APIResponseStatus";
import TokenService from "../Services/TokenService";
import RedisHelper from "../../../Helpers/RedisHelper";
import DatabaseHelper from "../../../Helpers/DatabaseHelper";
import AccountService from "../Services/AccountService";
import GetAccountById = AccountService.GetAccountById;
import RentDeviceDTO from "../../../DTOs/RentDeviceDTO";


let route: RouteController = {
    async handleGet(req, res) {
        let token = req.header("x-access-token");

        if (token == undefined) {
            res.status(400).send(
                buildResponse<any>(APIResponseStatus.INVALID_TOKEN).toJSON()
            )
            return
        }
        let tokenData = TokenService.untokenize(token);
        if (tokenData.id == "") {
            res.status(400).send(
                buildResponse<any>(APIResponseStatus.INVALID_TOKEN).toJSON()
            )
            return
        }

        let accResp = (await GetAccountById(tokenData.id));

        if (accResp.data.id != undefined) {
            let rentDevices = await DatabaseHelper.getRentDevices(tokenData.id);
            res.status(200).send(
                buildResponse<{ name: string, avatar: string, admin: boolean, rentDevices: RentDeviceDTO[] }>
                (APIResponseStatus.SUCCESS, "", accResp.fromCache,
                    {name: accResp.data.name, avatar: accResp.data.avatar, admin: accResp.data.authority == 1, rentDevices}
                ).toJSON()
            )
        } else {
            res.status(404).send(
                buildResponse<any>(APIResponseStatus.DATA_NOT_FOUND).toJSON()
            )
        }


    }
}

export default route;