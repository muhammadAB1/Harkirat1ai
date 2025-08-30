import { z } from 'zod'

const MAX_INPUT_TOKENS = 1000
export const SUPPORTER_MODELS = ['openai/gpt-4o', 'openai/gpt-5'];
export type MODEL = typeof SUPPORTER_MODELS[number]

export const CreatedChatType = z.object({
    conversationId: z.uuid().optional(),
    message: z.string().max(MAX_INPUT_TOKENS),
    model: z.enum(SUPPORTER_MODELS)
})

export enum Role {
    assistant = "assistant",
    user = "user"
}


export type Message = {
    content: string
    role: Role
}
