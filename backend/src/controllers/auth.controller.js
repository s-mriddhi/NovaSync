import { registerUserService, loginUserService } from "../services/auth.service.js";

export const registerUser = async (req, res, next) => {
  try {
    const data = await registerUserService(req.body);
    res.status(201).json({ success: true, user: data });
  } catch (err) {
    next(err);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const data = await loginUserService(req.body);
    res.status(200).json({ success: true, ...data });
  } catch (err) {
    next(err);
  }
};
