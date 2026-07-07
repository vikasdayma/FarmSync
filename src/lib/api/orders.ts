// export const getMyOrders = async (status?: string) => {
//   const params = new URLSearchParams();
//   if (status) params.append("status", status);

//   const res = await fetch(`/api/orders?${params.toString()}`, {
//     method: "GET",
//     credentials: "include",
//   });

//   if (!res.ok) {
    
//     let message = `Request failed with status ${res.status}`;
//     try {
//       const errBody = await res.json();
//       message = errBody?.error || message;
//     } catch {
  
//     }
//     return { ok: false, status: res.status, data: null, error: message };
//   }

//   const data = await res.json();
//   return { ok: true, status: res.status, data };
// };






export const getMyOrders = async (role?: "buyer" | "seller", status?: string) => {
  const params = new URLSearchParams();
  if (role) params.append("role", role);
  if (status) params.append("status", status);

  const res = await fetch(`/api/orders?${params.toString()}`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    let message = `Request failed with status ${res.status}`;
    try {
      const errBody = await res.json();
      message = errBody?.error || message;
    } catch {}
    return { ok: false, status: res.status, data: null, error: message };
  }

  const data = await res.json();
  return { ok: true, status: res.status, data };
};