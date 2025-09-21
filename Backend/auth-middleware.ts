import type { NextFunction, Request, Response } from "express"
import jwt, { JwtPayload } from "jsonwebtoken"

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authToken = req.headers.authorization?.split(' ')[1]

    if (!authToken) {
        res.send({
            message: 'Auth token not given',
            success: 'false'
        })
        return
    }

    try {
        const data = jwt.verify(authToken, process.env.JWT_SECRET)
        req.userId = (data as JwtPayload).user as string
        next();
    }
    catch (e) {
        res.send({
            message: 'Auth token invalid',
            success: false
        })
    }

}