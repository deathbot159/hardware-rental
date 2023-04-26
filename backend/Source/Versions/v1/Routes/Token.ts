import {RouteController} from "../../../Helpers/Route";
import buildResponse from "../Response";
import APIResponseStatus from "../../../Helpers/APIResponseStatus";
import TokenService from "../Services/TokenService";

let route: RouteController = {
    handlePost(req, res) {
        const {token} = req.body;
        let data = TokenService.untokenize(token);
        res.send(
            buildResponse<any>(data.id == "" ? APIResponseStatus.INVALID_TOKEN : APIResponseStatus.SUCCESS)
        )
    }
}

export default route;