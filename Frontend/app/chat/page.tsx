"use client";
import Sidebar from "@/_components/Sidebar";
import { Chat } from "./chatHook";
import MessageWindow from "@/_components/MessageWindow";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { allMessages } from "@/componentsHooks/MessagesHooks";
import { messages } from "@/types";

export default function ChatPage({ setIsSignedIn }: { setIsSignedIn: Dispatch<SetStateAction<boolean>> }) {
    const [conversationId, setConversationId] = useState('')
    const [newChat, setNewChat] = useState(false)
    const [messages, setMessages] = useState<messages>()
    const [inputValue, setInputValue] = useState('')

    useEffect(() => {
        const messages = async () => {
            const response = await allMessages(conversationId);
            const msgs = response.data.conversation.messages.map((msg: any) => ({
                content: msg.content,
                role: msg.role
            }));
            setMessages(msgs);
        }

        messages();
    }, [conversationId])

    const handleChat = async () => {
        setMessages((prev) => ([
            ...((prev ?? [])),
            { role: 'user', content: inputValue },
            { role: 'assistant', content: '' }
        ]));
        const input = inputValue
        setInputValue('')
        await Chat(input, conversationId, (chunk: string, id: string) => {
            setConversationId(id)
            setMessages((prev) => {
                if (!prev || prev.length === 0) return prev;
                const updated = [...prev];
                for (let i = updated.length - 1; i >= 0; i--) {
                    if (updated[i].role === 'assistant') {
                        updated[i] = { ...updated[i], content: updated[i].content + chunk };
                        break;
                    }
                }
                return updated;
            });
            console.log(conversationId)
        });
    };
    return (
        <div className="h-screen flex w-full p-4 gap-4">
            <div className="w-[17%]">
                <Sidebar setConversationId={setConversationId} setNewChat={setNewChat} setMessages={setMessages} setIsSignedIn={setIsSignedIn} />
            </div>
            <div className="w-full flex flex-col justify-between">
                <div className="w-full h-full items-center p-8 overflow-y-scroll">
                    {
                        <MessageWindow newChat={newChat} messages={messages!} />
                    }
                </div>
                {
                    (messages || newChat) &&
                    < div className="w-full relative flex items-center justify-center gap-4">
                        <form onSubmit={(e) => { e.preventDefault(); if (!inputValue.trim()) return; handleChat(); }} className="w-1/2 flex gap-4">

                            <Textarea
                                className='w-full'
                                placeholder="Type your message here"
                                value={inputValue}
                                onChange={e => setInputValue(e.target.value)}
                            />
                            <Button variant={"outline"} className="min-h-10" type="submit" disabled={!inputValue.trim()}>Submit</Button>
                        </form>
                    </div>
                }
            </div>
        </div >
    );
}
