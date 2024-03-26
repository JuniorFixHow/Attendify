import 'expo-firestore-offline-persistence'
import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect } from 'react'
import { SplashScreen, Stack, Tabs } from 'expo-router'
import { AntDesign } from '@expo/vector-icons';
import { styles } from '../utils/commonStyles';
import { StatusBar } from 'expo-status-bar';
import { AuthContext, AuthContextProvider, authContext } from '../context/Context';

SplashScreen.preventAutoHideAsync();

export const RootLayout = ()=>{
  useEffect(()=>{
    const timeInterval = setInterval(()=>{
      SplashScreen.hideAsync();
    },5000)
    return ()=>{
      clearInterval(timeInterval)
    }
  },[])
  
  return(
    <AuthContextProvider>
      <RootLayoutNav />
    </AuthContextProvider>
  )
}

const RootLayoutNav = () => {
  const {user, authInitialized} = authContext();
  
  if(!user && !authInitialized) return;
  return (
      <>
      <StatusBar style='auto' />
        <Stack initialRouteName='(tabs)' >
          <Stack.Screen name='(tabs)' options={{headerShown:false}} />
          <Stack.Screen name='(auth)' options={{headerShown:false}} />
          {/* <Stack.Screen name='index' options={{headerShown:false}} /> */}
          <Stack.Screen name='attendance' options={{headerShown:false}} />
        </Stack>
      </>

  )
}

export default RootLayout

