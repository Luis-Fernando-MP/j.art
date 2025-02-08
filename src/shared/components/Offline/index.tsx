'use client'

import { useEffect } from 'react'
import toast from 'react-hot-toast'

import OfflineStore from './offline.store'

const Offline = () => {
  const { isOffline, setIsOffline } = OfflineStore()

  useEffect(() => {
    const updateNetworkStatus = () => setIsOffline(!navigator.onLine)

    window.addEventListener('online', updateNetworkStatus)
    window.addEventListener('offline', updateNetworkStatus)

    return () => {
      window.removeEventListener('online', updateNetworkStatus)
      window.removeEventListener('offline', updateNetworkStatus)
    }
  }, [])

  const showToast = () => {
    const toastId = 'offline'
    if (isOffline) {
      return toast.loading('😟 Te haz quedado sin internet', { id: toastId })
    }
    toast.success('🙂 Estamos de regreso', { id: toastId })
  }

  useEffect(() => {
    showToast()
  }, [isOffline])

  return null
}

export default Offline
