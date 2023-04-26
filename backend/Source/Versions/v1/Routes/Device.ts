import {RouteController} from "../../../Helpers/Route";
import RouteService from "../Services/RouteService";
import buildResponse from "../Response";
import APIResponseStatus from "../../../Helpers/APIResponseStatus";
import AccountService from "../Services/AccountService";
import DeviceService from "../Services/DeviceService";


let route: RouteController = {
    async handlePost(req, res) {
        let userId = RouteService.checkToken(req.header("x-access-token"));
        if (userId == null) {
            res.status(400).send(
                buildResponse<any>(APIResponseStatus.INVALID_TOKEN).toJSON()
            )
            return
        }
        let accResp = await AccountService.GetAccountById(userId);
        if(accResp.data.id == undefined){
            res.status(400).send(
                buildResponse<any>(APIResponseStatus.INVALID_TOKEN).toJSON()
            )
            return
        }
        if(accResp.data.authority != 1){
            res.status(400).send(
                buildResponse<any>(APIResponseStatus.INVALID_PERMISSIONS).toJSON()
            )
            return
        }
        let {name, company, state} = req.body;
        if(name == undefined || company == undefined || state == undefined){
            res.status(400).send(
                buildResponse<any>(APIResponseStatus.INVALID_REQUEST_BODY).toJSON()
            )
            return
        }
        if(!await DeviceService.addDevice({name, company, state})){
            res.status(400).send(
                buildResponse<any>(APIResponseStatus.ERROR).toJSON()
            )
            return
        }
        res.send(
            buildResponse<any>(APIResponseStatus.SUCCESS).toJSON()
        )
    }
}

export default route;