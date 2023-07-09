import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { createToken, extractTokenFromCookies } from "../utils/token.js";
import { getDb } from "../utils/db.js";

const clientID = process.env.CLIENT_ID;
const JWT_SECRET = process.env.JWT_SECRET;
const COL = "user";
const client = new OAuth2Client(clientID);

// google login
export const glogin = async (request, response) => {
	console.log("Verifying User...");
	try {
		const ticket = await client.verifyIdToken({
			idToken: request.body.info,
			requiredAudience: clientID,
			// required: clientID,
		});
		const payload = ticket.getPayload();
		// check if user exists in database, confirm role and log in with role

		const token = createToken(payload.sub, "user");
		response.cookie("token", token, {
			secure: true,
			httpOnly: true,
			sameSite: "None",
		});

		const user = {
			email: payload.email,
			fname: payload.given_name,
			lname: payload.family_name,
			pic: payload.picture,
		};
		response.status(200).json(user);
	} catch (error) {
		console.log("Could not verify user", error);
	}
};

// regular login
export const login = async (request, response) => {
	console.log("LOGIN", request.email, request.pwd);
	// check if database has a user with the email and password
	// if true create token
	const db = await getDb();
	try {
		let result = await db
			.collection(COL)
			.findOne({ email: request.email, pwd: request.pwd });
		console.log(result);
		response.json({message:})
	} catch (error) {
		console.log("Could not log in ");
	}
};

// logout route
export const logout = async (_, response) => {
	response.clearCookie("token").sendStatus(200);
};

export const authenticate = (request, response) => {
	try {
		const token = extractTokenFromCookies(request);
		const userClaims = jwt.verify(token, JWT_SECRET);
		request.userClaims = userClaims;
		response.status(200).json(userClaims);
	} catch (error) {
		response.status(401).end();
	}
};

const checkMail = async (email) => {
	const db = await getDb();
	const user = await db.collection(COL).findOne({ email });
	if (user == null) {
		return true;
	} else {
		return false;
	}
};

export const register = async (request, response) => {
	console.log(request.body);
	request.body.role = "user";
	if (await checkMail(request.body.email)) {
		const db = await getDb();
		const result = await db.collection(COL).insertOne(request.body);
		response.json({ message: "You successfully registered" });
	} else {
		return response
			.status(400)
			.json({ message: "Sorry but this email is already in use" });
	}
};
