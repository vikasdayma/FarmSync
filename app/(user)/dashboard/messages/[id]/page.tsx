'use client'

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

const Chat = () => {
    const params = useParams()
    const chatId = params.id as string

    const [messages, setMessages] = useState([])

    // ✅ GET request to load chat messages
    const loadChats = async () => {
        try {
            const res = await fetch(`/api/chat/${chatId}`)

            const data = await res.json()

            console.log("Messages:", data)

            setMessages(data.data)

        } catch (error) {
            console.error("Error loading chats:", error)
        }
    }

    // ✅ Call GET when page loads
    useEffect(() => {
        if (chatId) {
            loadChats()
        }
    }, [chatId])

    return (
        <div>
            page
        </div>
    )
}

export default Chat