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
