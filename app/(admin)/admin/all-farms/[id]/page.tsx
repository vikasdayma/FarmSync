'use client'

import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthProvider'
interface SoilReport {
  id: string
  phLevel: number
  soilType: string
  testDate: string
  labName?: string
  nitrogenPpm?: number
  phosphorusPpm?: number
  potassiumPpm?: number
}

interface CropCycle {
  id: string
  season: string
  year: number
  status: string
  plantingDate?: string
  harvestDate?: string
  expectedYieldKg?: number
}

interface FarmDetail {
  id: string
  name: string
  registrationNo?: string
  status: string
  areaHectares: number
  address: string
  city: string
  state: string
  country: string
  pincode: string
  latitude?: number
  longitude?: number
  soilType?: string
  waterSource?: string
  irrigationType?: string
  isVerified: boolean
  verifiedAt?: string
  certificateUrl?: string
  createdAt: string
  owner: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
  cropCycles: CropCycle[]
  soilReports: SoilReport[]
  _count: {
    equipments: number
    diseaseReports: number
    weatherLogs: number
  }
}

const FarmDetails = () => {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string
  
  const [farm, setFarm] = useState<FarmDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
const { user } = useAuth()
const [verifying, setVerifying] = useState(false)

const handleVerify = async () => {
  setVerifying(true)
  try {
    const res = await fetch(`/api/farms/${id}/verify`, {
      method: 'PATCH',
      credentials: 'include'
    })
    if (res.ok) {
      setFarm(prev => prev ? { 
        ...prev, 
        isVerified: true,
        verifiedAt: new Date().toISOString()
      } : prev)
    }
  } finally {
    setVerifying(false)
  }
} 
  useEffect(() => {
    const loadFarm = async () => {
      try {
        const res = await fetch(`/api/farms/${id}`, {
          credentials: 'include'
        })
        if (!res.ok) { setError(true); return }
        const json = await res.json()
        setFarm(json.data)
      } catch {
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    if (id) loadFarm()
  }, [id])

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontFamily: "'DM Sans', sans-serif" }}>Loading farm details...</p>
    </div>
  )

  if (error || !farm) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
      <p style={{ color: '#e24b4a', fontFamily: "'DM Sans', sans-serif" }}>Farm not found.</p>
    </div>
  )

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500&display=swap');

        .fd-wrap {
          padding: 2rem 5% 4rem;
          font-family: 'DM Sans', sans-serif;
   
          max-width: 1100px;
        }

        .fd-back {
          display: inline-flex; align-items: center; gap: 0.4rem;
          background: none; border: none;
          color: rgba(82,183,136,0.7);
          font-size: 0.85rem; font-weight: 500;
          cursor: pointer; font-family: 'DM Sans', sans-serif;
          margin-bottom: 1.5rem;
          transition: color 0.2s;
          padding: 0;
        }
        .fd-back:hover { color: #52b788; }

        .fd-hero {
          display: flex; align-items: flex-start;
          justify-content: space-between;
          gap: 1rem; flex-wrap: wrap;
          margin-bottom: 2rem;
        }

        .fd-title {
          font-family: 'Playfair Display', serif;
          font-size: 2rem; font-weight: 900;
          color: #f0ede6; margin-bottom: 0.4rem;
        }

        .fd-meta {
          font-size: 0.85rem;
          color: rgba(240,237,230,0.4);
        }

        .fd-badges { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 0.8rem; }

        .fd-badge {
          display: inline-flex; align-items: center;
          padding: 0.2rem 0.7rem; border-radius: 100px;
          font-size: 0.72rem; font-weight: 500;
        }
        .fd-badge-green { background: rgba(82,183,136,0.12); color: #52b788; border: 1px solid rgba(82,183,136,0.2); }
        .fd-badge-amber { background: rgba(233,168,0,0.1); color: #e9a800; border: 1px solid rgba(233,168,0,0.2); }
        .fd-badge-gray  { background: rgba(255,255,255,0.06); color: rgba(240,237,230,0.4); border: 1px solid rgba(255,255,255,0.08); }
        .fd-badge-red   { background: rgba(226,75,74,0.1); color: #e24b4a; border: 1px solid rgba(226,75,74,0.2); }

        .fd-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.2rem;
          margin-bottom: 1.2rem;
        }

        .fd-grid-3 {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 1.2rem;
          margin-bottom: 1.2rem;
        }

        .fd-card {
          background: rgba(15,25,20,0.6);
          border: 1px solid rgba(82,183,136,0.1);
          border-radius: 14px;
          padding: 1.4rem;
          backdrop-filter: blur(12px);
        }

        .fd-card-title {
          font-size: 0.72rem; font-weight: 500;
          color: rgba(82,183,136,0.7);
          text-transform: uppercase; letter-spacing: 1px;
          margin-bottom: 1rem;
        }

        .fd-row {
          display: flex; justify-content: space-between;
          align-items: center;
          padding: 0.5rem 0;
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }
        .fd-row:last-child { border-bottom: none; }

        .fd-label { font-size: 0.82rem; color: rgba(240,237,230,0.4); }
        .fd-value { font-size: 0.85rem; color: #f0ede6; font-weight: 500; text-align: right; max-width: 60%; }

        .fd-stat-card {
          background: rgba(15,25,20,0.6);
          border: 1px solid rgba(82,183,136,0.1);
          border-radius: 14px;
          padding: 1.2rem;
          text-align: center;
        }
        .fd-stat-num {
          font-family: 'Playfair Display', serif;
          font-size: 2rem; font-weight: 900;
          color: #52b788; line-height: 1;
          margin-bottom: 0.3rem;
        }
        .fd-stat-label { font-size: 0.78rem; color: rgba(240,237,230,0.4); }

        .fd-table {
          width: 100%; border-collapse: collapse;
        }
        .fd-table th {
          padding: 0.7rem 1rem;
          text-align: left; font-size: 0.72rem;
          font-weight: 500; color: rgba(82,183,136,0.7);
          text-transform: uppercase; letter-spacing: 1px;
          border-bottom: 1px solid rgba(82,183,136,0.1);
        }
        .fd-table td {
          padding: 0.8rem 1rem;
          font-size: 0.82rem; color: rgba(240,237,230,0.8);
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }
        .fd-table tr:last-child td { border-bottom: none; }

        .fd-empty { color: rgba(240,237,230,0.3); font-size: 0.85rem; padding: 1rem 0; }

        .fd-owner-card {
          display: flex; align-items: center; gap: 1rem;
        }
        .fd-avatar {
          width: 44px; height: 44px; border-radius: 50%;
          background: #2d6a4f;
          display: flex; align-items: center; justify-content: center;
          color: #d8f3dc; font-weight: 700; font-size: 1.1rem;
          flex-shrink: 0;
          border: 1.5px solid rgba(82,183,136,0.3);
        }
        .fd-owner-name { font-weight: 500; color: #f0ede6; font-size: 0.95rem; }
        .fd-owner-email { font-size: 0.78rem; color: rgba(240,237,230,0.4); margin-top: 0.15rem; }

        @media (max-width: 768px) {
          .fd-grid, .fd-grid-3 { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="fd-wrap ">

        {/* Back Button */}
        <button className="fd-back" onClick={() => router.push('/admin/all-farms')}>
          ← Back to Farms
        </button>

        {/* Hero */}
        <div className="fd-hero">
          <div>
            <h1 className="fd-title">{farm.name}</h1>
            <p className="fd-meta">
              {farm.registrationNo ? `Reg. No: ${farm.registrationNo}` : 'No registration number'} · Registered {new Date(farm.createdAt).toLocaleDateString('en-IN')}
            </p>
            <div className="fd-badges">
              <span className={`fd-badge ${farm.status === 'ACTIVE' ? 'fd-badge-green' : 'fd-badge-gray'}`}>
                {farm.status}
              </span>
              <span className={`fd-badge ${farm.isVerified ? 'fd-badge-amber' : 'fd-badge-gray'}`}>
                {farm.isVerified ? '✓ Verified' : 'Pending Verification'}
              </span>
              {farm.soilType && (
                <span className="fd-badge fd-badge-gray">{farm.soilType}</span>
              )}
            </div>
          </div>
        </div>
{user?.role === 'SUPER_ADMIN' && !farm.isVerified && (
  <button
    onClick={handleVerify}
    disabled={verifying}
    style={{
      background: '#2d6a4f',
      color: '#d8f3dc',
      border: 'none',
      padding: '0.45rem 1.2rem',
      borderRadius: '8px',
      fontSize: '0.85rem',
      fontWeight: 500,
      cursor: 'pointer',
      fontFamily: "'DM Sans', sans-serif",
    }}
  >
    {verifying ? 'Verifying...' : 'Verify Farm ✓'}
  </button>
)}
 
        {/* Stats Row */}
        <div className="fd-grid-3">
          <div className="fd-stat-card">
            <div className="fd-stat-num">{farm.areaHectares}</div>
            <div className="fd-stat-label">Hectares</div>
          </div>
          <div className="fd-stat-card">
            <div className="fd-stat-num">{farm.cropCycles?.length ?? 0}</div>
            <div className="fd-stat-label">Crop Cycles</div>
          </div>
          <div className="fd-stat-card">
            <div className="fd-stat-num">{farm.soilReports?.length ?? 0}</div>
            <div className="fd-stat-label">Soil Reports</div>
          </div>
        </div>

        {/* Owner + Location */}
        <div className="fd-grid">

          {/* Owner */}
          <div className="fd-card">
            <div className="fd-card-title">Owner</div>
            <div className="fd-owner-card">
              <div className="fd-avatar">
                {farm.owner?.firstName?.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="fd-owner-name">{farm.owner?.firstName} {farm.owner?.lastName}</div>
                <div className="fd-owner-email">{farm.owner?.email}</div>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="fd-card">
            <div className="fd-card-title">Location</div>
            <div className="fd-row">
              <span className="fd-label">Address</span>
              <span className="fd-value">{farm.address}</span>
            </div>
            <div className="fd-row">
              <span className="fd-label">City</span>
              <span className="fd-value">{farm.city}</span>
            </div>
            <div className="fd-row">
              <span className="fd-label">State</span>
              <span className="fd-value">{farm.state}</span>
            </div>
            <div className="fd-row">
              <span className="fd-label">Pincode</span>
              <span className="fd-value">{farm.pincode}</span>
            </div>
            {farm.latitude && farm.longitude && (
              <div className="fd-row">
                <span className="fd-label">Coordinates</span>
                <span className="fd-value">{farm.latitude}, {farm.longitude}</span>
              </div>
            )}
          </div>
        </div>

        {/* Farm Info */}
        <div className="fd-grid">

          {/* Soil & Irrigation */}
          <div className="fd-card">
            <div className="fd-card-title">Farm Details</div>
            <div className="fd-row">
              <span className="fd-label">Soil Type</span>
              <span className="fd-value">{farm.soilType ?? '—'}</span>
            </div>
            <div className="fd-row">
              <span className="fd-label">Water Source</span>
              <span className="fd-value">{farm.waterSource ?? '—'}</span>
            </div>
            <div className="fd-row">
              <span className="fd-label">Irrigation</span>
              <span className="fd-value">{farm.irrigationType ?? '—'}</span>
            </div>
          </div>

          {/* Activity Counts */}
          <div className="fd-card">
            <div className="fd-card-title">Activity</div>
            <div className="fd-row">
              <span className="fd-label">Equipments</span>
              <span className="fd-value">{farm._count?.equipments ?? 0}</span>
            </div>
            <div className="fd-row">
              <span className="fd-label">Disease Reports</span>
              <span className="fd-value">{farm._count?.diseaseReports ?? 0}</span>
            </div>
            <div className="fd-row">
              <span className="fd-label">Weather Logs</span>
              <span className="fd-value">{farm._count?.weatherLogs ?? 0}</span>
            </div>
          </div>

        </div>

        {/* Crop Cycles */}
        <div className="fd-card" style={{ marginBottom: '1.2rem' }}>
          <div className="fd-card-title">Recent Crop Cycles</div>
          {farm.cropCycles?.length === 0 ? (
            <p className="fd-empty">No crop cycles yet</p>
          ) : (
            <table className="fd-table">
              <thead>
                <tr>
                  <th>Season</th>
                  <th>Year</th>
                  <th>Status</th>
                  <th>Expected Yield</th>
                  <th>Planting Date</th>
                </tr>
              </thead>
              <tbody>
                {farm.cropCycles?.map(cycle => (
                  <tr key={cycle.id}>
                    <td>{cycle.season}</td>
                    <td>{cycle.year}</td>
                    <td>
                      <span className={`fd-badge ${
                        cycle.status === 'ACTIVE' ? 'fd-badge-green' :
                        cycle.status === 'COMPLETED' ? 'fd-badge-amber' :
                        cycle.status === 'FAILED' ? 'fd-badge-red' : 'fd-badge-gray'
                      }`}>{cycle.status}</span>
                    </td>
                    <td>{cycle.expectedYieldKg ? `${cycle.expectedYieldKg} kg` : '—'}</td>
                    <td>{cycle.plantingDate ? new Date(cycle.plantingDate).toLocaleDateString('en-IN') : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Soil Reports */}
        <div className="fd-card">
          <div className="fd-card-title">Recent Soil Reports</div>
          {farm.soilReports?.length === 0 ? (
            <p className="fd-empty">No soil reports yet</p>
          ) : (
            <table className="fd-table">
              <thead>
                <tr>
                  <th>Test Date</th>
                  <th>pH Level</th>
                  <th>Soil Type</th>
                  <th>Nitrogen</th>
                  <th>Lab</th>
                </tr>
              </thead>
              <tbody>
                {farm.soilReports?.map(report => (
                  <tr key={report.id}>
                    <td>{new Date(report.testDate).toLocaleDateString('en-IN')}</td>
                    <td>{report.phLevel}</td>
                    <td>{report.soilType}</td>
                    <td>{report.nitrogenPpm ? `${report.nitrogenPpm} ppm` : '—'}</td>
                    <td>{report.labName ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </>
  )
}

export default FarmDetails