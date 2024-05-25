import 'expo-firestore-offline-persistence'
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect } from 'react'
import { Redirect, SplashScreen, Stack, Tabs, useRouter } from 'expo-router'
import { AntDesign } from '@expo/vector-icons';
import { styles } from '../../utils/commonStyles';
import { StatusBar } from 'expo-status-bar';
import { AuthContext, AuthContextProvider, useAuth } from '../../context/AuthContext';
import * as Updates from 'expo-updates';


SplashScreen.preventAutoHideAsync();


const RootLayoutNav = () => {
  const {user, loading} = useAuth();
  if(loading){
    return(
      <View style={{flex:1, backgroundColor:'#fff', alignItems:'center', justifyContent:'center'}} >
        <ActivityIndicator size='large' />
      </View>
    )
  }
  // if(!user){
  //   return(
  //     <Redirect href='/(app)/(auth)/register' />
  //   )
  // } 
  const router = useRouter();
  useEffect(()=>{
    const timeInterval = setInterval(()=>{
      // fetchData();
      // useLoaction();
      SplashScreen.hideAsync();
    },5000)
    return ()=> clearInterval(timeInterval)
  },[])

  const onFetchUpdateAsync =async()=> {
    try {
      const update = await Updates.checkForUpdateAsync();

      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        await Updates.reloadAsync();
      }
    } catch (error) {
      // You can also add an alert() to see the error message in case of an error when fetching updates.
      console.log(`Error fetching latest update: ${error}`);
    }
  }
  useEffect(()=>{
    onFetchUpdateAsync();
  },[])

  return (
      <>
      <StatusBar style='auto' />
        <Stack initialRouteName='(tabs)' >
          <Stack.Screen name='(tabs)' options={{headerShown:false}} />
          <Stack.Screen name='(auth)' options={{headerShown:false}} />
          {/* <Stack.Screen name='index' options={{headerShown:false}} /> */}
          <Stack.Screen name='[id]' options={{headerShown:false}} />
        </Stack>
      </>

  )
}

export default RootLayoutNav

