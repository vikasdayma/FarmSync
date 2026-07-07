'use client'

import React, { useEffect, useState } from 'react'
import './Notifications.css'

interface NotificationItem {
  id: string
  title: string
  message: string
  isRead: boolean
  createdAt: string
  type?: string
}

interface Meta {
  total: number
  page: number
  limit: number
  totalPages: number
  unreadCount: number
}


export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [meta, setMeta] = useState<Meta | null>(null)
  const [loading, setLoading] = useState(true)
  const [marking, setMarking] = useState(false)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

 
  async function getNotifications(unreadOnly = false) {
    setLoading(true)
    try {
      const url = `/api/notifications?page=1&limit=20${unreadOnly ? '&unread=true' : ''}`
      const res = await fetch(url, {
        method: 'GET',
        credentials: 'include'
      })
      if (!res.ok) { console.log('error fetching', res); return }
      const data = await res.json()
      setNotifications(data.data)
      setMeta(data.meta)
    } catch (e) {
      console.log(e)
    } finally {
      setLoading(false)
    }
  }

  async function readAllNotifications() {
    setMarking(true)
    try {
      const res = await fetch('/api/notifications', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      })
      if (!res.ok) { console.log('error marking'); return }
      await getNotifications(filter === 'unread')
    } catch (e) {
      console.log(e)
    } finally {
      setMarking(false)
    }
  }

  useEffect(() => {
    getNotifications(filter === 'unread')
  }, [filter])

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const m = Math.floor(diff / 60000)
    if (m < 1) return 'just now'
    if (m < 60) return `${m}m ago`
    const h = Math.floor(m / 60)
    if (h < 24) return `${h}h ago`
    return `${Math.floor(h / 24)}d ago`
  }

  const getIcon = (type?: string) => {
    switch (type) {
      case 'order':   return '📦'
      case 'payment': return '💳'
      case 'alert':   return '⚠️'
      case 'system':  return '⚙️'
      default:        return '🔔'
    }
  }

  return (
    <div className=''>
    

      <div className="   notif-page min-h-screen bg-[#0a1510] px-4 py-8 md:px-8">

        {/* Header */}
        
        <div className="max-w-2xl mx-auto mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-[#f0ede6] text-2xl font-bold tracking-tight leading-tight">
              Notifications
            </h1>
            <p className="text-[rgba(240,237,230,0.4)] text-sm mt-0.5">
              {meta ? `${meta.total} total · ${meta.unreadCount} unread` : 'Loading...'}
            </p>
          </div>

          <button
            onClick={readAllNotifications}
            disabled={marking || !meta?.unreadCount}
            className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[rgba(82,183,136,0.1)] border border-[rgba(82,183,136,0.2)] text-[#52b788] text-sm font-medium transition-all duration-200 hover:bg-[rgba(82,183,136,0.2)] hover:border-[rgba(82,183,136,0.4)] disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {marking ? (
              <>
                <span className="w-3.5 h-3.5 rounded-full border-2 border-[#52b788] border-t-transparent animate-spin" />
                Marking...
              </>
            ) : '✓ Mark all read'}
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="max-w-2xl mx-auto  flex gap-1 p-1 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(82,183,136,0.08)] w-fit">
          {(['all', 'unread'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-all duration-200
                ${filter === f
                  ? 'bg-[rgba(82,183,136,0.15)] text-[#52b788] border border-[rgba(82,183,136,0.25)]'
                  : 'text-[rgba(240,237,230,0.4)] hover:text-[rgba(240,237,230,0.7)]'
                }`}
            >
              {f}
              {f === 'unread' && meta?.unreadCount ? (
                <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-[#52b788] text-[#0a1510] text-[10px] font-bold">
                  {meta.unreadCount}
                </span>
              ) : null}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="max-w-2xl mt4  mx-auto rounded-2xl border border-[rgba(82,183,136,0.1)] bg-[rgba(15,25,20,0.6)] backdrop-blur-sm overflow-hidden">
          {loading ? (
            <div className="divide-y divide-[rgba(82,183,136,0.06)]">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex gap-3 px-5 py-4">
                  <div className="skeleton w-9 h-9 rounded-xl shrink-0" />
                  <div className="flex flex-col gap-2 flex-1 pt-0.5">
                    <div className="skeleton h-3.5 w-2/3" />
                    <div className="skeleton h-2.5 w-full" />
                    <div className="skeleton h-2 w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <span className="text-5xl opacity-30">🔔</span>
              <p className="text-[rgba(240,237,230,0.3)] text-sm font-medium">
                {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
              </p>
            </div>
          ) : (
            <div className="notif-scroll divide-y divide-[rgba(82,183,136,0.06)]">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`notif-row flex gap-3.5 px-5 py-4 transition-colors duration-150 hover:bg-[rgba(82,183,136,0.04)] cursor-pointer
                    ${!n.isRead ? 'bg-[rgba(82,183,136,0.03)]' : ''}`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0
                    ${!n.isRead
                      ? 'bg-[rgba(82,183,136,0.15)] border border-[rgba(82,183,136,0.25)]'
                      : 'bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.06)]'}`}>
                    {getIcon(n.type)}
                  </div>

                  <div className="flex flex-col justify-center gap-0.5 flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className={`text-sm leading-snug ${!n.isRead ? 'text-[#f0ede6] font-semibold' : 'text-[rgba(240,237,230,0.6)] font-medium'}`}>
                        {n.title}
                      </p>
                      <span className="text-[10px] text-[rgba(240,237,230,0.25)] shrink-0 mt-0.5">
                        {timeAgo(n.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs text-[rgba(240,237,230,0.4)] leading-relaxed line-clamp-2">
                      {n.message}
                    </p>
                  </div>

                  {!n.isRead && (
                    <div className="w-1.5 h-1.5 rounded-full bg-[#52b788] shrink-0 mt-2" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Load more */}
        {meta && meta.page < meta.totalPages && (
          <div className="max-w-2xl mx-auto mt-4 text-center">
            <button
              onClick={() => getNotifications(filter === 'unread')}
              className="text-sm text-[#52b788] hover:text-[#d8f3dc] font-medium transition-colors duration-200"
            >
              Load more →
            </button>
          </div>
        )}
      </div>
    </div >
  )
}
