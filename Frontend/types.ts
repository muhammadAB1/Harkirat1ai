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
