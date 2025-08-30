import express from 'express'
import { CreatedChatType, Role } from './types.js';
import { config } from 'dotenv';
import { createCompletion } from './openRouter.js';
import { inMemoryStore } from './inMemoryStore.js';
import 
config();

const app = express();
app.use(express.json())

app.post('/chat', async (req, res) => {

    try {
        const { success, data } = CreatedChatType.safeParse(req.body);

        const conversationId = data?.conversationId

        if (!success) {
            res.status(411).json({
                message: 'Incorrect inputs'
            })

            return
        }

        let existingMessages = inMemoryStore.getInstance().get(conversationId)

        res.setHeader('Content-Type', 'text/html; charse=utf-8')
        res.setHeader('Transfer-Encoding', 'chunked')
        let response = ''
        await createCompletion([...existingMessages, {
            role: Role.user,
            content: data.message
        }], data.model, (chunk: string) => {
            response += chunk
            res.write(chunk)
        })
        res.end()

        inMemoryStore.getInstance().add(conversationId, {
            role: Role.user,
            content: data.message
        })

        inMemoryStore.getInstance().add(conversationId, {
            role: Role.assistant,
            content: data.message
        })
    } catch (error) {
        console.log(error)
    }
})

app.listen(3000, (() => console.log('server started at http://localhost:3000')))

