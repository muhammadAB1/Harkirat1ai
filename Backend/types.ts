import { z } from 'zod'

const MAX_INPUT_TOKENS = 1000
export const SUPPORTER_MODELS = ['openai/gpt-oss-20b:free', 'google/gemini-2.0-flash-exp:free'];
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
