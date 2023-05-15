import cdg from "../../../Config"
import jwt from "jsonwebtoken";
import AccountDTO from "../../../DTOs/AccountDTO";


namespace TokenService {
    export function untokenize(token: string): Pick<AccountDTO, "id"> {
        try {
            jwt.verify(token, cdg.authTokens.secret);
            const d = jwt.decode(token) as jwt.JwtPayload
            if (new Date().getTime() >= d.exp! * 1000 || !d.id) throw Error();
            return {id: d.id};
        } catch (err) {
            return {id: ""};
        }
    }
}

export default TokenService;