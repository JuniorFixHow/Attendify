import { View, Text, SafeAreaView, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import Card from '../components/Card'
import { styles } from '../utils/commonStyles'
import Header from '../components/Header'
import { Colours } from '../utils/Colours';
import FINGER from '../assets/imgs/finger.png';
import RIGHT from '../assets/imgs/right.png';
import WRONG from '../assets/imgs/wrong.png';
import PHONE from '../assets/imgs/password.png';
import { useBiometric } from '../hooks/useBiometric'
import LoginPin from '../components/LoginPin'
import { handleNotifications } from '../functions/functions'
import { useGlobalSearchParams } from 'expo-router'
import Nothing from '../components/Nothing'
import { sessionProp } from '../Types/types'
import { AttendanceData } from '../utils/Dummy'

const Page = () => {
  const [isScannedError, setIsScannedError] = useState(false);
  const [isScannedSuccess, setIsScannedSucces] = useState(false);
  const [fingerprint, setFingerprint] = useState(false);
  const [lpassword, setLPassword] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [currentData, setCurrentData] = useState<sessionProp | null>(null);
  
  const params = useGlobalSearchParams();
  
  
  useEffect(()=>{
    if(params?.id){
      setCurrentData(AttendanceData.filter(item=>item.id.toString() === params.id)[0])
    }
  },[params?.id])

  
  useEffect(()=>{
    useBiometric().then(e=>setFingerprint(e))
  },[])
  const handleLogin=()=>{}
  if(!params?.id) {
  return(

    <Nothing title='There are no ongoing attendance sessions available for you at the moment.' />
  )
  }
  return (
    <SafeAreaView style={styles.main} >
      <Header icon={true} title="Take Attendance" />
      <View style={styles.mini_container} >
      <LoginPin 
        showLogin={showLogin}
        onShowLogin={setShowLogin}
        lpassword={lpassword}
        onChangeLogin={setLPassword}
        onPress={handleLogin}
      />
        <View style={styles.card} >
          <Text style={{color:Colours.primary, fontWeight:'800', fontSize:24, marginTop:10}} >{currentData?.title} session</Text>
          <View style={styles.text_container} >

            <View style={styles.inside_container} >
                {
                    isScannedSuccess ?
                    <Image source={RIGHT} style={{width:200, height:200, objectFit:'cover'}} />
                    : isScannedError ?
                    <Image source={WRONG} style={{width:200, height:200, objectFit:'cover'}} />
                    :
                    <Image source={PHONE} style={{width:200, height:200, objectFit:'cover'}} />
                    // <Image source={fingerprint? FINGER:PHONE} style={{width:200, height:200, objectFit:'cover'}} />
                }
                {
                    !isScannedError && !isScannedSuccess && !fingerprint &&
                    <Text style={styles.mini_Text} >Scan Finger</Text>
                }
            </View>
          </View>
            <Text style={{fontWeight:'800', fontSize:30, color:'crimson'}} >00:15:55</Text>

            <TouchableOpacity onPress={()=>handleNotifications({title:'Hello', body:'This is a test message'})} style={[styles.button, {marginTop:10}]}>
              <Text style={{fontSize:22, fontWeight:'700', color:'#fff'}} >Proceed</Text>
            </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Page