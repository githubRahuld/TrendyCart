import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import passport from "passport";
import cookieSession from "cookie-session";
import cookieParser from "cookie-parser";
import "./passport.js";
import fileUpload from "express-fileupload";

const app = express();

dotenv.config({ path: "./.env" });

app.use(
    cookieSession({
        name: "session",
        keys: ["cyberwolve"],
        maxAge: 24 * 60 * 60 * 100,
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(
    cors({
        origin: ["https://trendy-cart-murex.vercel.app"],
        methods: "GET,POST,PUT,DELETE,PATCH",
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization"], 
    })
);

app.use(cookieParser());
app.use(express.json({ limit: "16kb" }));

app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use(express.static("public"));

app.use(fileUpload());

// import routes
import authRoutes from "./routes/auth.routes.js";
import googleRoutes from "./routes/googleAuth.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import productRoutes from "./routes/product.routes.js";
import addressRoutes from "./routes/address.routes.js";
import orderRoutes from "./routes/order.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import paymentRoutes from "./routes/payment.routes.js";

app.use("/auth", googleRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/address", addressRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/payment", paymentRoutes);

export { app };
