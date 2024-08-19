import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma";
import { userInfo } from "os";

/** Register */
export const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  try {
    //Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);

    //Create a new user
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    console.log(newUser);

    res.status(201).json({ message: "User created successfully!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to create user!" });
  }
};

/** Login */
export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    //Check If the user exists
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) return res.status(401).json({ message: "Invalid Credentials!" });

    //Check if the password is correct
    const isPassValid = await bcrypt.compare(password, user.password);
    if (!isPassValid)
      return res.status(401).json({ message: "Invalid Credentials!" });

    //Generate cookie token and send to user
    const secretKey = process.env.JWT_SECRET_KEY;
    if (!secretKey) {
      throw new Error(
        "JWT_SECRET_KEY is not defined in the environment variables"
      );
    }

    const { password: userPassword, ...userInfo } = user;

    const age = 1000 * 60 * 60 * 24 * 7;

    const token = jwt.sign(
      {
        id: user.id,
        isAdmin: true,
      },
      secretKey,
      { expiresIn: age }
    );

    res
      .cookie("token", token, {
        httpOnly: true,
        // secure: true //Because we are in the development mode and using localhost can't use this
      })
      .status(200)
      .json({ message: "Login succeessful" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to login!" });
  }
};

/** Logout */
export const logout = (req: Request, res: Response) => {
  res.clearCookie("token").status(200).json({ message: "Logout succeessful" });
};
