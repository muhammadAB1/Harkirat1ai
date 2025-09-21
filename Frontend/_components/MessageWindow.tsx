import { messages } from '@/types'
import React from 'react'

const MessageWindow = ({ newChat, messages }: { newChat: boolean, messages: messages }) => {
    return (
        <div className="flex flex-col gap-4 p-4 relativ h-full">

            {messages ?
                messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                        <div
                            className={`px-4 py-2 rounded-lg max-w-[60%] ${msg.role === "user"
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 text-gray-900"
                                }`}
                        >
                            {msg.content}
                        </div>
                    </div>
                ))
                :
                newChat ? '' :
                    <div className='items-center justify-center flex h-full'>Click new chat to start new chat</div>
            }



        </div>
    )
}

export default MessageWindow