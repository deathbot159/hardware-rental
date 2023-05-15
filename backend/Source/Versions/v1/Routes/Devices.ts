import {RouteController} from "../../../Helpers/Route";
import buildResponse from "../Response";
import APIResponseStatus from "../../../Helpers/APIResponseStatus";
import RouteService from "../Services/RouteService";
import DeviceDTO from "../../../DTOs/DeviceDTO";
import DeviceService from "../Services/DeviceService";


const route: RouteController = {
    handleGet(req, res) {
        const userId = RouteService.checkToken(req.header("x-access-token"));
        if (userId == null) {
            res.status(401).send(
                buildResponse(APIResponseStatus.INVALID_TOKEN).toJSON()
            )
            return
        }
        DeviceService.getDevices().then(([data, fromCache]) => {
            res.status(200).send(
                buildResponse<DeviceDTO[]>(APIResponseStatus.SUCCESS, "", fromCache, data).toJSON()
            )
        })
    }
}

export default route;