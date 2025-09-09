import { VERSION } from "../config/default.js";
import shoeRouter from "./shoe.routes.js";
import searchRouter from "./search.routes.js";
import favoritesRouter from "./favorites.routes.js";
import userInfoRouter from "./userInfo.routes.js";
import paymentRouter from "./payment.routes.js";
export const routes = (app) => {
    //Health check
    app.get("/health", (req, res) => {
        res.send({
            status: "OK",
            version: VERSION,
            timestamp: new Date().toISOString(),
        });
    });
    // Other routes
    app.use(`/api/${VERSION}/shoes`, shoeRouter);
    app.use(`/api/${VERSION}/search`, searchRouter);
    app.use(`/api/${VERSION}/favorites`, favoritesRouter);
    app.use(`/api/${VERSION}/userInfo`, userInfoRouter);
    app.use(`/api/${VERSION}/payments`, paymentRouter);
};
