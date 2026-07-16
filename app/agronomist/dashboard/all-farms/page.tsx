'use client'

import { getFarms } from "@/lib/api/farms"
import { Farm } from "@/types/farmregistration"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Sprout, MapPin } from "lucide-react"
import { ToastContainer } from "react-toastify"

const AllFarms = () => {
  const [farms, setFarms] = useState<Farm[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter();

  useEffect(() => {
    const loadFarms = async () => {
      const data = await getFarms()
      setFarms(data)
      setLoading(false)
    }
    loadFarms()
  }, [])

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-[#e3f3e3]">
      <div className="flex flex-col items-center gap-3">
        <div className="h-7 w-7 animate-spin rounded-full border-[2.5px] border-[#3F7A3E]/15 border-t-[#3F7A3E]" />
        <p className="text-[13px] font-medium uppercase tracking-widest text-[#14201A]/40">
          Loading farms
        </p>
      </div>
    </div>
  )

  const activeCount = farms.filter(f => f.status === 'ACTIVE').length
  const verifiedCount = farms.filter(f => f.isVerified).length
  const totalArea = farms.reduce((sum, f) => sum + (f.areaHectares || 0), 0)

  const initials = (first?: string, last?: string) =>
    `${first?.charAt(0) ?? ''}${last?.charAt(0) ?? ''}`.toUpperCase()

  const statCards = [
    { label: "Total Farms", value: farms.length, stripe: "from-[#6FA35A] to-[#3F7A3E]" },
    { label: "Active", value: activeCount, stripe: "from-[#3F7A3E] to-[#2E6B2D]" },
    { label: "Verified", value: verifiedCount, stripe: "from-[#C99A44] to-[#96731F]" },
    { label: "Total Hectares", value: totalArea.toFixed(1), stripe: "from-[#7C8A6E] to-[#5C6B4E]" },
  ]
  
  return (
    <div className="min-h-screen bg-[#e3f3e3] px-[5%] py-10">
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-center gap-4">
        <div className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-[13px] bg-gradient-to-br from-[#6FA35A] to-[#3F7A3E] shadow-lg shadow-[#3F7A3E]/25">
          <Sprout className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1
            className="text-[28px] font-bold leading-tight text-[#14201A]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            All Farms
          </h1>
          <p className="mt-0.5 text-[13.5px] text-[#14201A]/48">
            Manage and review all registered farms
          </p>
        </div>
      </div>

      {/* Stat cards */}
      {farms.length > 0 && (
        <div className="mb-7 grid grid-cols-2 gap-3.5 sm:grid-cols-4">
          {statCards.map((stat) => (
            <div
              key={stat.label}
              className="overflow-hidden rounded-2xl border border-[#14201A]/[0.07] bg-white"
            >
              <div className={`h-[3px] w-full bg-gradient-to-r ${stat.stripe}`} />
              <div className="p-4">
                <p
                  className="text-[26px] font-bold leading-none text-[#14201A]"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {stat.value}
                </p>
                <p className="mt-1.5 text-[11px] font-medium uppercase tracking-wide text-[#14201A]/45">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-[#14201A]/[0.08] bg-white shadow-sm shadow-[#14201A]/[0.04]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[#3F7A3E]/15 bg-gradient-to-b from-[#3F7A3E]/[0.07] to-[#3F7A3E]/[0.03]">
                <th className="whitespace-nowrap px-5 py-4 text-[11px] font-semibold uppercase tracking-wider text-[#3F7A3E]">Farm</th>
                <th className="whitespace-nowrap px-5 py-4 text-[11px] font-semibold uppercase tracking-wider text-[#3F7A3E]">Owner</th>
                <th className="whitespace-nowrap px-5 py-4 text-[11px] font-semibold uppercase tracking-wider text-[#3F7A3E]">Location</th>
                <th className="whitespace-nowrap px-5 py-4 text-[11px] font-semibold uppercase tracking-wider text-[#3F7A3E]">Area</th>
                <th className="whitespace-nowrap px-5 py-4 text-[11px] font-semibold uppercase tracking-wider text-[#3F7A3E]">Status</th>
                <th className="whitespace-nowrap px-5 py-4 text-[11px] font-semibold uppercase tracking-wider text-[#3F7A3E]">Verified</th>
                <th className="whitespace-nowrap px-5 py-4 text-[11px] font-semibold uppercase tracking-wider text-[#3F7A3E]">Crops</th>
                <th className="px-5 py-4"></th>
              </tr>
            </thead>
            <tbody>
              {farms.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <div className="flex flex-col items-center py-18 text-center">
                      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#3F7A3E]/[0.08]">
                        <Sprout className="h-6 w-6 text-[#3F7A3E]" />
                      </div>
                      <p
                        className="mb-1 text-[17px] font-semibold text-[#14201A]"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        No farms yet
                      </p>
                      <p className="text-[13.5px] text-[#14201A]/40">
                        Registered farms will show up here
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                farms.map((farm, i) => (
                  <tr
                    key={farm.id}
                    className={`border-b border-[#14201A]/[0.05] transition-colors last:border-0 hover:bg-[#3F7A3E]/[0.03] ${
                      i % 2 === 1 ? "bg-[#14201A]/[0.012]" : ""
                    }`}
                  >
                    {/* Farm Name */}
                    <td className="px-5 py-4">
                      <span className="font-semibold text-[#14201A]">{farm.name}</span>
                    </td>

                    {/* Owner */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#3F7A3E]/15 bg-gradient-to-br from-[#EDF3E8] to-[#DCE8D2] text-[11px] font-bold text-[#3F7A3E]">
                          {initials(farm.owner?.firstName, farm.owner?.lastName)}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-[#14201A]">
                            {farm.owner?.firstName} {farm.owner?.lastName}
                          </span>
                          <span className="text-[12px] text-[#14201A]/40">
                            {farm.owner?.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="px-5 py-4 text-[13.5px] text-[#14201A]/70">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-[#14201A]/35" />
                        {farm.city}, {farm.state}
                      </span>
                    </td>

                    {/* Area */}
                    <td className="px-5 py-4 text-[13.5px] text-[#14201A]/70">
                      {farm.areaHectares} ha
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${
                          farm.status === "ACTIVE"
                            ? "border-[#3F7A3E]/25 bg-[#3F7A3E]/10 text-[#2E6B2D]"
                            : "border-[#14201A]/10 bg-[#14201A]/[0.05] text-[#14201A]/45"
                        }`}
                      >
                        <span
                          className={`h-[5px] w-[5px] rounded-full ${
                            farm.status === "ACTIVE" ? "bg-[#3F7A3E]" : "bg-[#14201A]/35"
                          }`}
                        />
                        {farm.status}
                      </span>
                    </td>

                    {/* Verified */}
                    <td className="px-5 py-4">
                      {farm.isVerified ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#C99A44]/30 bg-[#C99A44]/10 px-2.5 py-1 text-[11px] font-medium text-[#96731F]">
                          <span className="h-[5px] w-[5px] rounded-full bg-[#C99A44]" />
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#14201A]/10 bg-[#14201A]/[0.05] px-2.5 py-1 text-[11px] font-medium text-[#14201A]/45">
                          <span className="h-[5px] w-[5px] rounded-full bg-[#14201A]/35" />
                          Pending
                        </span>
                      )}
                    </td>

                    {/* Crop Cycles */}
                    <td className="px-5 py-4 text-[13.5px] text-[#14201A]/70">
                      {farm._count?.cropCycles ?? 0}
                    </td>

                    {/* View Button */}
                    <td className="px-5 py-4">
                      <button
                        onClick={() => router.push(`/admin/all-farms/${farm.id}`)}
                        className="whitespace-nowrap rounded-lg border border-[#3F7A3E]/30 px-3.5 py-1.5 text-[13px] font-semibold text-[#3F7A3E] transition-all duration-200 hover:-translate-y-px hover:border-[#3F7A3E] hover:bg-[#3F7A3E] hover:text-white"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* {farms.length > 0 && (
        <p className="mt-4 px-1 text-[13px] text-[#14201A]/40">
          {farms.length} farm{farms.length !== 1 ? 's' : ''} total
        </p>
      )} */}
    </div>
  )
}

export default AllFarms