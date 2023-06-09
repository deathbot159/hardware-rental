import {RouteController} from "../../../Helpers/Route";
import RouteService from "../Services/RouteService";
import buildResponse from "../Response";
import APIResponseStatus from "../../../Helpers/APIResponseStatus";
import AccountService from "../Services/AccountService";
import DeviceService from "../Services/DeviceService";
import {DeviceState} from "../../../Helpers/DeviceState";


let route: RouteController = {
    async handlePost(req, res) {
        const userId = RouteService.checkToken(req.header("x-access-token"));
        if (!userId) {
            res.status(401).send(
                buildResponse(APIResponseStatus.INVALID_TOKEN).toJSON()
            )
            return
        }
        const accResp = await AccountService.GetAccountById(userId);
        if (!accResp.data.id) {
            res.status(401).send(
                buildResponse(APIResponseStatus.INVALID_TOKEN).toJSON()
            )
            return
        }
        if (accResp.data.authority !== 1) {
            res.status(403).send(
                buildResponse(APIResponseStatus.INVALID_PERMISSIONS).toJSON()
            )
            return
        }
        const {name, company, disabled} = req.body;
        if (!name || !company || !disabled) {
            res.status(400).send(
                buildResponse(APIResponseStatus.INVALID_REQUEST_BODY).toJSON()
            )
            return
        }
        if (!await DeviceService.addDevice({name, company, state: !disabled ? DeviceState._ : DeviceState.Disabled})) {
            res.status(400).send(
                buildResponse(APIResponseStatus.ERROR).toJSON()
            )
            return
        }
        res.send(
            buildResponse(APIResponseStatus.SUCCESS).toJSON()
        )
    }
}

export default route;