import {Router} from "express";

export default Router().use((req, res) => {
    res.status(404)
        .send({message: "Invalid request."});
});