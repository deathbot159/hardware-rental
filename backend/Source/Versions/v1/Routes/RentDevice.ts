import {RouteController} from "../../../Helpers/Route";
import RouteService from "../Services/RouteService";
import buildResponse from "../Response";
import APIResponseStatus from "../../../Helpers/APIResponseStatus";
import DeviceService from "../Services/DeviceService";
import RedisHelper from "../../../Helpers/RedisHelper";
import {DeviceState} from "../../../Helpers/DeviceState";
import rentDevice = DeviceService.rentDevice;

const route: RouteController = {
    async handlePost(req, res) {
        const userId = RouteService.checkToken(req.header("x-access-token"));
        if (!userId) {
            res.status(401).send(
                buildResponse(APIResponseStatus.INVALID_TOKEN).toJSON()
            )
            return
        }
        const deviceId = req.params.id;
        if (!deviceId) {
            res.status(400).send(
                buildResponse(APIResponseStatus.INVALID_REQUEST_PARAMS).toJSON()
            )
            return
        }
        const device = await DeviceService.getDevice(deviceId as string);
        if (!!device[0] && !(await DeviceService.isDeviceRent(deviceId as string))) {
            if (!(await rentDevice(deviceId as string, userId))) {
                res.status(400).send(
                    buildResponse(APIResponseStatus.ERROR, `Cannot rent device with id ${deviceId}.`).toJSON()
                )
                return;
            }
            await RedisHelper.addDevice({...device[0], state: DeviceState.Rent});
            res.send(
                buildResponse<boolean>(APIResponseStatus.SUCCESS, "", false, true).toJSON()
            )
        } else {
            res.status(400).send(
                buildResponse(APIResponseStatus.ERROR, "Device not exist or is already rent.").toJSON()
            )
        }
    }
}

export default route;