import TokenService from "./TokenService";

namespace RouteService {
    export function checkToken(token: string | undefined): string | null {
        if (!token) return null
        const tokenData = TokenService.untokenize(token);
        if (tokenData.id === "") return null
        return tokenData.id;
    }
}

export default RouteService;