import {RouteController} from "../../../Helpers/Route";
import RouteService from "../Services/RouteService";
import buildResponse from "../Response";
import APIResponseStatus from "../../../Helpers/APIResponseStatus";
import DeviceService from "../Services/DeviceService";
import rentDevice = DeviceService.rentDevice;
import RedisHelper from "../../../Helpers/RedisHelper";
import Device from "./AddDevice";
import {DeviceState} from "../../../Helpers/DeviceState";

let route: RouteController = {
    async handlePost(req, res) {
        let userId = RouteService.checkToken(req.header("x-access-token"));
        if (userId == null) {
            res.status(400).send(
                buildResponse<any>(APIResponseStatus.INVALID_TOKEN).toJSON()
            )
            return
        }
        let deviceId = req.params.id;
        if (!deviceId) {
            res.status(400).send(
                buildResponse<any>(APIResponseStatus.INVALID_REQUEST_PARAMS).toJSON()
            )
            return
        }
        let device = await DeviceService.getDevice(deviceId as string);
        if (device[0] != null && !(await DeviceService.isDeviceRent(deviceId as string))) {
            if(!(await rentDevice(deviceId as string, userId))){
                res.status(400).send(
                    buildResponse<any>(APIResponseStatus.ERROR, `Cannot rent device with id ${deviceId}.`).toJSON()
                )
                return;
            }
            await RedisHelper.addDevice({...device[0], state: DeviceState.Rent});
            res.send(
                buildResponse<boolean>(APIResponseStatus.SUCCESS, "", false, true).toJSON()
            )
        } else {
            res.status(400).send(
                buildResponse<any>(APIResponseStatus.ERROR, "Device not exist or is already rent.").toJSON()
            )
        }
    }
}

export default route;