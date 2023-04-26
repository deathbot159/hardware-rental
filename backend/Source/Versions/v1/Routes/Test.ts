import {RouteController} from "../../../Helpers/Route";
import buildResponse from "../Response";
import APIResponseStatus from "../../../Helpers/APIResponseStatus";

let route: RouteController = {
    handleGet(req, res) {
        res.send(
            buildResponse<any>(APIResponseStatus.SUCCESS, "Git").toJSON()
        )
    }
}

export default route;