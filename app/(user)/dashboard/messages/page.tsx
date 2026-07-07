'use client'

import ChatWithPeople from '@/components/ChatWithPeople';
import React, { useEffect, useState } from 'react'

const Chats = () => {
const [messages,setMessages]=useState<[]>([])
const [isChatCreated,setIsChatCreated]=useState(false);
async function getMessages() {
  try {
    const res = await fetch('/api/chats', {
      method: 'GET',
      credentials: 'include'
    })

    if (!res.ok) {

      // Read as text first (safe)
      const text = await res.text()

      console.error("API ERROR STATUS:", res.status)
      console.error("API ERROR BODY:", text)

      return
    }

    const data = await res.json()
 setMessages(data.data)
    console.log("Chats:", data.data)

  } catch (error) {

    console.error("Fetch Error:", error)

  }
}
async function handleCreateChat(){

}
  useEffect(() => {
    getMessages()
  }, []) 
  console.log(messages.length)
if(messages.length<1 && !isChatCreated){
return <div className='flex justify-center bg-amber-400 items-center h-screen '>
  
<button onClick={()=>{
setIsChatCreated(!isChatCreated)
}} className='text-white rounded-lg bg-black border-2 p-2 border-white text-2xl'>create a chat</button></div>
}
  return (
    <div className=''>
    {
      isChatCreated &&  <ChatWithPeople/>
    }
    </div>
  )
}

export default Chats