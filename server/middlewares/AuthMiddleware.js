const { verify } = require("jsonwebtoken");

const validateToken = (req, res, next) => {
  const accessToken = req.header("accessToken");

  if (!accessToken) return res.status(401).json({ error: "El usuario no está logeado!" });

  try {
    const validToken = verify(accessToken, "importantsecret");
    req.user = validToken;

    if (validToken) {
      return next();
    }
  } catch (err) {
    return res.status(403).json({ error: "Token inválido" });
  }
};

module.exports = { validateToken };
