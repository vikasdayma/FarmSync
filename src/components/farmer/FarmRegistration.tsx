'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Step1Form from './Step1Form'
import Step2Form from './Step2Form'
import Step3Form from './Step3Form'
import Step4Form from './Step4Form'
import Step5Form from './Step5Form'
import Step6Form from './Step6Form'

import { getMyFarm } from '@/lib/api/farmReg'
import { Check } from 'lucide-react'
const FarmRegistration = () => {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [sessionId, setSessionId] = useState<string | null>(null)
const [checking, setChecking] = useState(true)  
useEffect(() => {
  const checkFarmExist = async () => {
    const farm = await getMyFarm()
    if(farm) {
      router.push('/dashboard')
      return  // ← stop here
    }

    // no farm → check localStorage
    const savedSessionId = localStorage.getItem('farmSessionId')
    const savedStep = localStorage.getItem('farmCurrentStep')
    if (savedSessionId && savedStep) {
      setSessionId(savedSessionId)
      setCurrentStep(Number(savedStep))
    }

    setChecking(false)  // ← done checking, show form
  }
  checkFarmExist()
}, [])
if(checking) return null
  const handleStep1Success = (id: string) => {
    localStorage.setItem('farmSessionId', id)
    localStorage.setItem('farmCurrentStep', '2')
    setSessionId(id)
    setCurrentStep(2)
  }

  const handleStep2Success = (id:string) => {
    localStorage.setItem('farmSessionId', id)
    localStorage.setItem('farmCurrentStep', '3')
    setSessionId(id)

    setCurrentStep(3)
  }

  const handleStep3Success = (id:string) => {
   localStorage.setItem('farmSessionId', id)
    localStorage.setItem('farmCurrentStep', '4')
    setSessionId(id)
    setCurrentStep(4)
  }
   const handleStep4Success = (id:string) => {
   localStorage.setItem('farmSessionId', id)
    localStorage.setItem('farmCurrentStep', '5')
    setSessionId(id)
    setCurrentStep(5)
  }
 const handleStep5Success = (id:string) => {
   localStorage.setItem('farmSessionId', id)
    localStorage.setItem('farmCurrentStep', '6')
    setSessionId(id)
    setCurrentStep(6)
  }
   const handleStep6Success = (id:string) => {
   localStorage.setItem('farmSessionId', id)
    localStorage.setItem('farmCurrentStep', '7')
    router.push('/dashboard')
  }



  return (
    <div className=' flex flex-col items-center justify-start '>
   <StepTracker currentStep={currentStep}/>
     
      {/* Steps */}
      {currentStep === 1 && (
        <Step1Form onSuccess={handleStep1Success} />
      )}

   {currentStep === 2 && sessionId && (
  <Step2Form
    sessionId={sessionId}
    onSuccess={handleStep2Success}
  />
)}

      {currentStep === 3 && sessionId &&(
        // <Step3Form sessionId={sessionId!} onSuccess={handleStep3Success} />
        <Step3Form
    sessionId={sessionId}
    onSuccess={handleStep3Success}
  />
      )}
        {currentStep === 4 && sessionId &&(
        // <Step3Form sessionId={sessionId!} onSuccess={handleStep3Success} />
        <Step4Form
    sessionId={sessionId}
    onSuccess={handleStep4Success}
  />
      )}

   {currentStep === 5 && sessionId &&(
        // <Step3Form sessionId={sessionId!} onSuccess={handleStep3Success} />
        <Step5Form
    sessionId={sessionId}
    onSuccess={handleStep5Success}
  />
      )}
        {currentStep === 6 && sessionId &&(
        // <Step3Form sessionId={sessionId!} onSuccess={handleStep3Success} />
        <Step6Form
    sessionId={sessionId}
    onSuccess={handleStep6Success}
  />
      )}

    </div>
  )
}

export default FarmRegistration


const STEPS = [
  { id: 1, label: 'Basic' },
  { id: 2, label: 'Soil' },
  { id: 3, label: 'Crop' },
  { id: 4, label: 'Irrigation' },
  { id: 5, label: 'Fertilizer' },
  { id: 6, label: 'Financial' },
] as const

function StepTracker({ currentStep }: { currentStep: number }) {
  return (
    <div className=' flex  lg:hidden  items-center gap-2 mt-6' role='progressbar' aria-valuenow={currentStep} aria-valuemin={1} aria-valuemax={6}>
      {STEPS.map((step) => {
        const isDone = currentStep > step.id
        const isActive = currentStep === step.id

        return (
          <React.Fragment key={step.id}>
            <div className='flex flex-col items-center gap-1'>
              <div
                className={[
                  'flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors',
                  isActive && 'bg-[#4a6b3f] text-white ring-4 ring-[#4a6b3f]/20',
                  isDone && 'bg-[#d4f26a] text-[#2d3a24]',
                  !isActive && !isDone && 'bg-[#f4f1e6] text-[#a39d87]',
                ].filter(Boolean).join(' ')}
              >
                {isDone ? <Check className='h-4 w-4' /> : step.id}
              </div>
              <span className={`text-[10px] font-medium ${isActive ? 'text-[#4a6b3f]' : 'text-[#a39d87]'}`}>
                {step.label}
              </span>
            </div>

            {step.id < 6 && (
              <div className={`h-1 w-10 sm:w-16 rounded transition-colors ${currentStep > step.id ? 'bg-[#d4f26a]' : 'bg-[#f4f1e6]'}`} />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}