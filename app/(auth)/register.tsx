import { View, Text, SafeAreaView, StyleSheet, TextInput, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Stack, useRouter } from 'expo-router'
import { styles } from '../../utils/commonStyles'
import Nothing from '../../components/Nothing'
import Card from '../../components/Card'
import * as LocalAuthentication from "expo-local-authentication";
import * as Device from 'expo-device';
import Header from '../../components/Header'
import { Colours } from '../../utils/Colours'
import FINGER from '../../assets/imgs/finger.png';
import PASSWORD from '../../assets/imgs/password.png';
import { useBiometric } from '../../hooks/useBiometric'
import RegisterPin from '../../components/RegisterPin'
import LoginPin from '../../components/LoginPin'

const Page = () => {
  const router = useRouter();
  const [sID, setSID] = useState('');
  const [password, setPassword] = useState('');
  const [cpassword, setCPassword] = useState('');
  const [lpassword, setLPassword] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(true);
  const [fingerprint, setFingerprint] = useState(false);

  useEffect(() => {
    useBiometric().then(e=>setFingerprint(e))
  }, []);

  useEffect(()=>{
    (
      async()=>{
        const model = Device.modelId || Device.modelName
        //  console.log(Device.brand+ ' '+ model)
      }
    )();
  },[])

  const handle = async () => {
    try {
        const biometricAuth = await LocalAuthentication.authenticateAsync({
            promptMessage: "Login with Biometrics",
            disableDeviceFallback: true,
            cancelLabel: "Cancel",
        });
        if (biometricAuth.success) {
            router.push('/(tabs)/');
        }
    } catch (error) {
        console.log(error);
    }
};

    const handleLogin =()=>{}
    const handleRegister =()=>{}
  return (
    <SafeAreaView style={styles.main} >
      <Header title='Register' icon={true} />
      <View style={styles.mini_container} >
        <View style={styles.card} >
          <Text style={{color:Colours.primary, fontWeight:'800', fontSize:24, marginTop:10}} >Enrol</Text>
          <View style={styles.text_container} >
            <TextInput selectionColor='black' placeholder='Enter student ID' style={styles.input} />
            
            <View style={styles.inside_container} >   
                  <Image source={!fingerprint? FINGER:PASSWORD} style={{width:100, height:100, objectFit:'cover'}} />
                  <Text style={styles.mini_Text} >Press the button below to proced</Text> 
            </View>
          </View>

            {/* <RegisterPin 
              onShowRegister={setShowRegister} 
              showRegister={showRegister} 
              onChangeRegister={setPassword} 
              cpassword={cpassword} 
              password={password} 
              onChageCRegister={setCPassword}
              onPress={handleRegister}
            /> */}
            <LoginPin 
              showLogin={showLogin}
              onShowLogin={setShowLogin}
              lpassword={lpassword}
              onChangeLogin={setLPassword}
              onPress={handleLogin}
            />

            

            <TouchableOpacity onPress={()=>router.push('/(tabs)/')} style={[styles.button, {marginTop:30}]} >
              <Text style={{fontSize:22, fontWeight:'700', color:'#fff'}} >Proceed</Text>
            </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Page

