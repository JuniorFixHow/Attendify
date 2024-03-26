import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { AntDesign, Ionicons, FontAwesome } from '@expo/vector-icons';


const Layout = () => {

  return (
    <Tabs>
        <Tabs.Screen name='home' options={{
            tabBarShowLabel:false,
            headerShown:false,
            tabBarIcon:({focused})=> <AntDesign name='appstore1' size={24} color={focused?'black':'grey'} />
        }} />
        {/* <Tabs.Screen name='[id]' options={{
            tabBarShowLabel:false,
            headerShown:false,
            tabBarIcon:({focused})=> <Ionicons name='calendar' size={24} color={focused?'black':'grey'} />
        }} /> */}
        <Tabs.Screen name='notifications' options={{
            tabBarShowLabel:false,
            headerShown:false,
            tabBarIcon:({focused})=> <FontAwesome name='bell' size={24} color={focused?'black':'grey'} />
        }} />
    </Tabs>
  )
}

export default Layout