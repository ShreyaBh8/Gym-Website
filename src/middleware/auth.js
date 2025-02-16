const jwt = require("jsonwebtoken");
const Member = require("../models/members");

const auth = async (req, res, next) => {
    try {
        const cookieToken = req.cookies.jwt;

        if (!cookieToken || typeof cookieToken !== 'string' || !cookieToken.trim()) {
            res.clearCookie("jwt"); // Clear any invalid token
            return res.render('index', { login: 'Login', isAuthenticated: false });
        }

        const verifyUser = jwt.verify(cookieToken, process.env.SECRET_KEY);
        const user = await Member.findOne({ _id: verifyUser._id });

        if (!user) {
            res.clearCookie("jwt"); // Clear token if user is not found
            return res.render('index', { login: 'Login', isAuthenticated: false });
        }

        req.token = cookieToken;
        req.user = user;
        next();
    } catch (e) {
        res.clearCookie("jwt"); // Clear token if verification fails
        return res.render('index', { login: 'Login', isAuthenticated: false });
    }
};

module.exports = auth;
