// "use client";
// import { useState, useRef, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import AvatarPicker from "@/components/AvtarPicker";

// type Profile = {
//   id: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   phone: string;
//   role: string;
//   status: string;
//   avatarUrl: string;
//   bio: string;
//   address: string;
//   city: string;
//   state: string;
//   country: string;
//   pincode: string;
// };

// export default function ProfilePage() {
//   const router = useRouter();
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const [profile, setProfile] = useState<Profile>({
//     id: "", firstName: "", lastName: "", email: "", phone: "",
//     role: "", status: "", avatarUrl: "", bio: "",
//     address: "", city: "", state: "", country: "", pincode: "",
//   });

//   const [loading, setLoading] = useState(true);
//   const [preview, setPreview] = useState<string>("");
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [uploading, setUploading] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [deleting, setDeleting] = useState(false);
//   const [message, setMessage] = useState("");
//   const [messageType, setMessageType] = useState<"success" | "error">("success");
//   const [isDragging, setIsDragging] = useState(false);
//   const [lastSaved, setLastSaved] = useState<Date | null>(null);

//   // Auto-dismiss messages after 4 seconds
//   useEffect(() => {
//     if (!message) return;
//     const timer = setTimeout(() => setMessage(""), 4000);
//     return () => clearTimeout(timer);
//   }, [message]);

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const res = await fetch("/api/profile", { credentials: "include" });
//         const data = await res.json();
//         if (res.ok) {
//           setProfile(data.data);
//         } else {
//           setMessage(data.message || "Failed to load profile");
//           setMessageType("error");
//         }
//       } catch {
//         setMessage("Failed to load profile");
//         setMessageType("error");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProfile();
//   }, []);

//   const handleFileSelect = (file: File) => {
//     if (!file.type.startsWith("image/")) {
//       setMessage("Only image files are allowed");
//       setMessageType("error");
//       return;
//     }
//     if (file.size > 5 * 1024 * 1024) {
//       setMessage("File size must be under 5MB");
//       setMessageType("error");
//       return;
//     }
//     setSelectedFile(file);
//     const reader = new FileReader();
//     reader.onload = (e) => setPreview(e.target?.result as string);
//     reader.readAsDataURL(file);
//     setMessage("");
//   };

//   // ✅ Cancel selected file without refreshing
//   const handleCancelFile = () => {
//     setSelectedFile(null);
//     setPreview("");
//     if (fileInputRef.current) fileInputRef.current.value = "";
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setProfile((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) handleFileSelect(file);
//   };

//   const handleDrop = (e: React.DragEvent) => {
//     e.preventDefault();
//     setIsDragging(false);
//     const file = e.dataTransfer.files?.[0];
//     if (file) handleFileSelect(file);
//   };

//   const handleUploadAvatar = async () => {
//     if (!selectedFile) return;
//     setUploading(true);
//     try {
//       const formData = new FormData();
//       formData.append("file", selectedFile);
//       const res = await fetch("/api/profile/avatar", {
//         method: "POST",
//         credentials: "include",
//         body: formData,
//       });
//       const data = await res.json();
//       if (!res.ok) {
//         setMessage(data.message || "Upload failed");
//         setMessageType("error");
//         return;
//       }
//       setProfile((prev) => prev ? { ...prev, avatarUrl: data.data.avatarUrl } : prev);
//       handleCancelFile();
//       setMessage("Avatar updated successfully!");
//       setMessageType("success");
//     } catch {
//       setMessage("Something went wrong. Try again.");
//       setMessageType("error");
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleSaveProfile = async (section: "personal" | "address") => {
//     setSaving(true);
//     setMessage("");
//     try {
//       // ✅ Only send relevant section — prevents clearing fields with empty strings
//       const personalPayload = {
//         ...(profile.firstName && { firstName: profile.firstName }),
//         ...(profile.lastName && { lastName: profile.lastName }),
//         ...(profile.phone && { phone: profile.phone }),
//         ...(profile.bio && { bio: profile.bio }),
//       };

//       const addressPayload = {
//         ...(profile.address && { address: profile.address }),
//         ...(profile.city && { city: profile.city }),
//         ...(profile.state && { state: profile.state }),
//         ...(profile.country && { country: profile.country }),
//         ...(profile.pincode && { pincode: profile.pincode }),
//       };

//       const payload = section === "personal" ? personalPayload : addressPayload;

//       const res = await fetch("/api/profile", {
//         method: "PUT",
//         credentials: "include",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         if (data.errors) {
//           const errorMessages = Object.entries(data.errors)
//             .map(([field, msgs]) => `${field}: ${(msgs as string[]).join(", ")}`)
//             .join(" | ");
//           setMessage(errorMessages);
//         } else {
//           setMessage(data.message || "Failed to save");
//         }
//         setMessageType("error");
//         return;
//       }

//       setProfile((prev) => ({ ...prev, ...data.data }));
//       setLastSaved(new Date());
//       setMessage(section === "personal" ? "Profile saved!" : "Address saved!");
//       setMessageType("success");
//     } catch {
//       setMessage("Something went wrong. Try again.");
//       setMessageType("error");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleDeleteAccount = async () => {
//     if (!confirm("Are you sure you want to delete your account? This cannot be undone!")) return;
//     setDeleting(true);
//     try {
//       const res = await fetch("/api/profile", { method: "DELETE", credentials: "include" });
//       if (res.ok) {
//         router.replace("/login");
//       } else {
//         setMessage("Failed to delete account");
//         setMessageType("error");
//       }
//     } catch {
//       setMessage("Something went wrong.");
//       setMessageType("error");
//     } finally {
//       setDeleting(false);
//     }
//   };

//   const avatarSrc = preview || profile.avatarUrl;
//   const initials = `${profile.firstName?.[0] ?? ""}${profile.lastName?.[0] ?? ""}`.toUpperCase();

//   // ✅ Status color helper
//   const statusColor = profile.status === "ACTIVE"
//     ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
//     : "bg-red-500/10 text-red-400 border-red-500/30";

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
//         <div className="space-y-3 text-center">
//           <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
//           <p className="text-white/40 text-sm animate-pulse">Loading profile...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#0f0f0f] text-white font-sans">
//       <div className="border-b border-white/10 px-8 py-4 flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
//           <span className="text-sm text-white/50 tracking-widest uppercase">Profile</span>
//           {/* ✅ Account status badge */}
//           {profile.status && (
//             <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wide ${statusColor}`}>
//               {profile.status}
//             </span>
//           )}
//         </div>
//         <div className="flex items-center gap-4">
//           {/* ✅ Last saved indicator */}
//           {lastSaved && (
//             <span className="text-xs text-white/20">
//               Last saved {lastSaved.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
//             </span>
//           )}
//           <button onClick={() => router.back()} className="text-sm text-white/40 hover:text-white transition-colors">
//             ← Back
//           </button>
//         </div>
//       </div>
//   {/* <AvatarPicker/> */}
//       <div className="max-w-3xl mx-auto px-6 py-12 space-y-8">

//         {/* ✅ Auto-dismissing message banner */}
//         {message && (
//           <div className={`px-5 py-3 rounded-xl text-sm font-medium border flex items-center justify-between ${
//             messageType === "success"
//               ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
//               : "bg-red-500/10 border-red-500/30 text-red-400"
//           }`}>
//             <span>{messageType === "success" ? "✓ " : "✕ "}{message}</span>
//             <button onClick={() => setMessage("")} className="ml-4 opacity-60 hover:opacity-100 text-lg leading-none">×</button>
//           </div>
//         )}
     
//         {/* Avatar */}
//         <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
//           <h2 className="text-xs uppercase tracking-widest text-white/40 mb-6">Profile Photo</h2>
//           <div className="flex items-start gap-8">
//             <div className="relative flex-shrink-0">
//               <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-white/10">
//                 {avatarSrc ? (
//                   <img src={avatarSrc} alt="Avatar" className="w-full h-full object-cover" />
//                 ) : (
//                   <div className="w-full h-full bg-gradient-to-br from-emerald-500/30 to-teal-500/30 flex items-center justify-center">
//                     <span className="text-2xl font-bold text-white">{initials}</span>
//                   </div>
//                 )}
//               </div>
//               {profile.role && (
//                 <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
//                   {profile.role.replace(/_/g, " ")}
//                 </div>
//               )}
//             </div>
//             <div className="flex-1 space-y-3">
//               <div
//                 onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
//                 onDragLeave={() => setIsDragging(false)}
//                 onDrop={handleDrop}
//                 onClick={() => !selectedFile && fileInputRef.current?.click()}
//                 className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
//                   selectedFile ? "border-emerald-500/40 bg-emerald-500/5 cursor-default" :
//                   isDragging ? "border-emerald-400 bg-emerald-400/5 cursor-copy" :
//                   "border-white/10 hover:border-white/30 hover:bg-white/5 cursor-pointer"
//                 }`}
//               >
//                 <div className="text-3xl mb-2">{selectedFile ? "✓" : "↑"}</div>
//                 <p className="text-sm text-white/60">
//                   {selectedFile ? selectedFile.name : "Drop image here or click to browse"}
//                 </p>
//                 <p className="text-xs text-white/30 mt-1">PNG, JPG, WEBP up to 5MB</p>
//               </div>
//               <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileInputChange} className="hidden" />

//               {/* ✅ Upload + Cancel buttons */}
//               {selectedFile && (
//                 <div className="flex gap-2">
//                   <button
//                     onClick={handleUploadAvatar}
//                     disabled={uploading}
//                     className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black text-sm font-bold rounded-xl transition-colors"
//                   >
//                     {uploading ? "Uploading..." : "Upload Photo"}
//                   </button>
//                   <button
//                     onClick={handleCancelFile}
//                     disabled={uploading}
//                     className="px-4 py-2.5 border border-white/10 text-white/50 hover:text-white hover:border-white/30 text-sm rounded-xl transition-colors"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//         <div className="grid grid-cols-3">
//         </div>
//         {/* Personal Info */}
//         <div className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-6">
//           <h2 className="text-xs uppercase tracking-widest text-white/40">Personal Info</h2>
//           <div className="grid grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <label className="text-xs text-white/40 uppercase tracking-wider">First Name</label>
//               <input name="firstName" type="text" value={profile.firstName} onChange={handleInputChange}
//                 className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500/50 transition-colors" />
//             </div>
//             <div className="space-y-2">
//               <label className="text-xs text-white/40 uppercase tracking-wider">Last Name</label>
//               <input name="lastName" type="text" value={profile.lastName} onChange={handleInputChange}
//                 className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500/50 transition-colors" />
//             </div>
//           </div>
//           <div className="space-y-2">
//             <label className="text-xs text-white/40 uppercase tracking-wider">Email</label>
//             <input type="email" value={profile.email} disabled
//               className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white/40 text-sm cursor-not-allowed" />
//             <p className="text-xs text-white/20">Email cannot be changed</p>
//           </div>
//           <div className="space-y-2">
//             <label className="text-xs text-white/40 uppercase tracking-wider">Phone</label>
//             <input name="phone" type="tel" value={profile.phone ?? ""} onChange={handleInputChange}
//               className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500/50 transition-colors" />
//           </div>
//           <div className="space-y-2">
//             <label className="text-xs text-white/40 uppercase tracking-wider">Bio</label>
//             <textarea name="bio" value={profile.bio ?? ""} onChange={handleInputChange} rows={3}
//               placeholder="Tell us about yourself..."
//               className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500/50 transition-colors resize-none" />
//           </div>
//           {/* ✅ Section-specific save */}
//           <button onClick={() => handleSaveProfile("personal")} disabled={saving}
//             className="w-full py-3 bg-white text-black text-sm font-bold rounded-xl hover:bg-white/90 disabled:opacity-50 transition-colors">
//             {saving ? "Saving..." : "Save Changes"}
//           </button>
//         </div>

//         {/* Address */}
//         <div className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-6">
//           <h2 className="text-xs uppercase tracking-widest text-white/40">Address</h2>
//           <div className="space-y-2">
//             <label className="text-xs text-white/40 uppercase tracking-wider">Street Address</label>
//             <input name="address" type="text" value={profile.address ?? ""} onChange={handleInputChange}
//               placeholder="123 Main St"
//               className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500/50 transition-colors" />
//           </div>
//           <div className="grid grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <label className="text-xs text-white/40 uppercase tracking-wider">City</label>
//               <input name="city" type="text" value={profile.city ?? ""} onChange={handleInputChange}
//                 className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500/50 transition-colors" />
//             </div>
//             <div className="space-y-2">
//               <label className="text-xs text-white/40 uppercase tracking-wider">State</label>
//               <input name="state" type="text" value={profile.state ?? ""} onChange={handleInputChange}
//                 className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500/50 transition-colors" />
//             </div>
//           </div>
//           <div className="grid grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <label className="text-xs text-white/40 uppercase tracking-wider">Country</label>
//               <input name="country" type="text" value={profile.country ?? ""} onChange={handleInputChange}
//                 className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500/50 transition-colors" />
//             </div>
//             <div className="space-y-2">
//               <label className="text-xs text-white/40 uppercase tracking-wider">Pincode</label>
//               <input name="pincode" type="text" value={profile.pincode ?? ""} onChange={handleInputChange}
//                 className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500/50 transition-colors" />
//             </div>
//           </div>
//           {/* ✅ Section-specific save */}
//           <button onClick={() => handleSaveProfile("address")} disabled={saving}
//             className="w-full py-3 bg-white text-black text-sm font-bold rounded-xl hover:bg-white/90 disabled:opacity-50 transition-colors">
//             {saving ? "Saving..." : "Save Address"}
//           </button>
//         </div>

//         {/* Danger Zone */}
//         <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-8 space-y-4">
//           <h2 className="text-xs uppercase tracking-widest text-red-400/60">Danger Zone</h2>
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-white/60">Delete your account</p>
//               <p className="text-xs text-white/30 mt-0.5">This action cannot be undone</p>
//             </div>
//             <button onClick={handleDeleteAccount} disabled={deleting}
//               className="px-4 py-2 border border-red-500/30 text-red-400 text-sm rounded-xl hover:bg-red-500/10 disabled:opacity-50 transition-colors">
//               {deleting ? "Deleting..." : "Delete Account"}
//             </button>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }

// 'use client'
// import React, { useState, useRef, useEffect } from "react";
// import { Check, Sprout } from "lucide-react";

// const COLORS = {
//   bg: "#122016",
//   bgDeep: "#0C1710",
//   card: "#1B2E20",
//   cream: "#F4EEDC",
//   creamDim: "#C9C3AE",
//   lime: "#C7F547",
//   limeDeep: "#9BC22E",
//   soil: "#5B4130",
//   sage: "#7C9473",
// };

// const FARMERS = [
//   { name: "Ramesh Yadav", role: "Wheat farmer", seed: "Ramesh-Yadav-9" },
//   { name: "Sunita Devi", role: "Mango grower", seed: "Sunita-Devi-4" },
//   { name: "Arjun Patel", role: "Cotton farmer", seed: "Arjun-Patel-7" },
//   { name: "Kamla Bai", role: "Vegetable grower", seed: "Kamla-Bai-2" },
//   { name: "Vikram Singh", role: "Soybean farmer", seed: "Vikram-Singh-5" },
//   { name: "Meena Kumari", role: "Rice farmer", seed: "Meena-Kumari-8" },
//   { name: "Suresh Chandra", role: "Orchard keeper", seed: "Suresh-Chandra-1" },
//   { name: "Radha Sharma", role: "Dairy and crop farmer", seed: "Radha-Sharma-3" },
// ];

// const avatarUrl =['./farmer1.png','./farmer2.png','./farmer3.png','./farmer4.png','farmer5.png','farmer6.png','farmer7.png','farmer8.png']

// export default function FarmerAvatarProfile() {
//   const [selected, setSelected] = useState(0);
//   const [saved, setSaved] = useState(false);
//   const [settling, setSettling] = useState(false);
//   const strip = useRef(null);
//   const timeoutRef = useRef(null);
// const [active,setActive]=useState('');
//   useEffect(() => {
//     setSettling(true);
//     const t = setTimeout(() => setSettling(false), 420);
//     return () => clearTimeout(t);
//   }, [selected]);

//   function choose(i) {
//     if (i === selected) return;
//     setSelected(i);
//     setSaved(false);
//   }

//   function handleSave() {
//     setSaved(true);
//     if (timeoutRef.current) clearTimeout(timeoutRef.current);
//     timeoutRef.current = setTimeout(() => setSaved(false), 2200);
//   }

//   const farmer = FARMERS[selected];

//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         width: "100%",
//         background: `radial-gradient(ellipse 900px 600px at 50% 38%, #1E3324 0%, ${COLORS.bg} 55%, ${COLORS.bgDeep} 100%)`,
//         fontFamily: "'Inter', sans-serif",
//         color: COLORS.cream,
//         position: "relative",
//         overflow: "hidden",
//       }}
//     >
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap');
//         @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
//         @keyframes popIn { 0% { transform: scale(0.85); opacity: 0.3; } 100% { transform: scale(1); opacity: 1; } }
//         @keyframes shadowPulse { 0%, 100% { transform: scaleX(1); opacity: 0.55; } 50% { transform: scaleX(0.85); opacity: 0.4; } }
//         .avatar-thumb { transition: transform 0.25s ease, filter 0.25s ease, border-color 0.25s ease; }
//         .avatar-thumb:hover { transform: translateY(-4px); }
//         .save-btn { transition: transform 0.15s ease, box-shadow 0.15s ease; }
//         .save-btn:hover { transform: translateY(-2px); }
//         .save-btn:active { transform: translateY(0px) scale(0.98); }
//         .strip-scroll::-webkit-scrollbar { height: 6px; }
//         .strip-scroll::-webkit-scrollbar-thumb { background: #3A4F3D; border-radius: 10px; }
//         .strip-scroll::-webkit-scrollbar-track { background: transparent; }
//       `}</style>

//       {/* soil dot texture */}
//       <div
//         style={{
//           position: "absolute",
//           inset: 0,
//           backgroundImage: `radial-gradient(${COLORS.sage}22 1px, transparent 1px)`,
//           backgroundSize: "26px 26px",
//           pointerEvents: "none",
//         }}
//       />

//       <div
//         style={{
//           position: "relative",
//           maxWidth: 760,
//           margin: "0 auto",
//           padding: "64px 24px 56px",
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//         }}
//       >
//         {/* eyebrow */}
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: 8,
//             color: COLORS.lime,
//             fontSize: 13,
//             fontWeight: 600,
//             letterSpacing: "0.14em",
//             textTransform: "uppercase",
//             marginBottom: 14,
//           }}
//         >
//           <Sprout size={15} strokeWidth={2.4} />
//           Field profile
//         </div>

//         <h1
//           style={{
//             fontFamily: "'Fraunces', serif",
//             fontWeight: 600,
//             fontSize: "clamp(30px, 5vw, 44px)",
//             textAlign: "center",
//             margin: 0,
//             color: COLORS.cream,
//             letterSpacing: "-0.01em",
//           }}
//         >
//           Choose your farmer
//         </h1>
//         <p
//           style={{
//             color: COLORS.creamDim,
//             fontSize: 15,
//             marginTop: 10,
//             marginBottom: 56,
//             textAlign: "center",
//           }}
//         >
//           This is how the rest of FarmSync will see you.
//         </p>

//         {/* center stage */}
//         <div
//           style={{
//             position: "relative",
//             width: 320,
//             height: 320,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             marginBottom: 8,
//           }}
//         >
//           {/* glow ring */}
//           {/* <div
//             style={{
//               position: "absolute",
//               width: 300,
//               height: 300,
//               borderRadius: "50%",
//               background: `radial-gradient(circle, ${COLORS.lime}33 0%, transparent 70%)`,
//               filter: "blur(2px)",
//             }}
//           /> */}
//           {/* rotating dashed ring */}
//           {/* <div
//             style={{
//               position: "absolute",
//               width: 268,
//               height: 268,
//               borderRadius: "50%",
//               border: `1.5px dashed ${COLORS.limeDeep}55`,
//             }}
//           /> */}
//           <div
//             key={selected}
//             style={{
//               position: "relative",
//               width: 406,
//               height: 406,
            
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               overflow: "hidden",
//               // animation: settling
//               //   ? "popIn 0.4s cubic-bezier(0.34,1.56,0.64,1)"
//               //   : "float 4.5s ease-in-out infinite",
//             }}
//           >
//             <img
//               src={active}
//               alt={farmer.name}
//               style={{ width: "100%", height: "100%",}}
//               draggable={false}
//             />
//           </div>
//         </div>

//         {/* ground shadow */}
//         <div
//           style={{
//             width: 150,
//             height: 18,
//             borderRadius: "50%",
//             background: "#00000055",
//             filter: "blur(6px)",
//             animation: "shadowPulse 4.5s ease-in-out infinite",
//             marginBottom: 26,
//           }}
//         />

//         <h2
//           style={{
//             fontFamily: "'Fraunces', serif",
//             fontWeight: 600,
//             fontSize: 24,
//             margin: 0,
//             color: COLORS.cream,
//           }}
//         >
//           {farmer.name}
//         </h2>
//         <p
//           style={{
//             color: COLORS.limeDeep,
//             fontSize: 13,
//             fontWeight: 600,
//             letterSpacing: "0.08em",
//             textTransform: "uppercase",
//             marginTop: 6,
//             marginBottom: 40,
//           }}
//         >
//           {farmer.role}
//         </p>

//         {/* furrow selector strip */}
//         <div style={{ width: "100%", position: "relative" }}>
//           <div
//             style={{
//               position: "absolute",
//               left: 0,
//               right: 0,
//               top: "50%",
//               height: 54,
//               transform: "translateY(-50%)",
//               background: `repeating-linear-gradient(180deg, ${COLORS.soil}55 0px, ${COLORS.soil}55 3px, transparent 3px, transparent 13px)`,
//               borderRadius: 16,
//               opacity: 0.5,
//               pointerEvents: "none",
//             }}
//           />
//           <div
//             ref={strip}
//             className="strip-scroll"
//             style={{
//               display: "flex",
//               gap: 18,
//               overflowX: "auto",
//               padding: "14px 8px 22px",
//               position: "relative",
//               justifyContent: FARMERS.length <= 8 ? "center" : "flex-start",
//             }}
//           >
//             {FARMERS.map((f, i) => {
//               const active = i === selected;
//               return (
//                 <button
//                   key={f.seed}
//                   onClick={() => setActive(avatarUrl[i])}
//                   aria-label={`Select ${f.name}`}
//                   className="avatar-thumb"
//                   style={{
//                     flexShrink: 0,
//                     width: active ? 68 : 56,
//                     height: active ? 68 : 56,
//                     borderRadius: "50%",
//                     border: `2.5px solid ${active ? COLORS.lime : "#3A4F3D"}`,
//                     background: COLORS.card,
//                     padding: 0,
//                     cursor: "pointer",
//                     overflow: "hidden",
//                     filter: active ? "none" : "grayscale(55%) brightness(0.75)",
//                     boxShadow: active ? `0 6px 16px -4px ${COLORS.lime}55` : "none",
//                   }}
//                 >
//                   <img
//                     src={avatarUrl[i]}
//                     alt=""
//                     style={{ width: "100%", height: "100%",  }}
//                     draggable={false}
//                   />
//                 </button>
//               );
//             })}
//           </div>
//         </div>

//         {/* save button */}
//         <button
//           onClick={handleSave}
//           className="save-btn"
//           style={{
//             marginTop: 30,
//             display: "flex",
//             alignItems: "center",
//             gap: 8,
//             background: COLORS.lime,
//             color: COLORS.bgDeep,
//             border: "none",
//             borderRadius: 999,
//             padding: "13px 30px",
//             fontSize: 15,
//             fontWeight: 700,
//             cursor: "pointer",
//             boxShadow: `0 10px 24px -8px ${COLORS.lime}66`,
//           }}
//         >
//           {saved ? (
//             <>
//               <Check size={17} strokeWidth={3} />
//               Avatar saved
//             </>
//           ) : (
//             "Save this avatar"
//           )}
//         </button>
//       </div>
//     </div>
//   );
// }

"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { Check, Sprout, Camera, X, Loader2 } from "lucide-react";

const FARMERS = [
  { name: "Ramesh Yadav", role: "Wheat farmer", src: "/avatars/farmer1.png" },
  { name: "Sunita Devi", role: "Mango grower", src: "/avatars/farmer2.png" },
  { name: "Arjun Patel", role: "Cotton farmer", src: "/avatars/farmer3.png" },
  { name: "Kamla Bai", role: "Vegetable grower", src: "/avatars/farmer4.png" },
  { name: "Vikram Singh", role: "Soybean farmer", src: "/avatars/farmer5.png" },
  { name: "Meena Kumari", role: "Rice farmer", src: "/avatars/farmer6.png" },
  { name: "Suresh Chandra", role: "Orchard keeper", src: "/avatars/farmer7.png" },
  { name: "Radha Sharma", role: "Dairy and crop farmer", src: "/avatars/farmer8.png" },
];

const MAX_FILE_BYTES = 5 * 1024 * 1024;

type AvatarPickerProps = {
  value?: string;
  onChange?: (url: string) => void;
  uploadUrl?: string;
};

 function AvatarPicker({
  value,
  onChange,
  uploadUrl = "/api/profile/avatar",
}: AvatarPickerProps) {
  const presetIndexFromValue = FARMERS.findIndex((f) => f.src === value);

  const [selectedIndex, setSelectedIndex] = useState(
    presetIndexFromValue >= 0 ? presetIndexFromValue : 0
  );
  const [customUrl, setCustomUrl] = useState(
    presetIndexFromValue === -1 && value ? value : ""
  );
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const savedTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const messageTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const showMessage = useCallback((text: string, type: "success" | "error") => {
    setMessage(text);
    setMessageType(type);
    if (messageTimeout.current) clearTimeout(messageTimeout.current);
    messageTimeout.current = setTimeout(() => setMessage(""), 4000);
  }, []);

  function handleFileSelect(file: File) {
    if (!file.type.startsWith("image/")) {
      showMessage("Only image files are allowed.", "error");
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      showMessage("File size must be under 5MB.", "error");
      return;
    }
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPendingFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setSaved(false);
  }

  function handleCancelUpload() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPendingFile(null);
    setPreviewUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function choosePreset(i: number) {
    handleCancelUpload();
    setCustomUrl("");
    setSelectedIndex(i);
    setSaved(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  }

  async function handleSave() {
    if (pendingFile) {
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", pendingFile);
        const res = await fetch(uploadUrl, {
          method: "POST",
          credentials: "include",
          body: formData,
        });
        const data = await res.json();
        if (!res.ok) {
          showMessage(data.message || "Upload failed. Try again.", "error");
          return;
        }
        const url = data.data.avatarUrl as string;
        setCustomUrl(url);
        handleCancelUpload();
        onChange?.(url);
        setSaved(true);
        savedTimeout.current && clearTimeout(savedTimeout.current);
        savedTimeout.current = setTimeout(() => setSaved(false), 2200);
      } catch {
        showMessage("Couldn't reach the server. Try again.", "error");
      } finally {
        setUploading(false);
      }
      return;
    }

    onChange?.(FARMERS[selectedIndex].src);
    setSaved(true);
    savedTimeout.current && clearTimeout(savedTimeout.current);
    savedTimeout.current = setTimeout(() => setSaved(false), 2200);
  }

  const displaySrc = previewUrl || customUrl || FARMERS[selectedIndex].src;
  const displayName = previewUrl || customUrl ? "Your photo" : FARMERS[selectedIndex].name;
  const displayRole = previewUrl
    ? "Ready to upload"
    : customUrl
    ? "Custom photo"
    : FARMERS[selectedIndex].role;

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#122016] font-sans text-[#F4EEDC]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap');
        @keyframes shadowPulse { 0%, 100% { transform: scaleX(1); opacity: 0.5; } 50% { transform: scaleX(0.88); opacity: 0.35; } }
        @keyframes slideDown { 0% { transform: translateY(-8px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
        .font-display { font-family: 'Fraunces', serif; }
        .font-sans { font-family: 'Inter', sans-serif; }
      `}</style>

      {/* soil dot texture */}
      <div className="pointer-events-none absolute inset-0 [background-image:radial-gradient(#7C947318_1px,transparent_1px)] [background-size:26px_26px]" />

      <div className="relative mx-auto px-6 py-18">
        <div className="mb-10 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#C7F547]">
          <Sprout size={15} strokeWidth={2.4} />
          Field profile
        </div>

        <div className="flex flex-col items-center gap-10 text-center md:flex-row md:items-start md:gap-14 md:text-left">
          {/* LEFT: avatar + upload badge + preset strip */}
          <div className="flex flex-shrink-0 flex-col items-center md:items-start">
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className="relative h-1/3 w-1/3"
            >
              <div
                className={`flex h-full w-full items-center justify-center overflow-hidden rounded-[20px] ${
                  isDragging ? "outline outline-2 outline-dashed outline-offset-4 outline-[#C7F547]" : ""
                }`}
              >
                <img
                  src={displaySrc}
                  alt={displayName}
                  className="h-full w-full object-cover"
                  draggable={false}
                />

                {isDragging && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-[20px] bg-[#0C1710cc] text-center text-sm font-semibold text-[#C7F547]">
                    Drop photo to preview
                  </div>
                )}
              </div>

              {pendingFile && !isDragging && (
                <button
                  onClick={handleCancelUpload}
                  aria-label="Cancel upload"
                  className="absolute -right-2.5 -top-2.5 flex h-[30px] w-[30px] items-center justify-center rounded-full border-[3px] border-[#122016] bg-[#0C1710] text-[#F4EEDC] transition-colors hover:bg-[#E8836B]"
                >
                  <X size={15} strokeWidth={2.5} />
                </button>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileSelect(file);
                }}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                aria-label="Upload your own photo"
                className="absolute -bottom-2.5 -left-2.5 flex h-11 w-11 items-center justify-center rounded-full border-[3px] border-[#122016] bg-[#C7F547] text-[#0C1710] transition-transform hover:scale-105 hover:bg-[#9BC22E]"
              >
                <Camera size={18} strokeWidth={2.3} />
              </button>
            </div>

            {/* ground shadow */}
            <div className="mx-auto m my-4 h-4 w-[240px] animate-[shadowPulse_4.5s_ease-in-out_infinite] rounded-full bg-black/30 blur-md md:ml-6 md:mr-0" />

            {/* preset strip, aligned under the avatar */}
            <div className="relative ">
              <div className="absolute left-0 right-0 top-1/2 h-12 -translate-y-1/2 rounded-2xl bg-[repeating-linear-gradient(180deg,#5B413055_0px,#5B413055_3px,transparent_3px,transparent_13px)] opacity-45" />
              <div className="relative flex justify-center gap-3.5 overflow-x-auto px-1 py-3 [scrollbar-color:#3A4F3D_transparent] [scrollbar-width:thin] md:justify-start">
                {FARMERS.map((f, i) => {
                  const active = !pendingFile && !customUrl && i === selectedIndex;
                  return (
                    <button
                      key={f.src}
                      onClick={() => choosePreset(i)}
                      aria-label={`Select ${f.name}`}
                      className={`flex-shrink-0 overflow-hidden rounded-full border-[2.5px] p-0 transition-all duration-200 hover:-translate-y-1 ${
                        active
                          ? "h-[62px] w-[62px] border-[#C7F547] shadow-[0_6px_16px_-4px_#C7F54755]"
                          : "h-[50px] w-[50px] border-[#3A4F3D] grayscale brightness-75"
                      }`}
                    >
                      <img
                        src={f.src}
                        alt=""
                        className="h-full w-full "
                        draggable={false}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT: title, details, message, save */}
          <div className="flex min-w-0 flex-col items-center pt-1.5 md:items-start">
            <h1 className="font-display text-[clamp(28px,4vw,40px)] font-semibold tracking-tight text-[#F4EEDC]">
              Choose your farmer
            </h1>
            <p className="mt-2.5 mb-6 text-[15px] text-[#C9C3AE]">
              Pick an avatar, or upload your own photo.
            </p>

            {message && (
              <div
                className={`mb-5 animate-[slideDown_0.2s_ease] rounded-[10px] border px-4 py-2.5 text-[13px] font-medium ${
                  messageType === "success"
                    ? "border-[#C7F54755] bg-[#C7F54722] text-[#C7F547]"
                    : "border-[#E8836B55] bg-[#E8836B22] text-[#E8836B]"
                }`}
              >
                {message}
              </div>
            )}

            <h2 className="font-display text-[22px] font-semibold text-[#F4EEDC]">
              {displayName}
            </h2>
            <p className="mb-8 mt-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-[#9BC22E]">
              {displayRole}
            </p>

            <button
              onClick={handleSave}
              disabled={uploading}
              className="flex items-center gap-2 rounded-full bg-[#C7F547] px-7 py-3 text-[15px] font-bold text-[#0C1710] shadow-[0_10px_24px_-8px_#C7F54766] transition-transform hover:-translate-y-0.5 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {uploading ? (
                <>
                  <Loader2 size={17} strokeWidth={3} className="animate-spin" />
                  Uploading...
                </>
              ) : saved ? (
                <>
                  <Check size={17} strokeWidth={3} />
                  Avatar saved
                </>
              ) : (
                "Save this avatar"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Profile(){
  return(
    <AvatarPicker>
    
    </AvatarPicker>
  )
}