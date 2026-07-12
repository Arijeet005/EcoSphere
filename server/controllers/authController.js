import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../config/db.js';

const signToken = (user) =>
  jwt.sign(
    {
      userId: user.id,
      role: user.role,
      departmentId: user.departmentId,
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' },
  );

export const register = async (req, res, next) => {
  try {
    const { name, email, password, role, departmentId } = req.body;
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: role || 'EMPLOYEE',
        departmentId: departmentId ? Number(departmentId) : null,
      },
      select: { id: true, name: true, email: true, role: true, departmentId: true },
    });

    const token = signToken(user);
    res.status(201).json({ success: true, token, user });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = signToken(user);
    const safeUser = { id: user.id, name: user.name, email: user.email, role: user.role, departmentId: user.departmentId };
    res.json({ success: true, token, user: safeUser });
  } catch (error) {
    next(error);
  }
};
