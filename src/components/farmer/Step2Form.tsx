'use client'
import { FarmStep2 } from "@/types/farmregistration"
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardTitle, CardDescription, CardHeader, CardContent } from "../ui/card"
import { Button } from "../ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { useState } from "react"
import { registerFarmStep2 } from "@/lib/api/farmReg"

interface Step2FormProps {
  sessionId: string 
  onSuccess: (sessionId:string) => void
}

type SoilType = "CLAY" | "SANDY" | "LOAMY" | "SILTY" | "PEATY" | "CHALKY" | "MIXED"

const SOIL_TYPES: SoilType[] = ["CLAY", "SANDY", "LOAMY", "SILTY", "PEATY", "CHALKY", "MIXED"]

const Step2Form = ({ sessionId, onSuccess }: Step2FormProps) => {

  const [step2Data, setStep2Data] = useState<FarmStep2>({
    sessionId: sessionId,
    soilType: "CLAY",
    phLevel: 0,
    nitrogenPpm: undefined,
    phosphorusPpm: undefined,
    potassiumPpm: undefined,
    organicMatter: undefined,
    moistureLevel: undefined,
    labName: undefined,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault()
 try{
    const res=await registerFarmStep2(step2Data);
        if (!res) {
        setError('Something went wrong. Please try again.')
        return
      }
      onSuccess(res.sessionId)
}

catch{

} 
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target
    setStep2Data(prev => ({
      ...prev,
      [name]: type === "number" ? (value === "" ? undefined : Number(value)) : value
    }))
  }

  return (
    <Card className='w-full max-w-md mx-auto max-h-[75vh] overflow-y-auto'>
      <CardHeader>
        <CardTitle className='text-2xl'>Register Your Farm</CardTitle>
        <CardDescription>Step 2 — Soil Information</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className='flex flex-col gap-5'>

          {/* Soil Type — enum dropdown */}
          <div className='flex flex-col gap-1.5'>
            <Label>Soil Type</Label>
            <Select
              value={step2Data.soilType}
              onValueChange={(value) =>
                setStep2Data(prev => ({ ...prev, soilType: value as SoilType }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder='Select soil type' />
              </SelectTrigger>
              <SelectContent>
                {SOIL_TYPES.map(type => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0) + type.slice(1).toLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* pH Level — min 0 max 14 */}
          <div className='flex flex-col gap-1.5'>
            <Label htmlFor='phLevel'>pH Level <span className='text-muted-foreground text-xs'>(0 - 14)</span></Label>
            <Input
              id='phLevel' name='phLevel'
              type='number'
              placeholder='e.g. 6.5'
              min={0} max={14}
              value={step2Data.phLevel || ''}
              onChange={handleChange}
              required
            />
          </div>

          {/* Nitrogen, Phosphorus, Potassium */}
          <div className='grid grid-cols-3 gap-4'>
            <div className='flex flex-col gap-1.5'>
              <Label htmlFor='nitrogenPpm'>
                Nitrogen <span className='text-muted-foreground text-xs'>(ppm)</span>
              </Label>
              <Input
                id='nitrogenPpm' name='nitrogenPpm'
                type='number' min={0}
                placeholder='e.g. 40'
                value={step2Data.nitrogenPpm ?? ''}
                onChange={handleChange}
              />
            </div>
            <div className='flex flex-col gap-1.5'>
              <Label htmlFor='phosphorusPpm'>
                Phosphorus <span className='text-muted-foreground text-xs'>(ppm)</span>
              </Label>
              <Input
                id='phosphorusPpm' name='phosphorusPpm'
                type='number' min={0}
                placeholder='e.g. 20'
                value={step2Data.phosphorusPpm ?? ''}
                onChange={handleChange}
              />
            </div>
            <div className='flex flex-col gap-1.5'>
              <Label htmlFor='potassiumPpm'>
                Potassium <span className='text-muted-foreground text-xs'>(ppm)</span>
              </Label>
              <Input
                id='potassiumPpm' name='potassiumPpm'
                type='number' min={0}
                placeholder='e.g. 150'
                value={step2Data.potassiumPpm ?? ''}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Organic Matter & Moisture Level */}
          <div className='grid grid-cols-2 gap-4'>
            <div className='flex flex-col gap-1.5'>
              <Label htmlFor='organicMatter'>
                Organic Matter <span className='text-muted-foreground text-xs'>(optional)</span>
              </Label>
              <Input
                id='organicMatter' name='organicMatter'
                type='number' min={0}
                placeholder='e.g. 3.5'
                value={step2Data.organicMatter ?? ''}
                onChange={handleChange}
              />
            </div>
            <div className='flex flex-col gap-1.5'>
              <Label htmlFor='moistureLevel'>
                Moisture Level <span className='text-muted-foreground text-xs'>(optional)</span>
              </Label>
              <Input
                id='moistureLevel' name='moistureLevel'
                type='number' min={0}
                placeholder='e.g. 45'
                value={step2Data.moistureLevel ?? ''}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Lab Name */}
          <div className='flex flex-col gap-1.5'>
            <Label htmlFor='labName'>
              Lab Name <span className='text-muted-foreground text-xs'>(optional)</span>
            </Label>
            <Input
              id='labName' name='labName'
              placeholder='e.g. SoilTest Labs Pvt Ltd'
              value={step2Data.labName ?? ''}
              onChange={handleChange}
            />
          </div>

          {error && (
            <p className='text-sm text-red-500'>{error}</p>
          )}

          <Button type='submit' disabled={loading} className='w-full'>
            {loading ? 'Saving...' : 'Continue to Step 3 →'}
          </Button>

        </form>
      </CardContent>
    </Card>
  )
}

export default Step2Form