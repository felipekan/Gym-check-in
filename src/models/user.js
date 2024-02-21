import { PrismaClient } from '@prisma/client';
import date from 'date-and-time';

const prisma = new PrismaClient();

export class UserModel {
  static async create({ input }) {
    const { name, phone, email, subscription, coupon } = input;

    if (!subscription && !coupon) {
      return await prisma.user.create({
        data: {
          name,
          phone,
          email,
        },
      });
    }

    if (subscription) {
      const validTo = date.addMonths(new Date(), subscription);
      return await prisma.user.create({
        data: {
          name,
          phone,
          email,
          subscription: { create: { expires: validTo } },
        },
      });
    }

    if (coupon) {
      return await prisma.user.create({
        data: {
          name,
          phone,
          email,
          coupon: { create: {} },
        },
      });
    }
  }

  static async checkIn({ phone }) {
    const user = await prisma.user.findUnique({
      where: { phone },
      select: {
        name: true,
        subscription: { select: { expires: true } },
        coupon: { select: { id: true, passes: true } },
      },
    });

    if (user.subscription) {
      user.subscription = user.subscription[user.subscription.length - 1];
    }
    if (user.coupon) {
      //TODO: no restar el mismo dia.
      user.coupon.passes -= 1;
      await prisma.coupon.update({
        where: { id: user.coupon.id },
        data: { passes: user.coupon.passes },
      });
    }
    return user;
  }

  static async subPaid({ phone, expires }) {
    if (!expires) {
      expires = date.addMonths(new Date(), 1);
    }
    const user = await prisma.user.update({
      where: { phone },
      data: { subscription: { create: { expires: expires } } },
      select: { subscription: true },
    });
    return user.subscription;
  }
}
