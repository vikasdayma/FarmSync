

'use client'

import { FarmStep3, Crops } from '@/types/farmregistration'
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { getCrops, registerFarmStep3 } from '@/lib/api/farmReg'
import { Input } from '../ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

interface Step3FormProps {
  sessionId: string 
  onSuccess: (sessionId:string) => void
}
const Step3Form = ({ sessionId, onSuccess }: Step3FormProps) => {
  const [step3Data, setStep3Data] = useState<FarmStep3>({
    sessionId: sessionId,
    cropId: '',
    season: '',
    year: new Date().getFullYear(),
    plantingDate: undefined,
    harvestDate: undefined,
    expectedYieldKg: undefined,
  })
  const [crops, setCrops] = useState<Crops[]>([])
  const [cropsLoading, setCropsLoading] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const getCropsFrom = async () => {
      const response = await getCrops()
      setCrops(response)
      setCropsLoading(false)
    }
    getCropsFrom()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target
    setStep3Data(prev => ({
      ...prev,
      [name]: type === "number" ? (value === "" ? undefined : Number(value)) : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // convert dates to ISO string before sending
    const payload = {
      ...step3Data,
      plantingDate: step3Data.plantingDate
        ? new Date(step3Data.plantingDate).toISOString()
        : undefined,
      harvestDate: step3Data.harvestDate
        ? new Date(step3Data.harvestDate).toISOString()
        : undefined,
    }

    console.log('Sending payload:', payload)
    // TODO: call registerFarmStep3(payload) when ready
    const res = await registerFarmStep3(payload)
    if(!res) { setError('Something went wrong'); return }
    onSuccess(sessionId)
  }

  return (
    <Card className='w-full max-w-md mx-auto max-h-[75vh] overflow-y-auto'>
      <CardHeader>
        <CardTitle className='text-2xl'>Register Your Farm</CardTitle>
        <CardDescription>Step 3 — Crop Information</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className='flex flex-col gap-5'>

          {/* Crop Select */}
          <div className='flex flex-col gap-1.5'>
            <Label>Crop</Label>
            <Select
              value={step3Data.cropId}
              onValueChange={(value) =>
                setStep3Data(prev => ({ ...prev, cropId: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder={cropsLoading ? 'Loading crops...' : 'Select a crop'} />
              </SelectTrigger>
              <SelectContent>
                {cropsLoading ? (
                  <SelectItem value='loading' disabled>Loading...</SelectItem>
                ) : crops.length === 0 ? (
                  <SelectItem value='no-crops' disabled>No crops available</SelectItem>
                ) : (
                  crops.map(crop => (
                    <SelectItem key={crop.id} value={crop.id}>
                      {crop.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Season */}
          <div className='flex flex-col gap-1.5'>
            <Label htmlFor='season'>Season</Label>
            <Input
              id='season' name='season'
              type='text'
              placeholder='e.g. Kharif 2026'
              value={step3Data.season}
              onChange={handleChange}
              required
            />
          </div>

          {/* Year */}
          <div className='flex flex-col gap-1.5'>
            <Label htmlFor='year'>Year</Label>
            <Input
              id='year' name='year'
              type='number'
              min={2000} max={2100}
              value={step3Data.year}
              onChange={handleChange}
              required
            />
          </div>

          {/* Planting & Harvest Date */}
          <div className='grid grid-cols-2 gap-4'>
            <div className='flex flex-col gap-1.5'>
              <Label htmlFor='plantingDate'>
                Planting Date <span className='text-muted-foreground text-xs'>(optional)</span>
              </Label>
              <Input
                id='plantingDate' name='plantingDate'
                type='date'
                value={step3Data.plantingDate ?? ''}
                onChange={handleChange}
              />
            </div>
            <div className='flex flex-col gap-1.5'>
              <Label htmlFor='harvestDate'>
                Harvest Date <span className='text-muted-foreground text-xs'>(optional)</span>
              </Label>
              <Input
                id='harvestDate' name='harvestDate'
                type='date'
                value={step3Data.harvestDate ?? ''}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Expected Yield */}
          <div className='flex flex-col gap-1.5'>
            <Label htmlFor='expectedYieldKg'>
              Expected Yield (kg) <span className='text-muted-foreground text-xs'>(optional)</span>
            </Label>
            <Input
              id='expectedYieldKg' name='expectedYieldKg'
              type='number'
              min={0}
              placeholder='e.g. 500'
              value={step3Data.expectedYieldKg ?? ''}
              onChange={handleChange}
            />
          </div>

          {/* No crops warning */}
          {/* {!cropsLoading && crops.length === 0 && (
            <p className='text-sm text-amber-500'>
              ⚠️ No crops available. Please contact admin to add crops.
            </p>
          )} */}

          {error && (
            <p className='text-sm text-red-500'>{error}</p>
          )}

          <Button
            type='submit'
            disabled={loading || crops.length === 0}
            className='w-full'
          >
            {loading ? 'Saving...' : 'Complete Registration →'}
          </Button>

        </form>
      </CardContent>
    </Card>
  )
}

export default Step3Form