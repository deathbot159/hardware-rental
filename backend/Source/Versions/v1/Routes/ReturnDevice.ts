import {RouteController} from "../../../Helpers/Route";
import RouteService from "../Services/RouteService";
import buildResponse from "../Response";
import APIResponseStatus from "../../../Helpers/APIResponseStatus";
import AccountService from "../Services/AccountService";
import DeviceService from "../Services/DeviceService";
import RedisHelper from "../../../Helpers/RedisHelper";
import {DeviceState} from "../../../Helpers/DeviceState";
import returnDevice = DeviceService.returnDevice;


const route: RouteController = {
    async handleDelete(req, res) {
        const userId = RouteService.checkToken(req.header("x-access-token"));
        if (userId == null) {
            res.status(401).send(
                buildResponse(APIResponseStatus.INVALID_TOKEN).toJSON()
            )
            return
        }
        const devId = req.params.id;
        if (!devId) {
            res.status(400).send(
                buildResponse(APIResponseStatus.INVALID_REQUEST_PARAMS).toJSON()
            )
            return
        }
        const rentDevice = await AccountService.getRentDeviceById(userId, devId);
        const device = await DeviceService.getDevice(devId);
        if (rentDevice == null || device[0] == null) {
            res.status(400).send(
                buildResponse(APIResponseStatus.ERROR, "Cannot find requested device.").toJSON()
            )
            return;
        }
        if (!(await returnDevice(devId, userId))) {
            res.status(400).send(
                buildResponse(APIResponseStatus.ERROR, "Cannot return this device.").toJSON()
            )
            return;
        }
        await RedisHelper.addDevice({...device[0], state: DeviceState._});
        res.send(
            buildResponse<boolean>(APIResponseStatus.SUCCESS, "", false, true).toJSON()
        )

    }
}

export default route;