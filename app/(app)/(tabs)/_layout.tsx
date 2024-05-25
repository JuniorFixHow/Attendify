import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { Tabs, useRouter } from 'expo-router'
import { AntDesign, Ionicons, FontAwesome } from '@expo/vector-icons';
import { useAuth } from '../../../context/AuthContext';


const Layout = () => {
 

  return (
    <Tabs>
        <Tabs.Screen name='index' options={{
            tabBarShowLabel:false,
            headerShown:false,
            tabBarIcon:({focused})=> <AntDesign name='appstore1' size={24} color={focused?'black':'grey'} />
        }} />
        <Tabs.Screen name='notifications' options={{
          tabBarShowLabel:false,
          headerShown:false,
          tabBarIcon:({focused})=> <FontAwesome name='bell' size={24} color={focused?'black':'grey'} />
        }} />
        <Tabs.Screen name='profile' options={{
            tabBarShowLabel:false,
            headerShown:false,
            tabBarIcon:({focused})=> <FontAwesome name='user-circle-o' size={24} color={focused?'black':'grey'} />
        }} />
    </Tabs>
  )
}

export default Layout