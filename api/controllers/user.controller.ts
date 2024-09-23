import { Request, Response } from "express";
import prisma from "../lib/prisma";
import bcrypt from "bcrypt";

interface CustomRequest extends Request {
  userId?: string;
}

export const getUsers = async (req: CustomRequest, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get users!" });
  }
};

export const getUser = async (req: CustomRequest, res: Response) => {
  const id = req.params.is;
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get user!" });
  }
};

export const updateUser = async (req: CustomRequest, res: Response) => {
  const id = req.params.is;
  const tokenUserId = req.userId;
  const { password, avatar, ...inputs } = req.body;
  let updatedPassword = null;

  if(id !== tokenUserId) {
    return res.status(403).json({message: "Not Authorised!"});
  }


  try {
    if(password) {
        updatedPassword = await bcrypt.hash(password, 10)
    }
    const updatedUser =  await prisma.user.update({
        where: {id},
        data: {
            ...inputs,
            ...(updatedPassword && { password: updatedPassword }),
            ...(avatar && { avatar }),
          },
    });
    res.status(200).json(updatedUser);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to update user!" });
  }
};

export const deleteUser = async (req: CustomRequest, res: Response) => {
  const id = req.params.is;
  const tokenUserId = req.userId;
  
  if(id !== tokenUserId) {
    return res.status(403).json({message: "Not Authorised!"});
  }

  try {
    await prisma.user.delete({
        where: {id}
    });
    res.status(200).json({message: "User deleted!"});
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to delete users!" });
  }
};
