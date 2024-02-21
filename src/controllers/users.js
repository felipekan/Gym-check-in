import { UserModel } from '../models/user.js';
import { validateUser, validatePartialUser } from '../schemas/users.js';

export class UserController {
  static async getAll(req, res) {
    const { name, phone, email } = req.params;
    try {
      const users = await UserModel.getAll({ name, phone, email });
      res.json(users);
    } catch (error) {
      res.status(400).json(error);
    }
  }

  static async getById(req, res) {
    const { id } = req.params;
    try {
      const user = await UserModel.getById({ id });
      res.json(user);
    } catch (error) {
      res.status(400).json(error);
    }
  }

  static async create(req, res) {
    const result = validateUser(req.body);
    if (result.error) {
      return res.status(400).json({ error: JSON.parse(result.error.message) });
    }
    try {
      const user = await UserModel.create({ input: result.data });
      res.json(user);
    } catch (error) {
      res.status(400).json(error);
    }
  }

  static async update(req, res) {
    const result = validatePartialUser(req.body);
    const { id } = req.params;
    if (result.error) {
      return res.status(400).json({ error: JSON.parse(result.error.message) });
    }
    try {
      const user = await UserModel.update({ id, input: result.data });
      res.json(user);
    } catch (error) {
      res.status(400).json(error);
    }
  }

  static async delete(req, res) {
    const { id } = req.params;
    try {
      const deleted = UserModel.delete({ id });
      if (deleted) return res.json({ message: 'User deleted' });
    } catch (error) {
      res.status(400).json(error);
    }
  }

  static async checkIn(req, res) {
    const result = validatePartialUser(req.body); //TODO: validate phone
    if (result.error) {
      return res.status(400).json({ error: JSON.parse(result.error.message) });
    }
    const user = await UserModel.checkIn({ phone: result.data.phone });
    return res.json(user);
  }

  static async subPaid(req, res) {
    //TODO validar expiress
    const { expires, phone } = req.body;
    const sub = await UserModel.subPaid({ phone, expires });
    res.json(sub);
  }
}
