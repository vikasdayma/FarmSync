export async function Authenticator() {
    try{
    const response= await fetch('/api/auth/me',{
    method:"GET",
    credentials:"include"
    })
    if(response.status===401){
        return null
    }
    if(!response.ok){
        return null
    }
    const data=await response.json();    
    return data
    }
    catch{
        return null
    }
}


export async function refreshToken() {
    try{
    const response= await fetch('/api/auth/refresh',{
    method:"POST",
    credentials:"include"
    })
  
    if(!response.ok){
        return false
    }
      
    return true
    }
    catch{
        return false
    }
}