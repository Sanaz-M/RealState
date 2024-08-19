import { Request, Response } from "express";
import jwt from "jsonwebtoken";

interface CustomRequest extends Request {
  userId?: string;
}

export const shouldBeLoggedIn = async (req: CustomRequest, res: Response) => {
  console.log(req.userId);

  res.status(200).json({ message: "You are Authenticated!" });
};

export const shouldBeAdmin = async (req: Request, res: Response) => {};
