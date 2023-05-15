import express from "express";
import cors from "cors";
import morgan from "morgan"
import fs from "fs";
import path from "path";
import Routes from "./Routes"
import ApiVersion from "./Helpers/ApiVersion";
import helmet from "helmet";

//#region Variables
const app: express.Express = express()
const defaultRoute: string = "/api/";
const versions: ApiVersion[] = [];
const port: number = +(process.env.PORT || 1234);
//#endregion

//#region Settings
app.use(morgan("dev"))
app.use(cors())
app.use(helmet())
app.use(express.json());
app.disable('x-powered-by')
//#endregion

//#region Methods
const loadVersions = () => {
    const versionsPath = path.join(__dirname, "Versions");
    const versionsDir = fs.readdirSync(versionsPath);
    if (versionsDir.length == 0) return false;
    for (let name of versionsDir) {
        if (!(name in Routes)) {
            console.log(`=> ❌ Cannot find version "${name}" in routes.json. Exiting...`);
            return false;
        }
        const entry = fs.statSync(path.join(versionsPath, name))
        if (entry.isDirectory()) {
            if (!fs.readdirSync(path.join(versionsPath, name)).find(n => n.includes("index"))) {
                console.log(`=> ❌ Cannot find index file for version "${name}".`);
                return false;
            }
            const version = (require(path.join(versionsPath, name, "index")).default) as ApiVersion;
            versions.push(version);
            app.use(`${defaultRoute}${version.name}`, version.expose());
            console.log(`  -> ✅ [${version.name}] Version exposed.`);
        } else return false;

    }
    return true;
}
//#endregion

//#region Load versions
console.log("=> ❔ Loading versions.");
if (!loadVersions()) {
    console.log("=> ❌ Failed to load versions.");
    process.exit(1);
}
console.log(`=> ✅ Loaded ${versions.length} versions/s.`);
//#endregion

//#region Middlewares
app.use(require("./Middlewares/404").default);
//#endregion

app.listen(port, () => {
    console.log(`=> 👍 API listening on port ${port}`);
});
