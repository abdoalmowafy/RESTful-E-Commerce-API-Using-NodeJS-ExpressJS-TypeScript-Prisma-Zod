import Express from "express";
import dotenv from "dotenv";
import cors from "cors";
import MapControllers from "./Routes/Router";

dotenv.config();
const app = Express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(Express.json());
MapControllers(app);

app.listen(PORT, () => {
  console.log(`Server running on: http://localhost:${PORT}`);
});