import { Message, MODEL } from "./types.js";

const MAX_TOKENS_ITERATIONS = 1000;

export const createCompletion = async (messages: Message[],
    model: MODEL,
    cb: (chunk: string) => void
) => {

    return new Promise<void>(async (resolve, reject) => {

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model,
                messages: messages,
                stream: true,
            }),
        });

        const reader = response.body?.getReader();
        if (!reader) {
            throw new Error('Response body is not readable');
        }

        const decoder = new TextDecoder();
        let buffer = '';

        try {
            let tokenIteration = 0;
            while (true) {
                tokenIteration++
                if (tokenIteration > MAX_TOKENS_ITERATIONS) {
                    resolve()
                    return;
                }
                const { done, value } = await reader.read();
                if (done) break;

                // Append new chunk to buffer
                buffer += decoder.decode(value, { stream: true });
                // Process complete lines from buffer
                while (true) {
                    const lineEnd = buffer.indexOf('\n');
                    if (lineEnd === -1) {
                        break
                    };

                    const line = buffer.slice(0, lineEnd).trim();
                    buffer = buffer.slice(lineEnd + 1);

                    if (line.startsWith('data: ')) {
                        const data = line.slice(6);
                        if (data === '[DONE]') break;

                        try {
                            const parsed = JSON.parse(data);
                            console.log(parsed.choices[0].delta.content)
                            const content = parsed.choices[0].delta.content;
                            if (content) {
                                cb(content)
                            }
                        } catch (e) {
                            reject()
                            // Ignore invalid JSON
                        }
                    }
                }
            }
        } finally {
            resolve()
            reader.cancel();
        }

    })
}