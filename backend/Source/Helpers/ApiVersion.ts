import {Router} from "express";
import Route from "./Route";

export type Routes = Array<Route>;

export default interface ApiVersion {
    name: string;
    routes: Routes;
    expose: () => Router;
}