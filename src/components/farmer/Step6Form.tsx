'use client'

import { FarmStep6 } from '@/types/farmregistration'
import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { registerFarmStep6, submitFarmRegistration } from '@/lib/api/farmReg'

interface Step6FormProps {
  sessionId: string
  onSuccess: (farmId: string) => void
}

const Step6Form = ({ sessionId, onSuccess }: Step6FormProps) => {
  const [step6Data, setStep6Data] = useState<Partial<FarmStep6>>({
    sessionId: sessionId,       // ← from prop ✅
    estimatedBudget: undefined,
    loanRequired: false,
    loanAmount: undefined,
    subsidyRequired: false,
    expectedRevenue: undefined,
    notes: undefined,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target
    setStep6Data(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? undefined : Number(value)) : value
    }))
  }

  const handleCheckbox = (name: keyof FarmStep6) => {
    setStep6Data(prev => ({
      ...prev,
      [name]: !prev[name]
    }))
  }

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setError(null)
  setLoading(true)

  try {
    // 1. save step 6
    const step6Res = await registerFarmStep6(step6Data as FarmStep6)
    if (!step6Res) { setError('Step 6 failed'); return }

    // 2. submit registration
    const submitRes = await submitFarmRegistration(sessionId)
    if (!submitRes) { setError('Submission failed'); return }

    // 3. pass farmId to parent
    onSuccess(submitRes.farmId)

  } finally {
    setLoading(false)
  }
}

  return (
    <Card className='w-full max-w-md mx-auto max-h-[75vh] overflow-y-auto'>
      <CardHeader>
        <CardTitle className='text-2xl'>Register Your Farm</CardTitle>
        <CardDescription>Step 6 — Financial Planning</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className='flex flex-col gap-5'>

          {/* Estimated Budget */}
          <div className='flex flex-col gap-1.5'>
            <Label htmlFor='estimatedBudget'>Estimated Budget (₹)</Label>
            <Input
              id='estimatedBudget' name='estimatedBudget'
              type='number' min={1}
              placeholder='e.g. 50000'
              value={step6Data.estimatedBudget ?? ''}
              onChange={handleChange}
              required
            />
          </div>

          {/* Loan Required */}
          <div className='flex items-center gap-3'>
            <input
              id='loanRequired'
              type='checkbox'
              checked={step6Data.loanRequired ?? false}
              onChange={() => handleCheckbox('loanRequired')}
              className='w-4 h-4 accent-green-600'
            />
            <Label htmlFor='loanRequired'>Loan Required?</Label>
          </div>

          {/* Loan Amount — only show if loanRequired */}
          {step6Data.loanRequired && (
            <div className='flex flex-col gap-1.5'>
              <Label htmlFor='loanAmount'>Loan Amount (₹)</Label>
              <Input
                id='loanAmount' name='loanAmount'
                type='number' min={1}
                placeholder='e.g. 25000'
                value={step6Data.loanAmount ?? ''}
                onChange={handleChange}
              />
            </div>
          )}

          {/* Subsidy Required */}
          <div className='flex items-center gap-3'>
            <input
              id='subsidyRequired'
              type='checkbox'
              checked={step6Data.subsidyRequired ?? false}
              onChange={() => handleCheckbox('subsidyRequired')}
              className='w-4 h-4 accent-green-600'
            />
            <Label htmlFor='subsidyRequired'>Subsidy Required?</Label>
          </div>

          {/* Expected Revenue */}
          <div className='flex flex-col gap-1.5'>
            <Label htmlFor='expectedRevenue'>
              Expected Revenue (₹) <span className='text-muted-foreground text-xs'>(optional)</span>
            </Label>
            <Input
              id='expectedRevenue' name='expectedRevenue'
              type='number' min={0}
              placeholder='e.g. 80000'
              value={step6Data.expectedRevenue ?? ''}
              onChange={handleChange}
            />
          </div>

          {/* Notes */}
          <div className='flex flex-col gap-1.5'>
            <Label htmlFor='notes'>
              Notes <span className='text-muted-foreground text-xs'>(optional)</span>
            </Label>
            <Input
              id='notes' name='notes'
              placeholder='e.g. Planning to apply for PM-KISAN scheme'
              value={step6Data.notes ?? ''}
              onChange={handleChange}
              maxLength={500}
            />
          </div>

          {error && (
            <p className='text-sm text-red-500'>{error}</p>
          )}

          <Button type='submit' disabled={loading} className='w-full'>
            {loading ? 'Submitting...' : 'Complete Registration →'}
          </Button>

        </form>
      </CardContent>
    </Card>
  )
}

export default Step6Form