import manageCategoryController from "../Controllers/Manage/manage.category.controller";
import manageProductController from "../Controllers/Manage/manage.product.controller";
import storeController from "../Controllers/store.controller";
import userController from "../Controllers/user.controller";
import { Express } from "express";


const MapControllers = (app: Express) => {
    app.use('/api/manage/product', manageProductController);
    app.use('/api/manage/category', manageCategoryController);
    
    app.use('/api', storeController);
    app.use('/api', userController);
}

export default MapControllers;