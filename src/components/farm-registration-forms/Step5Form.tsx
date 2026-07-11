'use client'

import { FarmStep5 } from '@/types/farmregistration'
import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { registerFarmStep5 } from '@/lib/api/farmReg'

interface Step5FormProps {
  sessionId: string 
  onSuccess: (sessionId:string) => void
}
const Step5Form = ({ sessionId, onSuccess }: Step5FormProps) => {
  const [step5Data, setStep5Data] = useState<FarmStep5>({
    sessionId: sessionId,
    fertilizerType: '',
    applicationRate: '',
    frequency: '',
    organicAdditives: [],
    notes: undefined,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // for organicAdditives tag input
  const [additiveInput, setAdditiveInput] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setStep5Data(prev => ({ ...prev, [name]: value }))
  }

  // add additive on Enter key
  const handleAdditiveKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const trimmed = additiveInput.trim()
      if (!trimmed) return
      // avoid duplicates
      if (step5Data.organicAdditives?.includes(trimmed)) {
        setAdditiveInput('')
        return
      }
      setStep5Data(prev => ({
        ...prev,
        organicAdditives: [...(prev.organicAdditives || []), trimmed]
      }))
      setAdditiveInput('')
    }
  } 

  // remove additive tag
  const removeAdditive = (item: string) => {
    setStep5Data(prev => ({
      ...prev,
      organicAdditives: prev.organicAdditives?.filter(a => a !== item)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    setLoading(true)
    try {
      console.log('Sending payload:', step5Data)
  
      const res = await registerFarmStep5(step5Data)
      if (!res) { setError('Something went wrong. Please try again.'); return }
      onSuccess(sessionId)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className='w-full max-w-md mx-auto max-h-[75vh] overflow-y-auto'>
      <CardHeader>
        <CardTitle className='text-2xl'>Register Your Farm</CardTitle>
        <CardDescription>Step 5 — Fertilizer Information</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className='flex flex-col gap-5'>

          {/* Fertilizer Type */}
          <div className='flex flex-col gap-1.5'>
            <Label htmlFor='fertilizerType'>Fertilizer Type</Label>
            <Input
              id='fertilizerType' name='fertilizerType'
              type='text'
              placeholder='e.g. Urea, DAP, NPK'
              value={step5Data.fertilizerType}
              onChange={handleChange}
              required
            />
          </div>

          {/* Application Rate */}
          <div className='flex flex-col gap-1.5'>
            <Label htmlFor='applicationRate'>Application Rate</Label>
            <Input
              id='applicationRate' name='applicationRate'
              type='text'
              placeholder='e.g. 50kg per acre'
              value={step5Data.applicationRate}
              onChange={handleChange}
              required
            />
          </div>

          {/* Frequency */}
          <div className='flex flex-col gap-1.5'>
            <Label htmlFor='frequency'>Frequency</Label>
            <Input
              id='frequency' name='frequency'
              type='text'
              placeholder='e.g. Once a month'
              value={step5Data.frequency}
              onChange={handleChange}
              required
            />
          </div>

          {/* Organic Additives — Tag Input */}
          <div className='flex flex-col gap-1.5'>
            <Label htmlFor='additiveInput'>
              Organic Additives <span className='text-muted-foreground text-xs'>(optional — press Enter to add)</span>
            </Label>
            <Input
              id='additiveInput'
              type='text'
              placeholder='e.g. Compost'
              value={additiveInput}
              onChange={e => setAdditiveInput(e.target.value)}
              onKeyDown={handleAdditiveKeyDown}
            />
            {/* Tags */}
            {step5Data.organicAdditives && step5Data.organicAdditives.length > 0 && (
              <div className='flex flex-wrap gap-2 mt-1'>
                {step5Data.organicAdditives.map(item => (
                  <div
                    key={item}
                    className='flex items-center gap-1 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full'
                  >
                    <span>{item}</span>
                    <button
                      type='button'
                      onClick={() => removeAdditive(item)}
                      className='text-green-600 hover:text-red-500 font-bold'
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          <div className='flex flex-col gap-1.5'>
            <Label htmlFor='notes'>
              Notes <span className='text-muted-foreground text-xs'>(optional)</span>
            </Label>
            <Input
              id='notes' name='notes'
              placeholder='e.g. Apply after rainfall'
              value={step5Data.notes ?? ''}
              onChange={handleChange}
              maxLength={500}
            />
          </div>

          {error && (
            <p className='text-sm text-red-500'>{error}</p>
          )}

          <Button type='submit' disabled={loading} className='w-full'>
            {loading ? 'Saving...' : 'Continue to Step 6 →'}
          </Button>

        </form>
      </CardContent>
    </Card>
  )
}

export default Step5Form