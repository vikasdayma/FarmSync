export async function Store() {
    try{
        const response =await fetch('/api/marketplace',{
            method:'GET',
            credentials:'include'
        })

        if(!response.ok){
            throw new Error('error')
        }
        const data=await response.json();
        return data.data 
        
    }
    catch{
      console.log('something went wrong')
    }
    
}

export async function getProductDetails(id: string) {
  try {
    const response = await fetch(`/api/marketplace/${id}`, {
      method: 'GET',
      credentials: 'include',
    })

    if (!response.ok) {
      const err = await response.json().catch(() => null)
      throw new Error(err?.message || `Failed to fetch product (${response.status})`)
    }

    const data = await response.json()
    return data.data

  } catch (err) {
    console.error('getProductDetails failed:', err)
    throw err  // 👈 re-throw so the calling component can catch it
  }
}