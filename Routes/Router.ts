import cartController from "../Controllers/cart.controller";
import manageCategoryController from "../Controllers/Manage/manage.category.controller";
import manageProductController from "../Controllers/Manage/manage.product.controller";
import manageStoreAddressController from "../Controllers/Manage/manage.storeAddress.controller";
import orderController from "../Controllers/order.controller";
import returnController from "../Controllers/return.controller";
import storeController from "../Controllers/store.controller";
import userController from "../Controllers/user.controller";
import { Express } from "express";


const MapControllers = (app: Express) => {
    app.use('/api/manage/category', manageCategoryController);
    app.use('/api/manage/product', manageProductController);
    app.use('/api/manage/storeAddress', manageStoreAddressController);

    app.use('/api/cart', cartController);
    app.use('/api/order', orderController);
    app.use('/api/return', returnController);
    app.use('/api', storeController);
    app.use('/api', userController);
}

export default MapControllers;