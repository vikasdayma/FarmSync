
// "use client";

// import React, { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import {
//   Leaf,
//   Mail,
//   Phone,
//   Lock,
//   User,
//   Eye,
//   EyeOff,
//   Sprout,
//   Users,
//   Truck,
  
// } from "lucide-react";
// import Link from "next/link";
// type FormState = {
//   firstName: string;
//   lastName: string;
//   email: string;
//   password: string;
//   phone: string;
//   role: "FARMER" | "AGRONOMIST" | "SUPPLIER";
// };

// const ROLES: {
//   value: FormState["role"];
//   label: string;
//   icon: React.ElementType;
// }[] = [
//   { value: "FARMER", label: "Farmer", icon: Sprout },
//   { value: "AGRONOMIST", label: "Agronomist", icon: Users },
//   { value: "SUPPLIER", label: "Supplier", icon: Truck },
// ];

// export default function Register() {
//   const [form, setForm] = useState<FormState>({
//     firstName: "",
//     lastName: "",
//     email: "",
//     password: "",
//     phone: "",
//     role: "FARMER",
//   });

//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState<string>("");
//   const [showPassword, setShowPassword] = useState(false); // UI-only, no functional change

//   function handleChange(
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
//   ) {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   }

//   // helper so the role cards can reuse the same state updater
//   function handleRoleSelect(role: FormState["role"]) {
//     setForm((prev) => ({ ...prev, role }));
//   }

//   async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
//     e.preventDefault();
//     setMessage("");

//     setLoading(true);
//     try {
//       const payload = {
//         firstName: form.firstName.trim(),
//         lastName: form.lastName.trim(),
//         email: form.email.trim().toLowerCase(),
//         password: form.password,
//         phone: form.phone.replace(/\D/g, ""),
//         role: form.role,
//       };

//       console.log("PAYLOAD", payload);

//       const res = await fetch("/api/auth/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         const errMsg =
//           data?.message ||
//           (data?.errors
//             ? Object.entries(data.errors)
//                 .map(([k, v]) => `${k}: ${(v as string[]).join(", ")}`)
//                 .join(" | ")
//             : "vikasankesh@gmail.com failed");

//         console.log("REGISTER ERROR:", data);
//         setMessage(errMsg);
//         return;
//       }

//       setMessage("Registration successful. Check your email to verify.");
//     } catch (err) {
//       setMessage("Something went wrong. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0F3D2E] px-4 py-10">
//       {/* ambient background */}
//       <div className="pointer-events-none absolute inset-0">
//         <div className="absolute left-[-10%] top-[-10%] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(201,232,107,0.18)_0%,transparent_70%)]" />
//         <div className="absolute bottom-[-15%] right-[-10%] h-[480px] w-[480px] rounded-full bg-[radial-gradient(circle,rgba(143,203,79,0.15)_0%,transparent_70%)]" />
//       </div>

//       <Card className="relative z-10 grid w-full max-w-4xl overflow-hidden border-black/5 bg-white/95 p-0 shadow-2xl shadow-black/40 md:grid-cols-2">
//         {/* Left decorative panel */}
//         <div className="relative hidden flex-col justify-between bg-[#12331F] p-8 text-[#EAF3E4] md:flex">
//           <div className="absolute inset-0 opacity-20">
//             <div className="absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(201,232,107,0.4)_0%,transparent_65%)]" />
//           </div>

//           <div className="relative">
//             <div className="flex items-center gap-2 text-[#C9E86B]">
//               <Leaf className="h-5 w-5" />
//               <span className="text-xs font-semibold uppercase tracking-[0.2em]">
//                 Join the network
//               </span>
//             </div>
//             <h2 className="mt-4 text-3xl font-black leading-tight">
//               Grow your
//               <br />
//               harvest, together.
//             </h2>
//             <p className="mt-3 text-sm text-[#EAF3E4]/70">
//               Connect with farmers, agronomists, and suppliers on one trusted
//               platform.
//             </p>
//           </div>

