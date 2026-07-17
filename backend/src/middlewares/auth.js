import jwt from 'jsonwebtoken';

// Verify JWT token
export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

// Verify customer role
export const verifyCustomer = (req, res, next) => {
  if (req.user?.role !== 'customer') {
    return res.status(403).json({ success: false, message: 'Access denied' });
  }
  next();
};

// Verify admin role
export const verifyAdmin = (req, res, next) => {
  if (!['super_admin', 'manager'].includes(req.user?.role)) {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }
  next();
};

// Verify super admin role
export const verifySuperAdmin = (req, res, next) => {
  if (req.user?.role !== 'super_admin') {
    return res.status(403).json({ success: false, message: 'Super admin access required' });
  }
  next();
};
