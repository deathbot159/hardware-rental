import {Request, Response} from "express";

export type RouteMethods = "GET" | "POST" | "PUT" | "DELETE";
export type RouteController = Pick<Route, "handleGet" | "handlePost" | "handlePut" | "handleDelete">

export default interface Route {
    fileName: string;
    route: string;
    methods: RouteMethods[];
    disabled: boolean;
    handleGet?: (req: Request, res: Response) => void;
    handlePost?: (req: Request, res: Response) => void;
    handlePut?: (req: Request, res: Response) => void;
    handleDelete?: (req: Request, res: Response) => void;
}