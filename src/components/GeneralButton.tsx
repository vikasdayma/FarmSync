

'use client'

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface AddProductButtonProps {
  onClick?: () => void
  className?: string,
  text:string
}

function GeneralButton({
  onClick,
  className,
   text
}: AddProductButtonProps) {
  return (
    <div className="">
    <Button
      onClick={onClick}
      className={`
        bg-green-600 
        hover:bg-green-700 
        text-white 
        font-semibold
        flex items-center 
        gap-2
        px-5 
        py-2
        rounded-lg
        shadow-md
        hover:shadow-lg
        transition-all
        duration-200
        ${className}
      `}
    >
      <Plus className="w-5 h-5" />

   { text}
    </Button>
    </div>
  )
}

export  default GeneralButton