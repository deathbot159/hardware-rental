import {RouteController} from "../../../Helpers/Route";
import RouteService from "../Services/RouteService";
import buildResponse from "../Response";
import APIResponseStatus from "../../../Helpers/APIResponseStatus";
import RentDeviceDTO from "../../../DTOs/RentDeviceDTO";
import AccountService from "../Services/AccountService";

const route: RouteController = {
    async handleGet(req, res) {
        const userId = RouteService.checkToken(req.header("x-access-token"));
        if (userId == null) {
            res.status(401).send(
                buildResponse(APIResponseStatus.INVALID_TOKEN).toJSON()
            )
            return
        }
        const devices = await AccountService.getRentDevices(userId);
        res.status(200).send(
            buildResponse<RentDeviceDTO[]>(APIResponseStatus.SUCCESS, "", false, devices).toJSON()
        )
    }
}

export default route;