//           <ul className="relative space-y-3 text-sm text-[#EAF3E4]/80">
//             <li className="flex items-center gap-2">
//               <Leaf className="h-3.5 w-3.5 shrink-0 text-[#C9E86B]" />
//               Direct access to buyers &amp; sellers
//             </li>
//             <li className="flex items-center gap-2">
//               <Leaf className="h-3.5 w-3.5 shrink-0 text-[#C9E86B]" />
//               Expert agronomy support
//             </li>
//             <li className="flex items-center gap-2">
//               <Leaf className="h-3.5 w-3.5 shrink-0 text-[#C9E86B]" />
//               Transparent, fair pricing
//             </li>
//           </ul>
//         </div>

//         {/* Right form panel */}
//         <CardContent className="p-6 sm:p-8">
//           <div className="mb-6">
//             <h1 className="text-2xl font-black text-[#12331F]">
//               Create your account
//             </h1>
//             <p className="mt-1 text-sm text-[#12331F]/50">
//               Fill in your details to get started.
//             </p>
//           </div>

//           <form className="space-y-4" onSubmit={handleSubmit}>
//             <div className="grid grid-cols-2 gap-3">
//               <div className="relative">
//                 <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#12331F]/35" />
//                 <Input
//                   name="firstName"
//                   placeholder="First Name"
//                   value={form.firstName}
//                   onChange={handleChange}
//                   className="pl-9"
//                 />
//               </div>

//               <div className="relative">
//                 <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#12331F]/35" />
//                 <Input
//                   name="lastName"
//                   placeholder="Last Name"
//                   value={form.lastName}
//                   onChange={handleChange}
//                   className="pl-9"
//                 />
//               </div>
//             </div>

//             <div className="relative">
//               <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#12331F]/35" />
//               <Input
//                 name="email"
//                 type="email"
//                 placeholder="Email"
//                 value={form.email}
//                 onChange={handleChange}
//                 className="pl-9"
//               />
//             </div>

//             <div className="relative">
//               <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#12331F]/35" />
//               <Input
//                 name="phone"
//                 type="tel"
//                 placeholder="Phone Number"
//                 value={form.phone}
//                 onChange={handleChange}
//                 className="pl-9"
//               />
//             </div>

//             {/* Role picker — same underlying form.role value, nicer UI */}
//             <div>
//               <label className="text-xs font-semibold uppercase tracking-wide text-[#12331F]/50">
//                 Select Role
//               </label>
//               <div className="mt-2 grid grid-cols-3 gap-2">
//                 {ROLES.map(({ value, label, icon: Icon }) => {
//                   const active = form.role === value;
//                   return (
//                     <button
//                       key={value}
//                       type="button"
//                       onClick={() => handleRoleSelect(value)}
//                       className={`flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-xs font-semibold transition-all ${
//                         active
//                           ? "border-[#12331F] bg-[#12331F] text-[#EAF3E4] shadow-md"
//                           : "border-black/10 bg-white text-[#12331F]/60 hover:border-[#12331F]/30 hover:bg-[#12331F]/5"
//                       }`}
//                     >
//                       <Icon
//                         className={`h-4 w-4 ${
//                           active ? "text-[#C9E86B]" : "text-[#12331F]/40"
//                         }`}
//                       />
//                       {label}
//                     </button>
//                   );
//                 })}
//               </div>
//             </div>

//             <div className="relative">
//               <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#12331F]/35" />
//               <Input
//                 name="password"
//                 type={showPassword ? "text" : "password"}
//                 placeholder="Password"
//                 value={form.password}
//                 onChange={handleChange}
//                 className="pl-9 pr-9"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword((s) => !s)}
//                 className="absolute right-3 top-1/2 -translate-y-1/2 text-[#12331F]/35 hover:text-[#12331F]/60"
//                 tabIndex={-1}
//               >
//                 {showPassword ? (
//                   <EyeOff className="h-4 w-4" />
//                 ) : (
//                   <Eye className="h-4 w-4" />
//                 )}
//               </button>
//             </div>

