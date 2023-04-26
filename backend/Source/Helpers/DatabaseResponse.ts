export enum DatabaseResponseStatus {
    DB_ERROR = -1,
    SUCCESS,
    NO_RESULTS
}

export interface DatabaseResponse<T> {
    status: DatabaseResponseStatus,
    fromCache?: boolean,
    data?: T
}

