import {RouteController} from "../../../Helpers/Route";
import buildResponse from "../Response";
import APIResponseStatus from "../../../Helpers/APIResponseStatus";
import AccountService from "../Services/AccountService";
import {DatabaseResponseStatus} from "../../../Helpers/DatabaseResponse";
import cfg from "../../../Config";
import jwt from "jsonwebtoken";
import RedisHelper from "../../../Helpers/RedisHelper";

const route: RouteController = {
    async handlePost(req, res) {
        const {email, password}: { email: string, password: string } = req.body;

        if ((!email || !password)) {
            res.status(400).send(
                buildResponse(APIResponseStatus.INVALID_CREDENTIALS, "Invalid/No data provided.").toJSON()
            )
            return;
        }
        if (!email.match(/^[a-zA-Z0-9._%+-]+@qarbon\.it$/) || !password.match(/^[0-9a-fA-F]{128}$/)) {
            res.status(400).send(
                buildResponse(APIResponseStatus.INVALID_CREDENTIALS, "Invalid data provided.").toJSON()
            )
            return
        }
        switch ((await AccountService.CheckAccount(email, password)).status) {
            default:
            case DatabaseResponseStatus.DB_ERROR:
                res.status(500).send(
                    buildResponse(APIResponseStatus.ERROR, "Internal server error.").toJSON()
                )
                return;
            case DatabaseResponseStatus.NO_RESULTS:
                res.status(400).send(
                    buildResponse(APIResponseStatus.INVALID_CREDENTIALS, "Invalid credentials provided.").toJSON()
                )
                return;
            case DatabaseResponseStatus.SUCCESS:
                const dbResp = await AccountService.GetAccount(email, password);
                if (dbResp.status == DatabaseResponseStatus.NO_RESULTS || dbResp.status == DatabaseResponseStatus.DB_ERROR) {
                    res.status(500).send(
                        buildResponse(APIResponseStatus.ERROR, "Internal server error.").toJSON()
                    )
                    return;
                }
                const token = jwt.sign({id: dbResp.data.id}, cfg.authTokens.secret, {expiresIn: cfg.authTokens.tokenLifetime})
                if (await RedisHelper.setAccount(email, dbResp.data))
                    res.send(
                        buildResponse<AuthorizeResponse>(APIResponseStatus.SUCCESS, "", dbResp.fromCache, {token: token}).toJSON()
                    )
                else {
                    res.status(500).send(
                        buildResponse(APIResponseStatus.ERROR, "Internal server error.").toJSON()
                    )
                }
                return;
        }
    }
}

interface AuthorizeResponse {
    token: string
}

export default route;