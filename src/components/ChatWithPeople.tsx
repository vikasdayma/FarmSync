'use client'

import ChatWithPeople from '@/components/ChatWithPeople';
import React, { useEffect, useState } from 'react'

type Chat = {
  id: string
  user1: any
  user2: any
  _count: {
    messages: number
  }
}

const Chats = () => {

const [chats, setChats] = useState<Chat[]>([])
const [isChatCreated, setIsChatCreated] = useState(false)

async function getMessages() {

  try {

    const res = await fetch('/api/chat', {
      method: 'GET',
      credentials: 'include'
    })

    if (!res.ok) {

      const text = await res.text()

      console.error("API ERROR STATUS:", res.status)
      console.error("API ERROR BODY:", text)

      return
    }

    const data = await res.json()

    setChats(data.data)

    console.log("Chats:", data.data)

  } catch (error) {

    console.error("Fetch Error:", error)

  }
}

useEffect(() => {
  getMessages()
}, [])



// 🔥 KEY LOGIC
// Check if ANY chat has messages
const hasChatsWithMessages = chats.some(
  chat => chat._count.messages > 0
)
console.log(hasChatsWithMessages)


// ✅ SHOW CREATE BUTTON IF:
// - No chats
// OR
// - Chats exist but ALL have 0 messages

if (!hasChatsWithMessages && !isChatCreated) {

  return (
    <div className=''>

  <h1 className='text-black text-7xl'>
      Chats
    </h1>

    </div>
  )
}



// ✅ SHOW PEOPLE LIST WHEN USER CLICKS CREATE
if (isChatCreated) {

  return (
    <div>
    <h1 className='text-black text-7xl'>
      Chats
    </h1>
    </div>
  )
}



// ✅ SHOW CHAT LIST ONLY IF MESSAGES EXIST
return (

  <div>

    <h1 className='text-black text-7xl'>
      Chats
    </h1>

    {/* {chats
      .filter(chat => chat._count.messages > 0)
      .map(chat => (

        <div key={chat.id}>

     
</h1>   
        </div>

      ))
    } */}

  </div>

)

}

export default Chats