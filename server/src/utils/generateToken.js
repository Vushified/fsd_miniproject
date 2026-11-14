import jwt from 'jsonwebtoken';

// Generate JSON Web Token (JWT) with user payload
export const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET || 'quickdrop_super_secret_jwt_key_2026_fsd',
    {
      expiresIn: process.env.JWT_EXPIRE || '30d',
    }
  );
};

