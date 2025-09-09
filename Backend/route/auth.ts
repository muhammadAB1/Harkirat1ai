import { Router } from "express";
import { sendEmail } from "../postmark.js";
import { CreateUser, Signin } from "../types.js";
import jwt from 'jsonwebtoken'
import { TOTP } from 'totp-generator'
import base32 from 'hi-base32'
import { PrismaClient } from "@prisma/client";
import { email } from "zod";

const router = Router();
const prismaClient = new PrismaClient()

router.post('/initiate_signin', async (req, res) => {
    try {
        const { success, data } = CreateUser.safeParse(req.body)

        if (!success) {
            res.status(411).send('Invalid Input');
            return
        }

        const { otp, expires } = TOTP.generate(base32.encode(data.email + process.env.JWT_SECRET!))
        // await sendEmail(data.email, 'Login to 1ai', `login to 1a your otp code is ${otp}`)
        console.log(otp)

        try {
            await prismaClient.user.create({
                data: {
                    email: data.email
                }
            })
        } catch (error) {
            console.log('User already exist')
        }

        res.json({
            message: 'Check your email',
            success: true
        })
    } catch (error) {
        console.log(error)
        res.json({
            message: 'Internal server error',
            success: false
        })
    }
})

router.post('/signin', async (req, res) => {
    const { success, data } = Signin.safeParse(req.body);

    if (!success) {
        res.status(411).send('Invalid input');
        return
    }

    const { otp } = TOTP.generate(base32.encode(data.email + process.env.JWT_SECRET!))
    console.log(otp)

    if (otp !== data.otp) {
        res.json({
            message: 'invalid otp',
            success: false
        })
    }

    const user = await prismaClient.user.findUnique({
        where: {
            email: data.email
        }
    })

    if (!user) {
        res.json({
            message: 'User not found',
            success: false
        })
    }

    const token = jwt.sign({
        user: user.id,
    }, process.env.JWT_SECRET!)

    res.json({
        token,
        success: true
    })
})

export default router
