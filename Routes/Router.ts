import userController from "../Controllers/user.controller";
import { Express } from "express";


const MapControllers = (app: Express) => {
    app.use('/api', userController);
}

export default MapControllers;