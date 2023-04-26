import {authTokens} from "../../../Config.json"
import jwt from "jsonwebtoken";
import AccountDTO from "../../../DTOs/AccountDTO";


namespace TokenService {
    export function untokenize(token: string): Pick<AccountDTO, "id"> {
        try {
            jwt.verify(token, authTokens.secret);
            let d = jwt.decode(token) as jwt.JwtPayload
            if (new Date().getTime() >= d.exp! * 1000 || d.id == null) throw Error();
            return {id: d.id};
        } catch (err) {
            return {id: ""};
        }
    }
}

export default TokenService;