//             <Button
//               className="w-full bg-[#12331F] text-[#EAF3E4] hover:bg-[#0F3D2E]"
//               type="submit"
//               disabled={loading}
//             >
//               {loading ? "Creating..." : "Create Account"}
//             </Button>

//             {message ? (
//               <p
//                 className={`text-center text-sm ${
//                   message.includes("successful")
//                     ? "text-[#3D8B3D]"
//                     : "text-red-600"
//                 }`}
//               >
//                 {message}
//               </p>
//             ) : null}
//           </form>
//          <div className="my-6 flex items-center gap-3">
//             <div className="h-px flex-1 bg-black/10" />
//             <span className="text-xs font-medium uppercase tracking-wide text-[#12331F]/35">
//               or
//             </span>
//             <div className="h-px flex-1 bg-black/10" />
//           </div>

//           {/* Already have an account -> Login */}
//           <div className="text-center text-sm text-[#12331F]/60">
//             Already have an account?
//           </div>
//           <Link href="/login" className="mt-3 block">
//             <Button
//               type="button"
//               variant="outline"
//               className="w-full border-[#12331F]/20 text-[#12331F] hover:bg-[#12331F]/5"
//             >
//               Log In
//             </Button>
//           </Link>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Leaf,
  Mail,
  Phone,
  Lock,
  User,
  Eye,
  EyeOff,
  Sprout,
  Users,
  Truck,
} from "lucide-react";
import Link from "next/link";
import { RegisterSchema } from "@/validators/schemas"; // adjust path to wherever RegisterSchema lives

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  role: "FARMER" | "AGRONOMIST" | "SUPPLIER";
};

const ROLES: {
  value: FormState["role"];
  label: string;
  icon: React.ElementType;
}[] = [
  { value: "FARMER", label: "Farmer", icon: Sprout },
  { value: "AGRONOMIST", label: "Agronomist", icon: Users },
  { value: "SUPPLIER", label: "Supplier", icon: Truck },
];

