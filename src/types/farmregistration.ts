export interface Step1Response {
  sessionId: string
  currentStep: string
}

export interface Step2Response {
  sessionId: string
  currentStep: string
}

export interface Step3Response {
  sessionId: string
  currentStep: string
}
export interface FarmStep1 {
  name: string
  areaHectares: number
  address: string
  city: string
  state: string
  pincode: string
  latitude?: number
  longitude?: number
}



export type FarmStep2 = {
  sessionId: string;
  soilType: "CLAY" | "SANDY" | "LOAMY" | "SILTY" | "PEATY" | "CHALKY" | "MIXED";
  phLevel: number;
  nitrogenPpm?: number;
  phosphorusPpm?: number;
  potassiumPpm?: number;
  organicMatter?: number;
  moistureLevel?: number;
  labName?: string;
};


export interface FarmStep3 {
  sessionId: string
  cropId: string
  season: string
  year: number
  plantingDate?: string
  harvestDate?: string
  expectedYieldKg?: number
}

export interface Crops {
  id: string
  name: string
  scientificName?: string
  category: string
  season: string
  description?: string
  imageUrl?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}
export type IrrigationType = 
  | "DRIP" 
  | "SPRINKLER" 
  | "FLOOD" 
  | "FURROW" 
  | "CENTER_PIVOT" 
  | "MANUAL"

export interface FarmStep4 {
  sessionId: string
  irrigationType: IrrigationType
  waterSource: string
  frequencyDays: number
  durationMinutes: number
  notes?: string
}
export interface FarmStep5 {
  sessionId: string
  fertilizerType: string
  applicationRate: string
  frequency: string
  organicAdditives?: string[]  
  notes?: string
}

export interface FarmStep6 {
  sessionId: string
  estimatedBudget: number
  loanRequired: boolean
  loanAmount?: number
  subsidyRequired: boolean
  expectedRevenue?: number
  notes?: string
}

// types/farmregistration.ts
export interface SubmitResponse {
  farmId: string
  farmName: string
}
export interface MyFarm {
  id: string
  name: string
  status: string
}

export interface Farm {
  id: string
  name: string
  registrationNo?: string
  status: string
  areaHectares: number
  city: string
  state: string
  soilType?: string
  irrigationType?: string
  isVerified: boolean
  createdAt: string
  owner: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
  _count: {
    cropCycles: number
    soilReports: number
  }
}


