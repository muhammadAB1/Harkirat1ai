import express from 'express'
import { config } from 'dotenv';
import cors from 'cors'
import aiRouter from './route/ai.js'
import authRouter from './route/auth.js'

config();

const app = express();

app.use(express.json())
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))

app.use('/ai', aiRouter)
app.use('/auth', authRouter)



app.listen(5000, (() => console.log('server started at http://localhost:5000')))

