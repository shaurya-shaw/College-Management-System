export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "user not found" });
      }
      if (!allowedRoles.includes(req.user.role)) {
        return res
          .status(403)
          .json({ message: "unauthorized to access this resource" });
      }
      next();
    } catch (error) {
      console.log(error);

      return res
        .status(403)
        .json({ message: "unauthorized to access this resource" });
    }
  };
};
