import {RouteController} from "../../../Helpers/Route";
import RouteService from "../Services/RouteService";
import buildResponse from "../Response";
import APIResponseStatus from "../../../Helpers/APIResponseStatus";
import AccountService from "../Services/AccountService";
import DeviceService from "../Services/DeviceService";

let route: RouteController = {
    async handleDelete(req, res) {
        let userId = RouteService.checkToken(req.header("x-access-token"));
        if (userId == null) {
            res.status(401).send(
                buildResponse<any>(APIResponseStatus.INVALID_TOKEN).toJSON()
            )
            return
        }
        let accResp = await AccountService.GetAccountById(userId);
        if (accResp.data.id == undefined) {
            res.status(401).send(
                buildResponse<any>(APIResponseStatus.INVALID_TOKEN).toJSON()
            )
            return
        }
        if (accResp.data.authority != 1) {
            res.status(403).send(
                buildResponse<any>(APIResponseStatus.INVALID_PERMISSIONS).toJSON()
            )
            return
        }
        let devId = req.params.id;
        if (!devId) {
            res.status(400).send(
                buildResponse<any>(APIResponseStatus.INVALID_REQUEST_PARAMS).toJSON()
            )
            return
        }
        if (!(await DeviceService.removeDevice(devId))) {
            res.status(400).send(
                buildResponse<any>(APIResponseStatus.ERROR, "Device not exists or its rented.").toJSON()
            )
            return
        }
        res.send(
            buildResponse<any>(APIResponseStatus.SUCCESS).toJSON()
        )
    }
}

export default route;