const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    const mode = (process.env.APP_MODE || 'multi-role').toLowerCase();
    if (mode === 'admin-only') {
      return next();
    }

    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: insufficient role' });
    }
    next();
  };
};

module.exports = { authorizeRoles };
