import { OAuth2Client } from "google-auth-library";
import { createToken } from "../utils/token.js";
import { getDb } from "../utils/db.js";

const clientID = process.env.CLIENT_ID;
const COL = "user";
const client = new OAuth2Client(clientID);
const options = { secure: true, httpOnly: true, sameSite: "None" };

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
		response.cookie("token", token, options);

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
	const db = await getDb();
	console.log(request.body);
	try {
		let result = await db
			.collection(COL)
			.findOne({ email: request.body.email, password: request.body.password });

		const token = createToken(result._id, result.role);
		response.cookie("token", token, options);

		response.status(200).json({ message: "Successfully logged in" });
	} catch (error) {
		console.log("Could not log in ");
	}
};

// logout route
export const logout = async (_, response) => {
	response.clearCookie("token").sendStatus(200);
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

export const admin = async (request, response) => {
	if (request.userClaims.role === "admin") {
		response.sendStatus(200);
	} else {
		response.sendStatus(401);
	}
};
export const user = async (request, response) => {
	if (
		request.userClaims.role === "user" ||
		request.userClaims.role === "admin"
	) {
		response.sendStatus(200);
	} else {
		response.sendStatus(401);
	}
};
