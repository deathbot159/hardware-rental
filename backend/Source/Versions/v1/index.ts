import {Router} from "express";
import fs from "fs";
import path from "path";
import Routes from "../../Routes"
import ApiVersion from "../../Helpers/ApiVersion";
import Route, {RouteMethods} from "../../Helpers/Route";

const version: ApiVersion = {
    name: "v1",
    routes: [],
    expose(): Router {
        const router = Router();
        //#region Load routes
        const routes = fs.readdirSync(path.join(__dirname, "Routes")).map(n=>n = n.slice(0, -3));
        if (!(this.name in Routes)) return router;
        const routesSettings =
            Routes[this.name as keyof typeof Routes];
        for (const routeName of Object.keys(routesSettings)){
            const {disabled, fileName, methods} =
                routesSettings[routeName as keyof typeof routesSettings];
            if(disabled){
                console.log(`  -> ❗ [${this.name}${routeName}] Route is disabled.`);
                continue;
            }
            if(methods.length === 0){
                console.log(`  -> ❗ [${this.name}${routeName}] No methods defined.`);
                continue;
            }
            const routeController =
                routes.find(n => n === fileName);
            if (!routeController) {
                console.log(`  -> ❌ [${this.name}] Cannot find handler for route ${routeName}.`);
                continue;
            }
            const controller =
                {...(require(path.join(__dirname, "Routes", routeController)).default) as Route,
                    route: routeName, disabled: disabled, methods: methods as RouteMethods[]};
            
            let handlers = {"GET": "handleGet", "POST": "handlePost", "PUT": "handlePut", "DELETE": "handleDelete"}
            let problem = false
            controller.methods.forEach(method=>{
                if(!controller[handlers[method as keyof typeof handlers] as keyof typeof controller]){
                    problem = true;
                    console.log(`  -> ❌ [${this.name}${controller.route} for ${method}] Method specified but cannot find handler.`)
                    return;
                }
                const {route, handleGet, handlePost, handlePut, handleDelete} = controller;
                switch(method){
                    case "GET":
                        router.get(route, handleGet!)
                        break;
                    case "POST":
                        router.post(route, handlePost!)
                        break;
                    case "PUT":
                        router.put(route, handlePut!)
                        break;
                    case "DELETE":
                        router.delete(route, handleDelete!)
                        break;
                }
            })
            if (!problem) {
                this.routes.push(controller);
                console.log(`  -> ✅ [${methods.join(" ,")} ${this.name}${controller.route}] Route assigned.`);
            }
        }
        //#endregion
        //#region Middlewares
        router.use(require("../../Middlewares/404").default);
        //#endregion
        return router;
    }
}

export default version;