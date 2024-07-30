import { Request, Response } from 'express';
import bcrypt from "bcrypt";
import prisma from '../lib/prisma';

export const register = async (req: Request, res: Response) => {
    const {username, email, password} = req.body;
    
    //Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);

    //Create a new user
    const newUser = await prisma.user.create({
        data: {
            username, 
            email, 
            password: hashedPassword
        }
    })

    console.log(newUser)
};

export const login = (req: Request, res: Response) => {
    // Your implementation here
};

export const logout = (req: Request, res: Response) => {
    // Your implementation here
};
