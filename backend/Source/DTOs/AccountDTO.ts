import AuthorityLevel from "../Helpers/AuthorityLevel";

export default interface AccountDTO {
    id: string,
    email: string,
    password: string,
    authority: AuthorityLevel,
    name: string,
    avatar: string,
    verified: boolean
}