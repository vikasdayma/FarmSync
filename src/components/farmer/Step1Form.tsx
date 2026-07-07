// 'use client'
// import React, { useState } from 'react'
// import { registerFarmStep1 } from '@/lib/api/farmReg'
// import { FarmStep1 } from '@/types/farmregistration'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import { Button } from '@/components/ui/button'
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

// interface Step1FormProps {
//   onSuccess: (sessionId: string) => void
// }

// const Step1Form = ({ onSuccess }: Step1FormProps) => {
//   const [data, setData] = useState<FarmStep1>({
//     name: '',
//     areaHectares: 0,
//     address: '',
//     city: '',
//     state: '',
//     pincode: '',
//     latitude: undefined,
//     longitude: undefined,
//   })
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState<string | null>(null)

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target
//     setData(prev => ({
//       ...prev,
//       [name]: name === 'areaHectares' || name === 'latitude' || name === 'longitude'
//         ? value === '' ? undefined : Number(value)
//         : value
//     }))
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setError(null)

//     if (data.areaHectares <= 0) {
//       setError('Area must be greater than 0')
//       return
//     }

//     setLoading(true)
//     try {
//       const res = await registerFarmStep1(data)
//       if (!res) {
//         setError('Something went wrong. Please try again.')
//         return
//       }
//       onSuccess(res.sessionId)
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <Card className='w-full max-w-md mx-auto max-h-[75vh] overflow-y-auto'>
//       <CardHeader>
//         <CardTitle className='text-2xl'>Register Your Farm</CardTitle>
//         <CardDescription>Step 1 — Basic Information</CardDescription>
//       </CardHeader>

//       <CardContent>
//         <form onSubmit={handleSubmit} className='flex flex-col gap-5'>

//           <div className='flex flex-col gap-1.5'>
//             <Label htmlFor='name'>Farm Name</Label>
//             <Input
//               id='name' name='name'
//               placeholder='e.g. Green Valley Farm'
//               value={data.name}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <div className='flex flex-col gap-1.5'>
//             <Label htmlFor='areaHectares'>Area (Hectares)</Label>
//             <Input
//               id='areaHectares' name='areaHectares'
//               type='number'
//               placeholder='e.g. 5.2'
//               value={data.areaHectares || ''}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <div className='flex flex-col gap-1.5'>
//             <Label htmlFor='address'>Address</Label>
//             <Input
//               id='address' name='address'
//               placeholder='e.g. Village Rampur, Near Highway 44'
//               value={data.address}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <div className='grid grid-cols-2 gap-4'>
//             <div className='flex flex-col gap-1.5'>
//               <Label htmlFor='city'>City</Label>
//               <Input
//                 id='city' name='city'
//                 placeholder='e.g. Bhopal'
//                 value={data.city}
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//             <div className='flex flex-col gap-1.5'>
//               <Label htmlFor='state'>State</Label>
//               <Input
//                 id='state' name='state'
//                 placeholder='e.g. Madhya Pradesh'
//                 value={data.state}
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//           </div>

//           <div className='flex flex-col gap-1.5'>
//             <Label htmlFor='pincode'>Pincode</Label>
//             <Input
//               id='pincode' name='pincode'
//               placeholder='e.g. 462001'
//               value={data.pincode}
//               onChange={handleChange}
//               required
//               maxLength={6}
//             />
//           </div>

//           <div className='grid grid-cols-2 gap-4'>
//             <div className='flex flex-col gap-1.5'>
//               <Label htmlFor='latitude'>
//                 Latitude <span className='text-muted-foreground text-xs'>(optional)</span>
//               </Label>
//               <Input
//                 id='latitude' name='latitude'
//                 type='number'
//                 placeholder='e.g. 23.2599'
//                 value={data.latitude ?? ''}
//                 onChange={handleChange}
//               />
//             </div>
//             <div className='flex flex-col gap-1.5'>
//               <Label htmlFor='longitude'>
//                 Longitude <span className='text-muted-foreground text-xs'>(optional)</span>
//               </Label>
//               <Input
//                 id='longitude' name='longitude'
//                 type='number'
//                 placeholder='e.g. 77.4126'
//                 value={data.longitude ?? ''}
//                 onChange={handleChange}
//               />
//             </div>
//           </div>

//           {error && (
//             <p className='text-sm text-red-500'>{error}</p>
//           )}

