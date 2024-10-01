import 'dotenv/config';
import {type NextFunction, type Request, type Response} from 'express';
import { clerkClient, clerkMiddleware, getAuth} from '@clerk/express';
import { PrismaClient } from '@prisma/client';
import cors from "cors";

const prisma = new PrismaClient();

const express = require('express');


const app = express();
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());
app.use(identifyUserMiddleware);

async function identifyUserMiddleware(req: Request, res: Response, next: NextFunction) {
    const { userId } = getAuth(req);

    const clerkUser = await clerkClient.users.getUser(userId);
    let user = await prisma.user.findUnique({
        where:{
            clerkId:userId
        }
    });

    if (!user){
        user = await prisma.user.create({
            data: {
                name: clerkUser.username,
                clerkId: userId
            }
        });
    };

    req.user = user;
    next();

};

app.post('/changeName', async (req:Request, res:Response) => {
  const { userId } = getAuth(req);

  const newUsername = req.body.user.name;
  console.log(newUsername);

  const user = await clerkClient.users.getUser(userId);

  await clerkClient.users.updateUser(userId,{username:newUsername});
  await prisma.user.update({
    where:{
        clerkId:userId,
    },
    data: {
        name: newUsername,
    }
  });

  return res.json({ user });
});


app.listen(3000, () => {
  console.log(`Example app listening at http://localhost:${3000}`);
});