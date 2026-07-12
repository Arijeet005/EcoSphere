export const authorizeRole = (...rolesInput) => (req, res, next) => {
  const allowedRoles = Array.isArray(rolesInput[0]) ? rolesInput[0] : rolesInput;

  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }
  next();
};