//           <Button type='submit' disabled={loading} className='w-full'>
//             {loading ? 'Saving...' : 'Continue to Step 2 →'}
//           </Button>

//         </form>
//       </CardContent>
//     </Card>
//   )
// }

// export default Step1Form
'use client'
import React, { useState } from 'react'
import { z } from 'zod'
import { registerFarmStep1 } from '@/lib/api/farmReg'
import { FarmStep1 } from '@/types/farmregistration'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { MapPin, Loader2, AlertCircle } from 'lucide-react'
import RegistrationLayout from './RegistrationLayout'

// Mirrors src/validators/schemas.ts -> Step1Schema exactly.
const Step1Schema = z.object({
  name: z.string().min(2, 'Farm name must be at least 2 characters').max(100, 'Farm name is too long'),
  areaHectares: z.number().positive('Area must be greater than 0'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  state: z.string().min(2, 'State must be at least 2 characters'),
  pincode: z.string().regex(/^\d{6}$/, 'Pincode must be exactly 6 digits'),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
})

type FieldErrors = Partial<Record<keyof FarmStep1, string>>

interface Step1FormProps {
  onSuccess: (sessionId: string) => void
}

const initialData: FarmStep1 = {
  name: '',
  areaHectares: 0,
  address: '',
  city: '',
  state: '',
  pincode: '',
  latitude: undefined,
  longitude: undefined,
}

const Step1Form = ({ onSuccess }: Step1FormProps) => {
  const [data, setData] = useState<FarmStep1>(initialData)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [touched, setTouched] = useState<Partial<Record<keyof FarmStep1, boolean>>>({})
  const [loading, setLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const validateField = (name: keyof FarmStep1, value: unknown) => {
    const shape = Step1Schema.shape[name]
    if (!shape) return
    const result = shape.safeParse(value)
    setErrors(prev => ({
      ...prev,
      [name]: result.success ? undefined : result.error.issues[0]?.message,
    }))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const key = name as keyof FarmStep1
    const isNumericField = key === 'areaHectares' || key === 'latitude' || key === 'longitude'

    const nextValue =
      key === 'pincode'
        ? value.replace(/\D/g, '').slice(0, 6)
        : isNumericField
          ? value === '' ? undefined : Number(value)
          : value

    setData(prev => ({ ...prev, [key]: nextValue }))
    if (touched[key]) validateField(key, nextValue)
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const key = e.target.name as keyof FarmStep1
    setTouched(prev => ({ ...prev, [key]: true }))
    validateField(key, data[key])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    const result = Step1Schema.safeParse(data)
    if (!result.success) {
      const fieldErrors: FieldErrors = {}
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof FarmStep1
        if (!fieldErrors[key]) fieldErrors[key] = issue.message
      }
      setErrors(fieldErrors)
      setTouched({
        name: true, areaHectares: true, address: true,
        city: true, state: true, pincode: true,
        latitude: true, longitude: true,
      })
      return
    }

    setLoading(true)
    try {
      const res = await registerFarmStep1(result.data)
      if (!res) {
        setFormError('We could not save this step. Check your connection and try again.')
        return
      }
      onSuccess(res.sessionId)
    } catch {
      setFormError('Something went wrong on our end. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const fieldError = (key: keyof FarmStep1) => touched[key] ? errors[key] : undefined

const inputClass = (key: keyof FarmStep1) =>
  [
    'bg-white text-[#2d3a24] placeholder:text-[#a39d87]',
    fieldError(key)
      ? 'border-red-400 focus-visible:ring-red-300'
      : 'border-[#dcd6c4] focus-visible:ring-[#4a6b3f]',
  ].join(' ')
  return (
    <RegistrationLayout
      currentStep={1}
      heading={<>Let&apos;s set up<br />your farm.</>}
      subheading='Start with the basics — name, size, and where it is.'
    >
      <h2 className='mb-6 text-2xl font-bold text-[#2d3a24]'>Basic Information</h2>

      <form onSubmit={handleSubmit} noValidate className='flex flex-col gap-5'>

        <Field label='Farm Name' error={fieldError('name')}>
          <Input
            id='name' name='name'
            placeholder='e.g. Green Valley Farm'
            value={data.name}
            onChange={handleChange}
            onBlur={handleBlur}
            className={inputClass('name')}
            aria-invalid={!!fieldError('name')}
          />
        </Field>

        <Field label='Area (Hectares)' error={fieldError('areaHectares')}>
          <Input
            id='areaHectares' name='areaHectares'
            type='number'
            step='0.01'
            min='0'
            placeholder='e.g. 5.2'
            value={data.areaHectares || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            className={inputClass('areaHectares')}
            aria-invalid={!!fieldError('areaHectares')}
          />
        </Field>

        <Field label='Address' error={fieldError('address')}>
          <Input
            id='address' name='address'
            placeholder='e.g. Village Rampur, Near Highway 44'
            value={data.address}
            onChange={handleChange}
            onBlur={handleBlur}
            className={inputClass('address')}
            aria-invalid={!!fieldError('address')}
          />
        </Field>

        <div className='grid grid-cols-2 gap-4'>
          <Field label='City' error={fieldError('city')}>
            <Input
              id='city' name='city'
              placeholder='e.g. Bhopal'
              value={data.city}
              onChange={handleChange}
              onBlur={handleBlur}
              className={inputClass('city')}
              aria-invalid={!!fieldError('city')}
            />
          </Field>
          <Field label='State' error={fieldError('state')}>
            <Input
              id='state' name='state'
              placeholder='e.g. Madhya Pradesh'
              value={data.state}
              onChange={handleChange}
              onBlur={handleBlur}
              className={inputClass('state')}
              aria-invalid={!!fieldError('state')}
            />
          </Field>
        </div>

        <Field label='Pincode' error={fieldError('pincode')} hint='6 digits'>
          <Input
            id='pincode' name='pincode'
            inputMode='numeric'
            placeholder='e.g. 462001'
            value={data.pincode}
            onChange={handleChange}
            onBlur={handleBlur}
            className={inputClass('pincode')}
            aria-invalid={!!fieldError('pincode')}
            maxLength={6}
          />
        </Field>

        <div className='rounded-lg border border-dashed border-[#dcd6c4] bg-[#f4f1e6] p-4'>
          <div className='mb-3 flex items-center gap-1.5 text-xs font-medium text-[#6b6552]'>
            <MapPin className='h-3.5 w-3.5' />
            Coordinates <span className='text-[#a39d87]'>(optional — improves weather &amp; soil accuracy)</span>
          </div>
          <div className='grid grid-cols-2 gap-4'>
            <Field label='Latitude' error={fieldError('latitude')} compact>
              <Input
                id='latitude' name='latitude'
                type='number'
                step='any'
                placeholder='e.g. 23.2599'
                value={data.latitude ?? ''}
                onChange={handleChange}
                onBlur={handleBlur}
                className={inputClass('latitude')}
                aria-invalid={!!fieldError('latitude')}
              />
            </Field>
            <Field label='Longitude' error={fieldError('longitude')} compact>
              <Input
                id='longitude' name='longitude'
                type='number'
                step='any'
                placeholder='e.g. 77.4126'
                value={data.longitude ?? ''}
                onChange={handleChange}
                onBlur={handleBlur}
                className={inputClass('longitude')}
                aria-invalid={!!fieldError('longitude')}
              />
            </Field>
          </div>
        </div>

        {formError && (
          <div className='flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700'>
            <AlertCircle className='mt-0.5 h-4 w-4 shrink-0' />
            <span>{formError}</span>
          </div>
        )}

        <Button
          type='submit'
          disabled={loading}
          className='w-full bg-[#4a6b3f] text-[#f4f1e6] hover:bg-[#3d5834] disabled:opacity-70'
        >
          {loading ? (
            <span className='flex items-center justify-center gap-2'>
              <Loader2 className='h-4 w-4 animate-spin' />
              Saving...
            </span>
          ) : (
            'Continue to Step 2 →'
          )}
        </Button>

      </form>
    </RegistrationLayout>
  )
}

function Field({
  label,
  error,
  hint,
  compact,
  children,
}: {
  label: string
  error?: string
  hint?: string
  compact?: boolean
  children: React.ReactNode
}) {
  return (
    <div className='flex flex-col gap-1.5'>
      <div className='flex items-baseline justify-between'>
        <Label className={compact ? 'text-xs text-[#6b6552]' : 'text-[#2d3a24]'}>
          {label}
        </Label>
        {hint && !error && (
          <span className='text-xs text-[#a39d87]'>{hint}</span>
        )}
      </div>
      {children}
      {error && (
        <span className='flex items-center gap-1 text-xs text-red-600'>
          <AlertCircle className='h-3 w-3' />
          {error}
        </span>
      )}
    </div>
  )
}

export default Step1Form