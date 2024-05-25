import 'expo-dev-client'
import { Slot, Stack } from 'expo-router'
import React from 'react'
import { AuthContextProvider } from '../context/AuthContext'
import { handleBackgroundNotifications } from '../hooks/useNotifications'

export default function Root() {
  handleBackgroundNotifications()
  return (
    <AuthContextProvider>
      <Slot />
    </AuthContextProvider>
  )
}

