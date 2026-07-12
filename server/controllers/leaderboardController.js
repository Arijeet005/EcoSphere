import prisma from '../config/db.js';

export const getLeaderboard = async (req, res, next) => {
  try {
    const limit = Number(req.query.limit || 10);
    const departmentId = req.query.departmentId ? Number(req.query.departmentId) : undefined;

    const employees = await prisma.user.findMany({
      where: {
        role: 'EMPLOYEE',
        ...(departmentId ? { departmentId } : {}),
      },
      select: {
        id: true,
        name: true,
        email: true,
        departmentId: true,
        xp: true,
        department: { select: { id: true, name: true } },
      },
      orderBy: [{ xp: 'desc' }, { name: 'asc' }],
      take: limit,
    });

    return res.json({
      success: true,
      data: employees.map((employee, index) => ({
        rank: index + 1,
        ...employee,
      })),
    });
  } catch (error) {
    return next(error);
  }
};