export default function Register() {
  const [form, setForm] = useState<FormState>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    role: "FARMER",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // clear that field's error as soon as user starts correcting it
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  }

  function handleRoleSelect(role: FormState["role"]) {
    setForm((prev) => ({ ...prev, role }));
    if (errors.role) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.role;
        return next;
      });
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    setErrors({});

    const payload = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password,
      phone: form.phone.replace(/\D/g, ""),
      role: form.role,
    };

    // validate against your existing Zod schema before hitting the API
    const result = RegisterSchema.safeParse(payload);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      console.log("PAYLOAD", result.data);

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });

      const data = await res.json();

      if (!res.ok) {
        const errMsg =
          data?.message ||
          (data?.errors
            ? Object.entries(data.errors)
                .map(([k, v]) => `${k}: ${(v as string[]).join(", ")}`)
                .join(" | ")
            : "Registration failed");

        console.log("REGISTER ERROR:", data);
        setMessage(errMsg);
        return;
      }

      setMessage("Registration successful. Check your email to verify.");
    } catch (err) {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0F3D2E] px-4 py-10">
      {/* ambient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-10%] top-[-10%] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(201,232,107,0.18)_0%,transparent_70%)]" />
        <div className="absolute bottom-[-15%] right-[-10%] h-[480px] w-[480px] rounded-full bg-[radial-gradient(circle,rgba(143,203,79,0.15)_0%,transparent_70%)]" />
      </div>

      <Card className="relative z-10 grid w-full max-w-4xl overflow-hidden border-black/5 bg-white/95 p-0 shadow-2xl shadow-black/40 md:grid-cols-2">
        {/* Left decorative panel */}
        <div className="relative hidden flex-col justify-between bg-[#12331F] p-8 text-[#EAF3E4] md:flex">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(201,232,107,0.4)_0%,transparent_65%)]" />
          </div>

          <div className="relative">
            <div className="flex items-center gap-2 text-[#C9E86B]">
              <Leaf className="h-5 w-5" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em]">
                Join the network
              </span>
            </div>
            <h2 className="mt-4 text-3xl font-black leading-tight">
              Grow your
              <br />
              harvest, together.
            </h2>
            <p className="mt-3 text-sm text-[#EAF3E4]/70">
              Connect with farmers, agronomists, and suppliers on one trusted
              platform.
            </p>
          </div>

          <ul className="relative space-y-3 text-sm text-[#EAF3E4]/80">
            <li className="flex items-center gap-2">
              <Leaf className="h-3.5 w-3.5 shrink-0 text-[#C9E86B]" />
              Direct access to buyers &amp; sellers
            </li>
            <li className="flex items-center gap-2">
              <Leaf className="h-3.5 w-3.5 shrink-0 text-[#C9E86B]" />
              Expert agronomy support
            </li>
            <li className="flex items-center gap-2">
              <Leaf className="h-3.5 w-3.5 shrink-0 text-[#C9E86B]" />
              Transparent, fair pricing
            </li>
          </ul>
        </div>

        {/* Right form panel */}
        <CardContent className="p-6 sm:p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-black text-[#12331F]">
              Create your account
            </h1>
            <p className="mt-1 text-sm text-[#12331F]/50">
              Fill in your details to get started.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#12331F]/35" />
                  <Input
                    name="firstName"
                    placeholder="First Name"
                    value={form.firstName}
                    onChange={handleChange}
                    className="pl-9"
                  />
                </div>
                {errors.firstName && (
                  <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>
                )}
              </div>

              <div>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#12331F]/35" />
                  <Input
                    name="lastName"
                    placeholder="Last Name"
                    value={form.lastName}
                    onChange={handleChange}
                    className="pl-9"
                  />
                </div>
                {errors.lastName && (
                  <p className="mt-1 text-xs text-red-600">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#12331F]/35" />
                <Input
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  className="pl-9"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <div className="relative">
                <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#12331F]/35" />
                <Input
                  name="phone"
                  type="tel"
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={handleChange}
                  className="pl-9"
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
              )}
            </div>

            {/* Role picker */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-[#12331F]/50">
                Select Role
              </label>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {ROLES.map(({ value, label, icon: Icon }) => {
                  const active = form.role === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => handleRoleSelect(value)}
                      className={`flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-xs font-semibold transition-all ${
                        active
                          ? "border-[#12331F] bg-[#12331F] text-[#EAF3E4] shadow-md"
                          : "border-black/10 bg-white text-[#12331F]/60 hover:border-[#12331F]/30 hover:bg-[#12331F]/5"
                      }`}
                    >
                      <Icon
                        className={`h-4 w-4 ${
                          active ? "text-[#C9E86B]" : "text-[#12331F]/40"
                        }`}
                      />
                      {label}
                    </button>
                  );
                })}
              </div>
              {errors.role && (
                <p className="mt-1 text-xs text-red-600">{errors.role}</p>
              )}
            </div>

            <div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#12331F]/35" />
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  className="pl-9 pr-9"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#12331F]/35 hover:text-[#12331F]/60"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-600">{errors.password}</p>
              )}
            </div>

            <Button
              className="w-full bg-[#12331F] text-[#EAF3E4] hover:bg-[#0F3D2E]"
              type="submit"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Account"}
            </Button>

            {message ? (
              <p
                className={`text-center text-sm ${
                  message.includes("successful")
                    ? "text-[#3D8B3D]"
                    : "text-red-600"
                }`}
              >
                {message}
              </p>
            ) : null}
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-black/10" />
            <span className="text-xs font-medium uppercase tracking-wide text-[#12331F]/35">
              or
            </span>
            <div className="h-px flex-1 bg-black/10" />
          </div>

          <div className="text-center text-sm text-[#12331F]/60">
            Already have an account?
          </div>
          <Link href="/login" className="mt-3 block">
            <Button
              type="button"
              variant="outline"
              className="w-full border-[#12331F]/20 text-[#12331F] hover:bg-[#12331F]/5"
            >
              Log In
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}