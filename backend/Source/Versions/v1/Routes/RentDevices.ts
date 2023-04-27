import {RouteController} from "../../../Helpers/Route";
import RouteService from "../Services/RouteService";
import buildResponse from "../Response";
import APIResponseStatus from "../../../Helpers/APIResponseStatus";
import RentDeviceDTO from "../../../DTOs/RentDeviceDTO";
import AccountService from "../Services/AccountService";

let route: RouteController = {
    async handleGet(req, res) {
        let userId = RouteService.checkToken(req.header("x-access-token"));
        if (userId == null) {
            res.status(400).send(
                buildResponse<any>(APIResponseStatus.INVALID_TOKEN).toJSON()
            )
            return
        }
        let devices = await AccountService.getRentDevices(userId);
        res.status(200).send(
            buildResponse<RentDeviceDTO[]>(APIResponseStatus.SUCCESS, "", false, devices).toJSON()
        )
    }
}

export default route;