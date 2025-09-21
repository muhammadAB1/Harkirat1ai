export type Chat = {
    id: string;
    userId: string;
    title: string;
    createdAt: string;
    updatedAt: string;
}

export type Conversations = {
    messages: Array<{
        conversationId: string,
        id: string;
        createdAt: Date | string;
        updatedAt: Date | string;
        content: string;
        role: string;
    }>,
    id: string;
    userId: string;
    title: string;
}

export type messages = Array<{
    content: string;
    role: string;
}>

export const SUPPORTER_MODELS = ['openai/gpt-oss-20b:free', 'google/gemini-2.0-flash-exp:free', 'deepseek/deepseek-chat-v3.1:free'];
