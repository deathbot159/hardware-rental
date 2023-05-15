import {RouteController} from "../../../Helpers/Route";
import buildResponse from "../Response";
import APIResponseStatus from "../../../Helpers/APIResponseStatus";
import TokenService from "../Services/TokenService";

const route: RouteController = {
    handlePost(req, res) {
        const data = TokenService.untokenize(req.body.token);
        res.send(
            buildResponse(data.id == "" ? APIResponseStatus.INVALID_TOKEN : APIResponseStatus.SUCCESS)
        )
    }
}

export default route;