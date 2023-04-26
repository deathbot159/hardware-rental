import APIResponseStatus from "../../Helpers/APIResponseStatus";

export interface APIResponse<T> {
    status: APIResponseStatus,
    fromCache?: boolean,
    message?: string,
    data?: T
}

export class APIResponse<T> {
    constructor(status: APIResponseStatus, message?: string, fromCache?: boolean, data?: T) {
        this.status = status;
        this.message = message;
        this.data = data;
        this.fromCache = fromCache
    }

    public toJSON() {
        let builder: any = {};
        builder.status = this.status;
        this.fromCache ? builder.fromCache = this.fromCache : ""
        this.message ? builder.message = this.message : "";
        this.data ? builder.data = this.data : "";
        return builder;
    }
}

const buildResponse = <T>(status: APIResponseStatus, message?: string, fromCache?: boolean, data?: T): APIResponse<T> => {
    return new APIResponse<T>(status, message, fromCache, data);
};

export default buildResponse;