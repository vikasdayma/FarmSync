'use client'

import { FarmStep4, IrrigationType } from '@/types/farmregistration'
import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { registerFarmStep4 } from '@/lib/api/farmReg'

interface Step4FormProps {
  sessionId: string 
  onSuccess: (sessionId:string) => void
}

const IRRIGATION_TYPES: IrrigationType[] = [
  "DRIP", "SPRINKLER", "FLOOD", "FURROW", "CENTER_PIVOT", "MANUAL"
]

const Step4Form = ({ sessionId, onSuccess }: Step4FormProps) => {
  const [step4Data, setStep4Data] = useState<Partial<FarmStep4>>({
    sessionId: sessionId,
    irrigationType: "DRIP",
    waterSource: '',
    frequencyDays: undefined,
    durationMinutes: undefined,
    notes: undefined,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setStep4Data(prev => ({
      ...prev,
      [name]: type === "number" ? (value === "" ? undefined : Number(value)) : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!step4Data.frequencyDays || step4Data.frequencyDays <= 0) {
      setError('Frequency must be greater than 0')
      return
    }
    if (!step4Data.durationMinutes || step4Data.durationMinutes <= 0) {
      setError('Duration must be greater than 0')
      return
    }

    setLoading(true)
    try {
      const payload = step4Data as FarmStep4
      console.log('Sending payload:', payload)
      // TODO: uncomment when API function is ready
      const res = await registerFarmStep4
      (payload)
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
        <CardDescription>Step 4 — Irrigation Information</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className='flex flex-col gap-5'>

          {/* Irrigation Type */}
          <div className='flex flex-col gap-1.5'>
            <Label>Irrigation Type</Label>
            <Select
              value={step4Data.irrigationType}
              onValueChange={(value) =>
                setStep4Data(prev => ({ ...prev, irrigationType: value as IrrigationType }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder='Select irrigation type' />
              </SelectTrigger>
              <SelectContent>
                {IRRIGATION_TYPES.map(type => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0) + type.slice(1).toLowerCase().replace('_', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Water Source */}
          <div className='flex flex-col gap-1.5'>
            <Label htmlFor='waterSource'>Water Source</Label>
            <Input
              id='waterSource' name='waterSource'
              type='text'
              placeholder='e.g. Borewell, Canal, River'
              value={step4Data.waterSource ?? ''}
              onChange={handleChange}
              required
            />
          </div>

          {/* Frequency & Duration */}
          <div className='grid grid-cols-2 gap-4'>
            <div className='flex flex-col gap-1.5'>
              <Label htmlFor='frequencyDays'>
                Frequency <span className='text-muted-foreground text-xs'>(days)</span>
              </Label>
              <Input
                id='frequencyDays' name='frequencyDays'
                type='number'
                min={1}
                placeholder='e.g. 3'
                value={step4Data.frequencyDays ?? ''}
                onChange={handleChange}
                required
              />
            </div>
            <div className='flex flex-col gap-1.5'>
              <Label htmlFor='durationMinutes'>
                Duration <span className='text-muted-foreground text-xs'>(minutes)</span>
              </Label>
              <Input
                id='durationMinutes' name='durationMinutes'
                type='number'
                min={1}
                placeholder='e.g. 30'
                value={step4Data.durationMinutes ?? ''}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Notes */}
          <div className='flex flex-col gap-1.5'>
            <Label htmlFor='notes'>
              Notes <span className='text-muted-foreground text-xs'>(optional)</span>
            </Label>
         <Input
  id='notes' name='notes'
  placeholder='e.g. Irrigation is done early morning'
  value={step4Data.notes ?? ''}
  onChange={handleChange}
  maxLength={500}
/>
          </div>

          {error && (
            <p className='text-sm text-red-500'>{error}</p>
          )}

          <Button type='submit' disabled={loading} className='w-full'>
            {loading ? 'Saving...' : 'Continue to Step 5 →'}
          </Button>

        </form>
      </CardContent>
    </Card>
  )
}

export default Step4Form