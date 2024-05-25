import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const Layout = () => {
  return (
    <Stack>
        <Stack.Screen options={{headerShown:false}} name='welcome' />
        <Stack.Screen options={{headerShown:false}} name='register' />
    </Stack>
  )
}

export default Layout