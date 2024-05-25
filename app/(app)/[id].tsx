import { View, Text, SafeAreaView, Image, TouchableOpacity, ToastAndroid } from 'react-native'
import React, { useEffect, useState } from 'react'
import Card from '../../components/Card'
import Header from '../../components/Header'
import { Colours } from '../../utils/Colours';
import FINGER from '../../assets/imgs/finger.png';
import RIGHT from '../../assets/imgs/right.png';
import WRONG from '../../assets/imgs/wrong.png';
import PHONE from '../../assets/imgs/password.png';
import { useBiometric } from '../../hooks/useBiometric'
import LoginPin from '../../components/LoginPin'
import { handleNotifications } from '../../functions/notification'
import { router, useGlobalSearchParams, useLocalSearchParams } from 'expo-router'
import Nothing from '../../components/Nothing'
import { sessionProp, sessionProps } from '../../Types/types'
import { AttendanceData } from '../../utils/Dummy'
import { styles } from '../../utils/commonStyles';
import { Timestamp, arrayUnion, collection, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import * as LocalAuthentication from "expo-local-authentication";


const Page = () => {
  const [isScannedError, setIsScannedError] = useState(false);
  const [isScannedSuccess, setIsScannedSucces] = useState(false);
  const [fingerprint, setFingerprint] = useState(false);
  const [lpassword, setLPassword] = useState<number>(0);
  const [showLogin, setShowLogin] = useState(false);
  const [currentData, setCurrentData] = useState<sessionProp | null>(null);
  const [loginError, setLoginError] = useState<string>('');
  const [loginSuccess, setLoginSuccess] = useState<string>('');
  const [loginLoading, setLoginLoading] = useState<boolean>(false);
  const [session, setSession] = useState<sessionProps | null>();
  const [timeRemaining, setRemainingTime] = useState<string>('');
  
  const params = useLocalSearchParams();
  
  const {user} = useAuth();


  useEffect(()=>{
    const data = params?.data
    if (Array.isArray(data)) {
      // Handle the case when router.query.data is an array
      const parsedData: sessionProps = JSON.parse(data[0]);
      setSession(parsedData);
    } else if ( typeof(data) === 'string') {
      // Handle the case when router.query.data is a string
      const parsedData: sessionProps = JSON.parse(data);
      setSession(parsedData);
      console.log(typeof(parsedData))
      // console.log('is not array')
    }
    
},[params?.data])
  
// console.log(session?.code);

// Inside your component:
useEffect(() => {
  
  const timerInterval = setInterval(() => {
    if(session?.end){
      const futureDate = new Date(session?.end.toString());

      const now = new Date();
      if (futureDate > now) {
        const timeDiff = futureDate.getTime() - now.getTime();
        // Calculate the remaining time
        const seconds = Math.floor((timeDiff / 1000) % 60);
        const minutes = Math.floor((timeDiff / 1000 / 60) % 60);
        const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
  
        // Format the remaining time as hh:mm:ss
        const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes
          .toString()
          .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
        // console.log(formattedTime);
        setRemainingTime(formattedTime);
  
        if (formattedTime === '00:00:00') {
          handleNotifications(session.code, `Attendance over for ${session.code}`)
          ToastAndroid.showWithGravityAndOffset(
            'Session over', 
            ToastAndroid.LONG, 
            ToastAndroid.TOP, 25, 50);
          setRemainingTime('00:00:00');
          clearInterval(timerInterval);
          router.replace('/(app)/(tabs)');
        }
      }
    }
  }, 1000);

  return () => clearInterval(timerInterval);
}, [session?.end]);


  useEffect(()=>{
    useBiometric().then(e=>setFingerprint(e))
  },[])
  
  const handleLogin =async()=>{
    setLoginLoading(true);
    try {
      if((lpassword.toString().trim().length !== 6) || (typeof(lpassword) !== 'number')){
        setLoginError('Enter your 6-digit pin code');
        setLoginSuccess('');
      }else{
        if(user){
          const studentRef = doc(db, 'Students', user?.sID.toString());
          const student = await getDoc(studentRef);
          if(!student.exists() || (student.data().dPin !== lpassword)){
            setLoginError('Incorrect pin code');
            setLoginSuccess('')
          }
          else{
            setLoginSuccess('');
            setLPassword(0);
            setLoginError('');
            if(session){
              const sessionRef = doc(db, 'Sessions', session?.id);
              await updateDoc(sessionRef,{
                students:arrayUnion({id:user.sID, time:Timestamp.fromDate(new Date)}),
                list:arrayUnion(user?.sID)
              })
              await handleNotifications(session.code, `Attendance taken for ${session.code}`);
              ToastAndroid.showWithGravityAndOffset(
                'Attendance taken successfully', 
                ToastAndroid.LONG, 
                ToastAndroid.TOP, 25, 50);
                setShowLogin(false);
                router.replace('/(app)/(tabs)');
            }
          
          }
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


  const handleFingerPrint = async () => {
    try {
        const biometricAuth = await LocalAuthentication.authenticateAsync({
            promptMessage: "Scan your finger",
            disableDeviceFallback: true,
            cancelLabel: "Cancel",
        });
        if (biometricAuth.success) {
          if(session && user){
            const sessionRef = doc(db, 'Sessions', session?.id);
            await updateDoc(sessionRef,{
              students:arrayUnion({id:user.sID, time:Timestamp.fromDate(new Date)}),
              list:arrayUnion(user?.sID)
            })
              // router.replace('/(app)/(tabs)/');
              await handleNotifications(session.code, `Attendance taken for ${session.code}`);
              ToastAndroid.showWithGravityAndOffset(
                'Attendance taken successfully', 
                ToastAndroid.LONG, 
                ToastAndroid.TOP, 25, 50);
                router.replace('/(app)/(tabs)');

          }
        }
    } catch (error) {
        console.log(error);
    }
};
// fingerprint ? handleFingerPrint : ()=>setShowLogin(true)
// const notify =async()=>{
//   await handleNotifications('session.code',`Attendance taken for {session.code}`);
// }
  
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
        setLoginError={setLoginError}
        setLoginSuccess={setLoginSuccess}
        loginError={loginError}
        loginSuccess={loginSuccess}
        setLoginLoading={setLoginLoading}
        loginLoading={loginLoading}
      />
        <View style={styles.card} >
          <Text style={{color:Colours.primary, fontWeight:'800', fontSize:24, marginTop:10}} >{session?.code} session</Text>
          <View style={styles.text_container} >

            <View style={styles.inside_container} >
              <Image source={fingerprint? FINGER: PHONE} style={{width:200, height:200, objectFit:'cover'}} />
                {
                    fingerprint &&
                    <Text style={styles.mini_Text} >Press the button</Text>
                }
            </View>
          </View>
            <Text style={{fontWeight:'800', fontSize:30, color:'crimson'}} >{timeRemaining}</Text>

            <TouchableOpacity onPress={fingerprint ? handleFingerPrint : ()=>setShowLogin(true)} style={[styles.button, {marginTop:10}]}>
              <Text style={{fontSize:22, fontWeight:'700', color:'#fff'}} >Proceed</Text>
            </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Page