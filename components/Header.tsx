import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import UG from '../assets/imgs/ug.png';
import { Colours } from '../utils/Colours';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';

type titleProp = {
  title:string,
  icon?:boolean
}
const Header = ({title, icon}:titleProp) => {
  const {user} = useAuth();
  const router=useRouter()
  return (
    <View style={{flexDirection:'column', marginTop:20, width:'100%', alignItems:'center'}} >
      {
        icon && user &&
        <TouchableOpacity onPress={()=>router.push('/(app)/(tabs)/profile')} style={{position:'absolute', right:10,}} >
          <FontAwesome name='user-circle-o' size={24} color='black' />
        </TouchableOpacity >
      }
      <Image source={UG} alt="" style={{width:30, height:40, objectFit:'cover'}} />
      <Text style={{fontWeight:'800', fontSize:30, color:Colours.primary}}  >{title}</Text>
    </View>
  )
}

export default Header