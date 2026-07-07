// export async function LoadPeopleToChat() {
//   try{
//     const response =await fetch('/api/users',{
//         method:'GET',
//         credentials:'include'
//     })
//     if(!response.ok){
//      throw new Error('')
//     }
//     const data= await response.json();
//   }  
//   catch(error){
// console.log(error)
//   }
// }

export async function LoadPeopleToChat() {
  try {
    const response = await fetch('/api/users', { // ✅ correct path
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to load users'); // ✅ meaningful message
    }

    const data = await response.json(); // ✅ single await

    return data; // ✅ return the data
  } catch (error) {
    console.error('LOAD_PEOPLE_TO_CHAT_ERROR:', error); // ✅ console.error not log
    return null;
  }
}