import connectDB from "./db/index.js";
import { app } from "./app.js";

connectDB()
    .then(() => {
        app.listen(process.env.PORT || 4000, () => {
            console.log(`SERVER is listening on PORT: ${process.env.PORT}`);
        });
    })
    .catch((err) => {
        console.log("MONGODB connection failed !! ", err);
    });
