'use client'
import React from 'react'
import { Leaf, Sprout, Check } from 'lucide-react'

// The six real steps of farm registration — this mirrors the
// RegistrationStep enum in schema.prisma, so the labels here should
// stay in sync with STEP_1_BASIC ... STEP_6_FINANCIAL.
const STEPS = [
  { id: 1, label: 'Basic Info' },
  { id: 2, label: 'Soil Data' },
  { id: 3, label: 'Crop Details' },
  { id: 4, label: 'Irrigation' },
  { id: 5, label: 'Fertilizer' },
  { id: 6, label: 'Financial' },
] as const

interface RegistrationLayoutProps {
  currentStep: number // 1-6
  eyebrow?: string
  heading: React.ReactNode
  subheading: string
  children: React.ReactNode
}

const RegistrationLayout = ({
  currentStep,
  eyebrow = 'FARM REGISTRATION',
  heading,
  subheading,
  children,
}: RegistrationLayoutProps) => {
  return (
    <div className=' w-full bg-[#0e2818] flex items-center justify-center p-4 sm:p-6'>
      <div className='relative w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-[#0e2818] shadow-2xl md:grid md:grid-cols-2'>

        {/* Left panel — brand, copy, step tracker */}
        <div className='relative flex flex-col justify-between overflow-hidden p-8 sm:p-10'>
          {/* Ambient glow accents, same language as the login screen */}
          <div className='pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#3d6b3f]/40 blur-3xl' />
          <div className='pointer-events-none absolute -bottom-32 left-10 h-64 w-64 rounded-full bg-[#1f3d24]/60 blur-3xl' />

          <div className='relative'>
            <div className='mb-6 flex items-center gap-2'>
              <Leaf className='h-3.5 w-3.5 text-[#d4f26a]' />
              <span className='text-xs font-semibold tracking-widest text-[#d4f26a]'>
                {eyebrow}
              </span>
            </div>

            <h1 className='mb-3 text-3xl font-bold leading-tight text-white sm:text-4xl'>
              {heading}
            </h1>
            <p className='mb-10 max-w-xs text-sm text-white/60'>
              {subheading}
            </p>

            {/* Step tracker — a real sequence, so numbering earns its place here */}
            <ol className='flex flex-col gap-1'>
              {STEPS.map((step) => {
                const isDone = step.id < currentStep
                const isActive = step.id === currentStep
                return (
                  <li key={step.id} className='flex items-center gap-3 py-1.5'>
                    <span
                      className={[
                        'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold transition-colors',
                        isDone
                          ? 'bg-[#d4f26a] text-[#0e2818]'
                          : isActive
                            ? 'border border-[#d4f26a] text-[#d4f26a]'
                            : 'border border-white/20 text-white/40',
                      ].join(' ')}
                    >
                      {isDone ? <Check className='h-3.5 w-3.5' /> : step.id}
                    </span>
                    <span
                      className={
                        isActive
                          ? 'text-sm font-medium text-white'
                          : isDone
                            ? 'text-sm text-white/70'
                            : 'text-sm text-white/40'
                      }
                    >
                      {step.label}
                    </span>
                  </li>
                )
              })}
            </ol>
          </div>

          <div className='relative mt-10 flex items-center gap-2 text-xs text-white/50'>
            <Sprout className='h-3.5 w-3.5 text-[#d4f26a]' />
            Built for India&apos;s farmers and agri-businesses
          </div>
        </div>

        {/* Right panel — the actual step form */}
        <div className='bg-[#fbf9f2] p-8 sm:p-10'>
          <div className='mb-1 text-xs font-medium uppercase tracking-wide text-[#4a6b3f]'>
            Step {currentStep} of {STEPS.length}
          </div>
          {children}
        </div>

      </div>
    </div>
  )
}

export default RegistrationLayout