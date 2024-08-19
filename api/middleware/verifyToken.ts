import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface CustomRequest extends Request {
  userId?: string;
}

export const verifyToken = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Not Authenticated!" });

  const secretKey = process.env.JWT_SECRET_KEY;
  if (!secretKey) {
    throw new Error(
      "JWT_SECRET_KEY is not defined in the environment variables"
    );
  }

  jwt.verify(
    token,
    secretKey,
    async (err: Error | null, payload: jwt.JwtPayload | string | undefined) => {
      if (err) return res.status(403).json({ message: "Token is not valid!" });

      if (typeof payload === "object" && payload !== null && "id" in payload) {
        req.userId = (payload as jwt.JwtPayload).id as string; // Explicitly cast to string
      } else {
        return res.status(403).json({ message: "Token payload is invalid!" });
      }

      next();
    }
  );
};
