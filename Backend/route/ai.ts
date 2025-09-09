import { Router } from "express";
import { createCompletion } from "../openRouter.js";
import { CreatedChatType, Role } from "../types.js";
import { inMemoryStore } from "../inMemoryStore.js";
import { authMiddleware } from "../auth-middleware.js";
import { PrismaClient } from '../generated/prisma/index.js';

const prismaClient = new PrismaClient();

const router = Router();

router.get('/conversations', authMiddleware, async (req, res) => {
    const userId = req.userId
    const conversations = await prismaClient.conversation.findMany({
        where: { userId: userId }
    })

    res.json({
        conversations
    })
})

router.get('/conversations/:conversationId', authMiddleware, async (req, res) => {
    const userId = req.userId
    const conversationId = req.params.conversationId;
    const conversation = await prismaClient.conversation.findUnique({
        where: {
            id: conversationId,
            userId
        },
        include: {
            messages: {
                orderBy: {
                    createdAt: 'asc'
                }
            }
        }
    })

    res.json({
        conversation
    })

})

router.post('/chat', authMiddleware, async (req, res) => {


    const userId = req.userId;
    const { success, data } = CreatedChatType.safeParse(req.body);
    const newUuid = crypto.randomUUID();
    const conversationId = data?.conversationId ?? newUuid
    if (!success) {
        res.status(411).json({
            message: 'Incorrect inputs'
        })

        return
    }

    let existingMessages = inMemoryStore.getInstance().get(conversationId)

    if (!existingMessages.length) {
        const messages = await prismaClient.message.findMany({
            where: {
                conversationId
            }
        })

        messages.map((m) => {
            inMemoryStore.getInstance().add(conversationId, {
                role: m.role as Role,
                content: m.content
            })
        })
        existingMessages = inMemoryStore.getInstance().get(conversationId)
    }

    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Cache-Control');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    let message = ''
    await createCompletion([...existingMessages, {
        role: Role.user,
        content: data.message
    }], data.model, (chunk: string) => {
        message += chunk
        res.write(chunk);
    })

    inMemoryStore.getInstance().add(conversationId, {
        role: Role.user,
        content: data.message
    })

    inMemoryStore.getInstance().add(conversationId, {
        role: Role.assistant,
        content: message
    })

    if (!data.conversationId) {
        await prismaClient.conversation.create({
            data: {
                title: data.message.slice(0, 20) + '...',
                id: conversationId,
                userId,
            }
        })
    }
    await prismaClient.message.createMany({
        data: [
            {
                conversationId,
                content: data.message,
                role: Role.user
            },
            {
                conversationId,
                content: message,
                role: Role.assistant
            }
        ],

    })
})

export default router
