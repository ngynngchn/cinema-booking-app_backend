import { createHmac } from "crypto";
import { verifyToken } from "../utils/token.js";

export const encryptPassword = (req, _, next) => {
	console.log("Encrypting Password...");
	req.body.role = "user";
	delete req.body.cpwd;
	const hmac = createHmac("sha256", req.body.pwd);
	req.body.pwd = hmac.digest("hex");
	next();
};

// verify JWT stored in the token cookie of the incoming request
export const verifyJWTCookie = (req, res, next) => {
	// get token from the cookie
	// console.log(req.cookies.token);
	const token = req.cookies.token;
	try {
		// verify token using the verifyToken function from  token.js
		const claim = verifyToken(token);
		req.claim = claim;
		// Logs the claim to the console
		// console.log("OUR CLAIM:", request.claim);

		// pass control to the next middleware in the chain
		next();
	} catch (err) {
		// send  401 Unauthorized response if token is invalid
		console.error("verifyJWTC:", err.message);
		res.status(401).end();
		// res.redirect("/login");
	}
};

// Validate that the password and confirm password fields in the request body match
export const validatePassword = (req, res, next) => {
	const pwd = req.body.pwd;
	const cpwd = req.body.cpwd;

	// send 400 Bad Request response if the passwords do not match
	if (pwd !== cpwd) {
		return res.status(400).json({ message: "Passwords do not match" });
	}

	// pass control to the next middleware in the chain
	next();
};
