import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { createToken } from "../utils/token.js";

const clientID = process.env.CLIENT_ID;
const JWT_SECRET = process.env.JWT_SECRET;
const client = new OAuth2Client(clientID);

export const login = async (request, response) => {
	console.log("Verifying User...");
	try {
		const ticket = await client.verifyIdToken({
			idToken: request.body.info,
			requiredAudience: clientID,
			// required: clientID,
		});
		const payload = ticket.getPayload();

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

const extractTokenFromCookies = (req) => {
	const [tokenStrategy, token] = req.cookies["token"].split(" ");
	if (tokenStrategy !== "Bearer" || !token) {
		throw new Error("No Tokenstrategy or no token");
	}
	return token;
};
