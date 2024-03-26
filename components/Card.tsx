import { View, Text, SafeAreaView, TextInput, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { styles } from '../utils/commonStyles'
import Header from './Header'
import { Colours } from '../utils/Colours'
import FINGER from '../assets/imgs/finger.png';
import RIGHT from '../assets/imgs/right.png';
import WRONG from '../assets/imgs/wrong.png';
import {FontAwesome} from '@expo/vector-icons'
import Select from './Select'
import { useRouter } from 'expo-router'
import { cardProps } from '../Types/types'

const Card = ({isAttendance, 
  onPress, 
  isScannedSuccess, 
  isScannedError,title, 
  label,duration, 
  headerTitle, 
  onChange,
  isFinger,
}:cardProps) => {
    const router = useRouter();
  return (
    <SafeAreaView style={styles.main} >
      <Header title={headerTitle} />
      <View style={styles.mini_container} >
        <View style={styles.card} >
          <Text style={{color:Colours.primary, fontWeight:'800', fontSize:24, marginTop:10}} >{title}</Text>
          <View style={styles.text_container} >
            {
              !isAttendance &&
              <>
                <Text style={styles.mainText} >{label}</Text>
                <TextInput onChangeText={onChange} selectionColor='black' placeholder='Enter student ID' style={styles.input} />
              </>      
            }
            {
              !isAttendance && !isFinger &&
              <View>
                <TextInput onChangeText={onChange} selectionColor='black' placeholder='Enter student ID' style={styles.input} />
                <TextInput onChangeText={onChange} selectionColor='black' placeholder='Enter student ID' style={styles.input} />
              </View>
            }

            <View style={styles.inside_container} >
                {
                    isScannedSuccess ?
                    <Image source={RIGHT} style={{width:200, height:200, objectFit:'cover'}} />
                    : isScannedError ?
                    <Image source={WRONG} style={{width:200, height:200, objectFit:'cover'}} />
                    :
                    <Image source={FINGER} style={{width:200, height:200, objectFit:'cover'}} />
                }
                {
                    !isScannedError && !isScannedSuccess &&
                    <Text style={styles.mini_Text} >Scan Finger</Text>
                }
            </View>
          </View>
          {
            isAttendance ?
            <Text style={{fontWeight:'800', fontSize:30, color:'crimson'}} >
                {duration}
            </Text>
            :
            <TouchableOpacity style={styles.button} onPress={onPress} >
              <Text style={{fontSize:22, fontWeight:'700', color:'#fff'}} >Proceed</Text>
            </TouchableOpacity>
          }
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Card