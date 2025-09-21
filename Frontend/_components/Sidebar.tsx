'use client'

import { Button } from '@/components/ui/button'
import { allChats } from '@/componentsHooks/Sidebar'
import { Chat, messages } from '@/types'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import router from 'next/router'


type TokenPayload = {
  user?: string
  email?: string
}

const Sidebar = ({ setConversationId, setNewChat, setMessages, setIsSignedIn }: { setConversationId: Dispatch<SetStateAction<string>>, setNewChat: Dispatch<SetStateAction<boolean>>, setMessages: Dispatch<SetStateAction<messages | undefined>>, setIsSignedIn: Dispatch<SetStateAction<boolean>> }) => {
  const [chats, setChats] = useState<Chat[]>([])
  const [username, setUsername] = useState<string>('')
  useEffect(() => {
    const chats = async () => {
      const response = await allChats();
      setChats(response.data.conversations)
    }
    chats();
  }, [])

  const handleClick = async () => {
    try {
      localStorage.removeItem('token')
    } catch { }
  }

  useEffect(() => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
      if (!token) return
      const payload = jwtDecode<TokenPayload>(token)
      if (payload?.email) {
        setUsername(payload.email)
      } else if (payload?.user) {
        setUsername(String(payload.user))
      }
    } catch {
      // ignore decoding errors
    }
  }, [])

  const handleNewChat = async () => {
    setNewChat(true)
    setMessages([])
    setConversationId('')
  }
  return (
    <div className="h-full w-full flex flex-col rounded-lg p-4 bg-zinc-900">
      {/* New Chat Button */}
      <div className="mb-4">
        <Button className="w-full" variant="default" onClick={handleNewChat}>
          + New Chat
        </Button>
      </div>

      {/* Previous Chats List */}
      <div className="flex-1 overflow-y-auto mb-4">
        <div className="space-y-2">
          {chats?.map((chat, id) => {
            return (
              <Button onClick={() => setConversationId(chat.id)} key={chat.id} className="w-full text-left bg-zinc-800 hover:bg-zinc-700 text-white">
                {chat.title}
              </Button>
            )
          })}
        </div>
      </div>

      {/* Logout and User Info */}
      <div className="mt-auto flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-zinc-200">{username}</span>
        <Button variant="destructive" size="sm" onClick={() => {
          handleClick();
          window.location.href = "/signin";
        }}>
          Logout
        </Button>
      </div>
    </div >
  )
}

export default Sidebar