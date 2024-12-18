import { Router } from "express";
import passport from "passport";
const router = Router();

router.get("/login/success", (req, res) => {
    // console.log("User in session:", req.user);
    if (req.user) {
        res.status(200).json({
            error: false,
            message: "Successfully Loged In",
            user: req.user,
        });
    } else {
        res.status(403).json({ error: true, message: "Not Authorized" });
    }
});

router.get("/login/failed", (req, res) => {
    res.status(401).json({
        error: true,
        message: "Log in failure",
    });
});

router.get("/google", passport.authenticate("google", ["profile", "email"]));

router.get(
    "/google/callback",
    passport.authenticate("google", {
        successRedirect: "https://trendy-cart-murex.vercel.app/users/home",
        failureRedirect: "/login/failed",
    })
);

router.get("/logout", (req, res) => {
    req.logout();
    res.clearCookie("session"); // Clear the session cookie
    res.clearCookie("session.sig");
    res.redirect(process.env.CLIENT_URL);
});

export default router;
