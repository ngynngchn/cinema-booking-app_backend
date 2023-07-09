import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export const createToken = (userID, role) => {
	const payload = {
		sub: userID,
		role: role,
	};
	const token = jwt.sign(payload, JWT_SECRET, {
		expiresIn: "1h",
		algorithm: "HS256",
	});

	return "Bearer " + token;
};

// Verify a token and return the decoded payload
export const verifyToken = (token) => {
	// Verify the token using the same secret key used to sign the token
	const result = jwt.verify(token, JWT_SECRET);
	// Return the decoded payload
	return result;
};

export const extractTokenFromCookies = (req) => {
	const [tokenStrategy, token] = req.cookies["token"].split(" ");
	if (tokenStrategy !== "Bearer" || !token) {
		throw new Error("No Tokenstrategy or no token");
	}
	return token;
};
