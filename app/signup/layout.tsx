import Navbar from "@/components/Navbar";



export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
<>
      
          <Navbar/>
          <main className="flex  flex-1 flex-col  h-screen  bg-[#f7f3ec]">
            {children}
            
          </main>
        
   </>
  );
}
