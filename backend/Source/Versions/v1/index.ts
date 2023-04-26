import {Router} from "express";
import fs from "fs";
import path from "path";
import routes from "../../routes.json";
import ApiVersion from "../../Helpers/ApiVersion";
import Route from "../../Helpers/Route";


let version: ApiVersion = {
    name: "v1",
    routes: [],
    expose(): Router {
        let router = Router();
        //#region Load routes
        let routesFiles = fs.readdirSync(path.join(__dirname, "Routes"));
        if (this.name in routes) {
            let version = (routes as any)[this.name];
            for (let route of Object.keys(version)) {
                let routeHandlerFile = routesFiles.find(n => n.toLowerCase().slice(0, -3) == (version[route].fileName).toLowerCase());
                if (!routeHandlerFile) {
                    console.log(`  -> ❌ [${this.name}] Cannot find handler for route ${route}.`);
                    continue;
                }
                let file = ((require(path.join(__dirname, "Routes", routeHandlerFile)).default) as Route);
                for (let method of (version as any)[route]["methods"] as string[]) {
                    let problem = false;
                    let r = (version as any)[route] as Route;
                    if (r.disabled) {
                        console.log(`  -> ❗ [${this.name}${route}] Route is disabled.`);
                        continue;
                    }
                    r.route = route;
                    switch (method) {
                        case "GET":
                            if (!file.handleGet) {
                                console.log(`  -> ❌ [${this.name}${r.route} for ${method}] Method specified but cannot find handler.`)
                                problem = true;
                                break;
                            }
                            r.methods = ["GET"];
                            r.handleGet = file.handleGet;
                            router.get(r.route, r.handleGet);
                            break;
                        case "POST":
                            if (!file.handlePost) {
                                console.log(`  -> ❌ [${this.name}${r.route} for ${method}] Method specified but cannot find handler.`)
                                problem = true;
                                break;
                            }
                            r.methods = ["POST"];
                            r.handlePost = file.handlePost;
                            router.post(r.route, r.handlePost);
                            break;
                        case "PUT":
                            if (!file.handlePut) {
                                console.log(`  -> ❌ [${this.name}${r.route} for ${method}] Method specified but cannot find handler.`)
                                problem = true;
                                break;
                            }
                            r.methods = ["PUT"];
                            r.handlePut = file.handlePut;
                            router.put(r.route, r.handlePut);
                            break;
                        case "DELETE":
                            if (!file.handleDelete) {
                                console.log(`  -> ❌ [${this.name}${r.route} for ${method}] Method specified but cannot find handler.`)
                                problem = true;
                                break;
                            }
                            r.methods = ["DELETE"];
                            r.handleDelete = file.handleDelete;
                            router.delete(r.route, r.handleDelete);
                            break;
                        default:
                            console.log(`  -> ❌ [${this.name}${r.route}] Invalid route method ${method}. Skipping...`);
                            problem = true;
                    }
                    if (!problem) {
                        this.routes.push(r);
                        console.log(`  -> ✅ [${method} ${this.name}${r.route}] Route assigned.`);
                    }
                }
            }
            console.log(`  -> ✅ [${this.name}] Loaded ${this.routes.length} route/s.`);
        }
        //#endregion
        //#region Middlewares
        router.use(require("../../Middlewares/404").default);
        //#endregion
        return router;
    }
}

export default version;