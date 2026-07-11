import { FarmStep1,Step1Response,FarmStep2,Step2Response, Step3Response, FarmStep3, Crops, FarmStep4, FarmStep5, FarmStep6, SubmitResponse, MyFarm } from "@/types/farmregistration"
export async function registerFarmStep1(data: FarmStep1): Promise<Step1Response | null> {
  try {
    const res = await fetch('/api/farm-registration/step1', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })

    if (!res.ok) return null

    const json = await res.json()
    return json.data  

  } catch {
    return null
  }
}

export async function registerFarmStep2(data: FarmStep2): Promise<Step2Response | null> {
  try {
    const res = await fetch('/api/farm-registration/step2', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })

    if (!res.ok) return null

    const json = await res.json()
    return json.data  

  } catch {
    return null
  }
}

export async function registerFarmStep3(data: FarmStep3): Promise<Step3Response | null> {
  try {
    const res = await fetch('/api/farm-registration/step3', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })

    if (!res.ok) return null

    const json = await res.json()
    return json.data  

  } catch {
    return null
  }
}
export async function registerFarmStep4(data: FarmStep4): Promise<Step3Response | null> {
  try {
    const res = await fetch('/api/farm-registration/step4', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })

    if (!res.ok) return null

    const json = await res.json()
    return json.data  

  } catch {
    return null
  }
}


export async function registerFarmStep5(data: FarmStep5): Promise<Step3Response | null> {
  try {
    const res = await fetch('/api/farm-registration/step5', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })

    if (!res.ok) return null

    const json = await res.json()
    return json.data  

  } catch {
    return null
  }
}
export async function registerFarmStep6(data: FarmStep6): Promise<Step3Response | null> {
  try {
    const res = await fetch('/api/farm-registration/step6', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })

    if (!res.ok) return null

    const json = await res.json()
    return json.data  

  } catch {
    return null
  }
}

export async function getCrops(): Promise<Crops[]> {
  
  try {
    const res = await fetch('/api/crops', {
      method: 'GET',
      credentials: 'include',
  
    })

   if(!res.ok){
    return []
   }

    const json = await res.json()
    return json.data  

  } catch {
    return[]
  }
}

export async function submitFarmRegistration(sessionId: string): Promise<SubmitResponse | null> {

  try {
    const res = await fetch('/api/farm-registration/submit', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId })
    })
    if (!res.ok) return null
    const json = await res.json()
    return json.data  
  } catch {
    return null
  }
}

export async function getMyFarm(): Promise<MyFarm | null> {
  try {
    const res = await fetch('/api/farms/my-farm', {
      method: 'GET',
      credentials: 'include',
    })

    // No farm yet — expected for new users, not an error
    if (res.status === 404) {
      return null
    }

    if (!res.ok) {
      const text = await res.text()
      throw new Error(`getMyFarm failed: ${res.status} ${text}`)
    }

    const json = await res.json()
    return json.data
  } catch (error) {
    console.error(error)
    return null
  }
}
