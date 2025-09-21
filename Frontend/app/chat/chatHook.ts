export const Chat = async (
    message: string,
    conversationId?: string,
    onChunk?: (chunk: string, id: string) => void,
) => {
    const id = crypto.randomUUID()
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/ai/chat`, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
            'message': message,
            'model': 'openai/gpt-oss-20b:free',
            ...(conversationId && conversationId.length > 0 ? { 'conversationId': conversationId } : { 'conversationId': id })
        }),
    })

    if (!response.body) {
        console.error('No response body')
        return
    }


    const reader = response.body.getReader()
    const decoder = new TextDecoder();
    let fullText = ''

    try {
        while (true) {
            const { done, value } = await reader.read();

            if (done) {
                console.log('Stream finished')
                break;
            }

            const chunk = decoder.decode(value, { stream: true })
            if (onChunk) onChunk(chunk, id)
            fullText += chunk

        }
        fullText += decoder.decode()
        return fullText
    } catch (error) {
        console.error(error)
    }
}