import { OAuth2Client } from "google-auth-library";
import { createToken } from "../utils/token.js";

const clientID = process.env.CLIENT_ID;
const client = new OAuth2Client(clientID);

export const login = async (request, response) => {
	console.log("Verifying User...");
	try {
		const ticket = await client.verifyIdToken({
			idToken: request.body.info,
			audience: clientID,
		});
		const payload = ticket.getPayload();
		console.log(payload);
		const token = createToken(payload.sub, "user");
		console.log(token);
		response.cookie("token", token, { secure: true, httpOnly: true });

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
	console.log("COOKIES", request.cookies);
	try {
		const token = extractTokenFromCookies(request);
		const userClaims = jwt.verify(token, process.env.JWT_SECRET);
		console.log(userClaims);
		// speichern der userclaims im request, damit wir im nachfolgenden controller zugriff auf die userclaims, wie die userId, haben.
		request.userClaims = userClaims;
		response.status(200);
	} catch (error) {
		response.status(401).end();
	}
};

const extractTokenFromCookies = (req) => {
	const [tokenStrategy, token] = req.cookies["token"].split(" ");
	// returnwert vom split: ["Bearer", "dsfhkajsfdhjk.fdsahkjfdsahjk"]
	console.log(token, tokenStrategy);
	if (tokenStrategy !== "Bearer" || !token) {
		throw new Error("No Tokenstrategy or no token");
	}
	return token;
};
