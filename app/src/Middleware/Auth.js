import JWT from "jsonwebtoken";


export const AuthCustomer = (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (!token) return res.status(403).send({ status: false, message: 'TOKEN is missing !!!' });

    let user = token.split(' ');

    JWT.verify(
      user[1],            // after splitting token will present in 1st index
      "-- assignment --",
      (error, decodedToken) => {
        if (error) return res.status(400).send({ status: false, message: error.message })
        req.userId = decodedToken.userId
        next();
      });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
}