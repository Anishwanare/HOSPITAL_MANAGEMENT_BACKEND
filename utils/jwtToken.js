import jwt from "jsonwebtoken";

export const generateToken = (user, message, statusCode, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });

  const cookieName = user.role === "Admin" ? "adminToken" : "patientToken";

  res.cookie(cookieName, token, {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
    secure: true, // Ensures the cookie is only sent over HTTPS
    sameSite: "strict", // Restricts the cookie to same-site requests by default,
  });
  res.status(statusCode).json({
    status: true,
    message: message,
    user: user,
    token: token,
  });
};
