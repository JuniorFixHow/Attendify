import { View, Text, SafeAreaView, StyleSheet, TextInput, Image, TouchableOpacity, ToastAndroid } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { Stack, useRouter } from 'expo-router'
import { styles } from '../../../utils/commonStyles'
import Nothing from '../../../components/Nothing'
import Card from '../../../components/Card'
import * as LocalAuthentication from "expo-local-authentication";
import * as Device from 'expo-device';
import Header from '../../../components/Header'
import { Colours } from '../../../utils/Colours'
import FINGER from '../../../assets/imgs/finger.png';
import PASSWORD from '../../../assets/imgs/password.png';
import { useBiometric } from '../../../hooks/useBiometric'
import RegisterPin from '../../../components/RegisterPin'
import LoginPin from '../../../components/LoginPin'
import { useAuth } from '../../../context/AuthContext'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../../../firebase'

const Page = () => {
  const {user, setUserData} = useAuth();
  const router = useRouter();
  const [sID, setSID] = useState<number>(0);
  const [password, setPassword] = useState<number >(0);
  const [cpassword, setCPassword] = useState<number>(0);
  const [lpassword, setLPassword] = useState<number>(0);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [fingerprint, setFingerprint] = useState(false);


  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [device, setDevice] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [loginLoading, setLoginLoading] = useState<boolean>(false);
  const [registerLoading, setRegisterLoading] = useState<boolean>(false);
  const [loginSuccess, setLoginSuccess] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');
  const [registerSuccess, setRegisterSuccess] = useState<string>('');
  const [registerError, setRegisterError] = useState<string>('');

  // const {isNew} = useAuth
  useEffect(() => {
    useBiometric().then(e=>setFingerprint(e))
  }, []);

  useEffect(()=>{
    (
      async()=>{
        const model = Device.modelId || Device.modelName
        //  console.log(Device.brand+ ' '+ model)
        setDevice(Device.brand+ ' '+ model)
      }
    )();
  },[])

  const handleFingerPrint = async () => {
    try {
        const biometricAuth = await LocalAuthentication.authenticateAsync({
            promptMessage: "Scan your finger",
            disableDeviceFallback: true,
            cancelLabel: "Cancel",
        });
        if (!biometricAuth.success) {
          ToastAndroid.showWithGravityAndOffset(
            'Canceled', 
            ToastAndroid.LONG, 
            ToastAndroid.TOP, 25, 50);
            return false;
          }
          else{
            ToastAndroid.showWithGravityAndOffset(
              'Verified', 
              ToastAndroid.LONG, 
              ToastAndroid.TOP, 25, 50);
              router.replace('/(app)/(tabs)');
            }
    } catch (error) {
        console.log(error);
    }
};


// console.log(lpassword);
    const handleLogin =async()=>{
      setLoginLoading(true);
      try {
        if((lpassword.toString().trim().length !== 6) || (typeof(lpassword) !== 'number')){
          setLoginError('Enter your 6-digit pin code');
          setLoginSuccess('');
        }else{
          const studentRef = doc(db, 'Students', sID.toString());
          const student = await getDoc(studentRef);
          if(!student.exists() || (student.data().dPin !== lpassword)){
            setLoginError('Incorrect pin code');
            setLoginSuccess('')
          }
          else{
            setLoginSuccess('');
            setLPassword(0);
            setLoginError('');
            const {sID, isFinger, device, dPin} = student.data();
            const sData = {sID, isFinger, device, dPin};
            setUserData(sData)
            // console.log(sID, isFinger, device, dPin)
            ToastAndroid.showWithGravityAndOffset(
              'Logged in Successfully', 
              ToastAndroid.LONG, 
              ToastAndroid.TOP, 25, 50);
              setShowLogin(false);
              router.push('/(app)/(tabs)');
          
          }
        }
      } catch (error) {
        console.log(error);
        setLoginError('Error occured trying to login. Retry');
        setLoginLoading(false);
        setLoginSuccess('');
      }
      finally{
        setLoginLoading(false);
      }
    }

// console.log(loginLoading);
    const checkStudent =async()=>{
      setLoading(true);
      // you can check for the ID length
      if((sID.toString().trim().length === 8) && (typeof(sID) === 'number')){
        
        try {
          const studentRef = doc(db, 'Students', sID.toString());
          const student = await getDoc(studentRef);
          // Rearrange the logic when u come back
          if(student.exists() && fingerprint && student.data().device === device ){
            const {sID, isFinger, device, dPin} = student.data();
            const sData = {sID, isFinger, device, dPin};
            setUserData(sData);
            await handleFingerPrint();
            // router.replace('/(app)/(tabs)');
          }
          else if(student.exists() && !fingerprint && student.data().device === device && student.data().dPin !==0 ){
            setShowLogin(true)
          }
          else if(student.exists() && !fingerprint && student.data().device === device && student.data().dPin ===0 ){
            setShowRegister(true)
          }
          else if(!student.exists() && !fingerprint ){
            setShowRegister(true)
          }
          else if(!student.exists() && fingerprint ){
            // new user. sign them in with fingerprint logic then let them use fingerprint
            const data = {
              sID, device, isFinger:fingerprint, dPin:0,
            }
            const regRef = doc(db, 'Students', sID.toString());
            await setDoc(regRef, data);
            setUserData(data);
            // router.replace('/(app)/(tabs)')
            await handleFingerPrint();
          }
          else if(student.exists() && fingerprint && student.data().device !== device ){
            ToastAndroid.show('The ID and the fingerprint data mismatch!', 10000)
          }
          else if(student.exists() && !fingerprint && student.data().device !== device ){
            ToastAndroid.show('This is not the original device for the provided ID!', 10000);
          }
          
        } catch (error) {
          alert('Error occured trying to fetch your data. Retry');
          console.log(error);
        }finally{
          setLoading(false);
        }
      }
      else{
        ToastAndroid.show('Enter a valid ID', 5000);
        // alert('Enter a valid ID!');
        setLoading(false);
      }
    }

    const handleRegister =async()=>{
      setRegisterLoading(true);
      try {
        if((sID.toString().trim().length !== 8) || (typeof(sID) !== 'number')){
          setRegisterError('Enter a valid ID!');
          setRegisterLoading(false);
          setRegisterSuccess('');
        }
        else if(((password.toString().trim().length !== 6) || (typeof(sID) !== 'number'))){
          setRegisterError('Pin code must be a 6-digit number');
          setRegisterLoading(false);
          setRegisterSuccess('');
        }
        else if(cpassword !== password){
          setRegisterError('The pin codes mismatch');
          setRegisterLoading(false);
          setRegisterSuccess('');
        }
        else{
          const regData = {
            sID, device, isFinger:fingerprint, dPin:password
          }
          const regRef = doc(db, 'Students', regData.sID.toString());
          await setDoc(regRef, regData);
          setRegisterSuccess('Pin created Successfully');
          setRegisterError('');
          setRegisterLoading(false);
          ToastAndroid.showWithGravityAndOffset(
            'Pin created Successfully', 
            ToastAndroid.LONG, 
            ToastAndroid.TOP, 25, 50);
            setShowRegister(false);
            setUserData(regData);
            router.push('/(app)/(tabs)');
        }
        // check for password auth
      } catch (error) {
        setRegisterError('Error occured trying to register. Retry');
        setRegisterLoading(false);
        setRegisterSuccess('');
        console.log(error);
      }finally{
        setRegisterLoading(false);
      }
    }
 
  return (
    <SafeAreaView style={styles.main} >
      <Header title='Register' icon={true} />
      <View style={styles.mini_container} >
        <View style={styles.card} >
          <Text style={{color:Colours.primary, fontWeight:'800', fontSize:24, marginTop:10}} >Enrol</Text>
          <View style={styles.text_container} >
            <TextInput keyboardType='numeric' onChangeText={(e)=>setSID(parseInt(e))} selectionColor='black' placeholder='Enter student ID' style={styles.input} />
            
            <View style={styles.inside_container} >   
                  <Image source={fingerprint? FINGER:PASSWORD} style={{width:100, height:100, objectFit:'cover'}} />
                  <Text style={styles.mini_Text} >Press the button below to proced</Text> 
                  <Text style={styles.caution} >Caution: You cannot use your ID on any other person's device after registering!</Text> 
            </View>
          </View>
            {
              showRegister &&
              <RegisterPin 
                onShowRegister={setShowRegister} 
                showRegister={showRegister} 
                onChangeRegister={setPassword} 
                cpassword={cpassword} 
                password={password} 
                onChageCRegister={setCPassword}
                onPress={handleRegister}
                setRegisterError={setRegisterError}
                registerError={registerError}
                registerSuccess={registerSuccess}
                setRegisterSuccess={setRegisterSuccess}
                setRegisterLoading={setRegisterLoading}
                registerLoading={registerLoading}
                labelText1='Enter pin'
                labelText2='Confirm pin'
                showConfirm
              />
            }
            {
              showLogin &&
              <LoginPin 
                showLogin={showLogin}
                onShowLogin={setShowLogin}
                lpassword={lpassword}
                onChangeLogin={setLPassword}
                onPress={handleLogin}
                setLoginError={setLoginError}
                setLoginSuccess={setLoginSuccess}
                loginError={loginError}
                loginSuccess={loginSuccess}
                setLoginLoading={setLoginLoading}
                loginLoading={loginLoading}
              />
            }

            

            <TouchableOpacity disabled={loading} onPress={checkStudent} style={[loading?styles.disabled: styles.button, {marginTop:30}]} >
              <Text style={{fontSize:22, fontWeight:'700', color:'#fff'}} >{loading? 'Loading...':'Proceed'}</Text>
            </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Page

