'use client'

import { getFarms } from "@/lib/api/farms"
import { Farm } from "@/types/farmregistration"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

const AllFarms = () => {
  const [farms, setFarms] = useState<Farm[]>([])
  const [loading, setLoading] = useState(true)
  console.log(farms)
  const router=useRouter();
  useEffect(() => {
    const loadFarms = async () => {
      const data = await getFarms()
      console.log(data)
      setFarms(data)
      setLoading(false)
    }
    loadFarms()
  }, [])

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <p style={{ color: 'rgba(255,255,255,0.5)', fontFamily: "'DM Sans', sans-serif" }}>Loading farms...</p>
    </div>
  )

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500&display=swap');

        .af-wrap {
          padding: 2rem 5%;
          font-family: 'DM Sans', sans-serif;
        
        }

        .af-header {
          margin-bottom: 2rem;
        }

        .af-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.8rem;
          font-weight: 700;
          color: #f0ede6;
          margin-bottom: 0.3rem;
        }

        .af-subtitle {
          font-size: 0.88rem;
          color: rgba(240,237,230,0.45);
        }

        .af-table-wrap {
          border-radius: 14px;
          border: 1px solid rgba(82,183,136,0.12);
          overflow: hidden;
          background: rgba(15,25,20,0.6);
          backdrop-filter: blur(12px);
        }

        .af-table {
          width: 100%;
          border-collapse: collapse;
        }

        .af-table thead tr {
          background: rgba(82,183,136,0.08);
          border-bottom: 1px solid rgba(82,183,136,0.12);
        }

        .af-table th {
          padding: 0.9rem 1.2rem;
          text-align: left;
          font-size: 0.75rem;
          font-weight: 500;
          color: rgba(82,183,136,0.8);
          text-transform: uppercase;
          letter-spacing: 1px;
          white-space: nowrap;
        }

        .af-table tbody tr {
          border-bottom: 1px solid rgba(255,255,255,0.04);
          transition: background 0.15s;
        }

        .af-table tbody tr:last-child {
          border-bottom: none;
        }

        .af-table tbody tr:hover {
          background: rgba(82,183,136,0.04);
        }

        .af-table td {
          padding: 1rem 1.2rem;
          font-size: 0.875rem;
          color: rgba(240,237,230,0.8);
          vertical-align: middle;
        }

        .af-farm-name {
          font-weight: 500;
          color: #f0ede6;
        }

        .af-owner {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }

        .af-owner-name {
          font-weight: 500;
          color: #f0ede6;
        }

        .af-owner-email {
          font-size: 0.78rem;
          color: rgba(240,237,230,0.4);
        }

        .af-badge {
          display: inline-flex;
          align-items: center;
          padding: 0.2rem 0.65rem;
          border-radius: 100px;
          font-size: 0.72rem;
          font-weight: 500;
          white-space: nowrap;
        }

        .af-badge-active {
          background: rgba(82,183,136,0.12);
          color: #52b788;
          border: 1px solid rgba(82,183,136,0.2);
        }

        .af-badge-inactive {
          background: rgba(255,255,255,0.06);
          color: rgba(240,237,230,0.4);
          border: 1px solid rgba(255,255,255,0.08);
        }

        .af-badge-verified {
          background: rgba(233,168,0,0.1);
          color: #e9a800;
          border: 1px solid rgba(233,168,0,0.2);
        }

        .af-btn-view {
          background: transparent;
          color: #52b788;
          border: 1px solid rgba(82,183,136,0.3);
          padding: 0.35rem 0.9rem;
          border-radius: 7px;
          font-size: 0.8rem;
          font-weight: 500;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .af-btn-view:hover {
          background: rgba(82,183,136,0.1);
          border-color: rgba(82,183,136,0.5);
        }

        .af-empty {
          text-align: center;
          padding: 4rem;
          color: rgba(240,237,230,0.3);
          font-size: 0.9rem;
        }

        .af-count {
          font-size: 0.82rem;
          color: rgba(240,237,230,0.4);
          margin-top: 1rem;
          padding: 0 0.2rem;
        }
      `}</style>

      <div className="af-wrap">
        <div className="af-header">
          <h1 className="af-title">All Farms</h1>
          <p className="af-subtitle">Manage and review all registered farms</p>
        </div>

        <div className="af-table-wrap">
          <table className="af-table">
            <thead>
              <tr>
                <th>Farm</th>
                <th>Owner</th>
                <th>Location</th>
                <th>Area</th>
                <th>Status</th>
                <th>Verified</th>
                <th>Crops</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {farms.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <div className="af-empty">No farms found</div>
                  </td>
                </tr>
              ) : (
                farms.map(farm => (
                  <tr key={farm.id}>

                    {/* Farm Name */}
                    <td>
                      <span className="af-farm-name">{farm.name}</span>
                    </td>

                    {/* Owner */}
                    <td>
                      <div className="af-owner">
                        <span className="af-owner-name">
                          {farm.owner?.firstName} {farm.owner?.lastName}
                        </span>
                        <span className="af-owner-email">{farm.owner?.email}</span>
                      </div>
                    </td>

                    {/* Location */}
                    <td>{farm.city}, {farm.state}</td>

                    {/* Area */}
                    <td>{farm.areaHectares} ha</td>

                    {/* Status */}
                    <td>
                      <span className={`af-badge ${farm.status === 'ACTIVE' ? 'af-badge-active' : 'af-badge-inactive'}`}>
                        {farm.status}
                      </span>
                    </td>

                    {/* Verified */}
                    <td>
                      {farm.isVerified ? (
                        <span className="af-badge af-badge-verified">Verified</span>
                      ) : (
                        <span className="af-badge af-badge-inactive">Pending</span>
                      )}
                    </td>

                    {/* Crop Cycles */}
                    <td>{farm._count?.cropCycles ?? 0}</td>

                    {/* View Button */}
                    <td>
                   <button 
  className="af-btn-view"
  onClick={() => router.push(`/admin/all-farms/${farm.id}`)}
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

        {farms.length > 0 && (
          <p className="af-count">{farms.length} farm{farms.length !== 1 ? 's' : ''} total</p>
        )}
      </div>
    </>
  )
}

export default AllFarms