import { View, Text, SafeAreaView, TouchableOpacity, ToastAndroid } from 'react-native'
import React, { useEffect, useState } from 'react'
import { styles } from '../../../utils/commonStyles'
import { AntDesign, EvilIcons, Entypo, Feather } from '@expo/vector-icons';
import { useAuth } from '../../../context/AuthContext';
import { Colours } from '../../../utils/Colours';
import RegisterPin from '../../../components/RegisterPin';
import { useBiometric } from '../../../hooks/useBiometric';
import * as LocalAuthentication from "expo-local-authentication";
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { userProps } from '../../../Types/types';
import * as Linking from 'expo-linking';


const profile = () => {
    const {user, logout, setUserData} = useAuth();
    const [showRegister, setShowRegister] = useState<boolean>(false);
    const [password, setPassword] = useState<number>(0);
    const [cpassword, setCPassword] = useState<number>(0);
    const [registerLoading, setRegisterLoading] = useState<boolean>(false);
    const [registerError, setRegisterError] = useState<string>('');
    const [registerSuccess, setRegisterSuccess] = useState<string>('');
    const [fingerprint, setFingerprint] = useState<boolean>(false);

    useEffect(()=>{
        useBiometric().then(e=>setFingerprint(e))
    },[])


    const handleFingerPrint = async () => {
        try {
            const biometricAuth = await LocalAuthentication.authenticateAsync({
                promptMessage: "Scan your finger",
                disableDeviceFallback: true,
                cancelLabel: "Cancel",
            });
            if (biometricAuth.success) {
                // router.replace('/(app)/(tabs)/');
                ToastAndroid.showWithGravityAndOffset(
                  'Verified', 
                  ToastAndroid.LONG, 
                  ToastAndroid.TOP, 25, 50);
                  setShowRegister(true);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleRegister = async()=>{
        if(fingerprint){
            await handleFingerPrint();
            setShowRegister(true);
            await handleRegisterWithFingerPrint();
        }else{
            setShowRegister(true);
            await handleRegisterWithoutFingerPrint();
        }
    }



    const handleRegisterWithFingerPrint = async()=>{
        setRegisterLoading(true);
        if(password.toString().trim().length !== 6 || typeof(password) !== 'number' ){
            setRegisterError('Enter a 6-digit pin code');
            setRegisterLoading(false);
        }else{
            try {
                if(user){
                    const userRef = doc(db, 'Students', user?.sID.toString());
                    await updateDoc(userRef, {dPin:password});
                    ToastAndroid.showWithGravityAndOffset(
                        'Pin code set', 
                        ToastAndroid.LONG, 
                        ToastAndroid.TOP, 25, 50
                    );
                    setShowRegister(false);
                    const userData = await getDoc(userRef);
                    const data = userData.data() as userProps
                    setUserData(data);
                }
                
            } catch (error) {
                console.log(error);
                setRegisterError('Error occured setting pin code. Retry');
                setRegisterSuccess('');
            }finally{
                setRegisterLoading(false);
            }
        }
    }

    const handleRegisterWithoutFingerPrint =async()=>{
        setRegisterLoading(true);
        setRegisterError('');
        try {
            if(user){
                if( password !== user.dPin){
                 setRegisterError('The current pin code is wrong!');
                 setRegisterLoading(false);
                 setRegisterSuccess('');
               }
               else if((cpassword.toString().trim().length !== 6) || (typeof(cpassword) !== 'number')){
                 setRegisterError('Pin code must be a 6-digit number');
                 setRegisterLoading(false);
                 setRegisterSuccess('');
               }
               else{
                 const userRef = doc(db, 'Students', user?.sID.toString());
                 await updateDoc(userRef, {dPin:cpassword});
                 ToastAndroid.showWithGravityAndOffset(
                     'Pin created Successfully', 
                     ToastAndroid.LONG, 
                     ToastAndroid.TOP, 25, 50
                     );
                     setShowRegister(false);
                     const userData = await getDoc(userRef);
                     const data = userData.data() as userProps
                     setUserData(data);
                 
               }
            }
          // check for password auth
        } catch (error) {
          setRegisterError('Error occured trying to set pin. Retry');
          setRegisterLoading(false);
          setRegisterSuccess('');
          console.log(error);
        }finally{
          setRegisterLoading(false);
        }
      }


      const handleHelpPress = () => {
        const emailUrl = 'mailto:agyeiphilanthropist@gmail.com';
        Linking.openURL(emailUrl);
      };

  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.mini_container} >
        <View style={{backgroundColor:'#E6E5E5', width:100, height:100, elevation:5, alignItems:'center', justifyContent:'center', borderRadius:50}} >
            <AntDesign name="user" size={24} color="black" />
        </View>
        <Text style={{fontSize:24, color:Colours.primary, marginTop:10, fontWeight:'800'}} >{user?.sID}</Text>
        <View style={{width:'90%', alignSelf:'center', marginTop:20, flexDirection:'column', gap:15, alignItems:'flex-start'}} >
            <TouchableOpacity onPress={fingerprint ? handleFingerPrint : ()=>setShowRegister(true)} style={styles.profile_content} >
                <EvilIcons style={styles.profile_icons} name="lock" color="black" />
                    <Text style={styles.profile_text} >{user?.dPin === 0?'Set pin':'Change pin'}</Text>
                <EvilIcons style={{color:Colours.primary, marginLeft:20}} name="pencil" size={30} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleHelpPress} style={[styles.profile_content, {gap:7}]} >
                <Feather style={{color:Colours.primary, fontSize:20, marginLeft:10}} name="help-circle"  />
                <Text style={styles.profile_text} >Contact Support</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={logout} style={[styles.profile_content, {gap:7}]} >
                <Entypo style={{color:Colours.primary, fontSize:20, marginLeft:10}} name="log-out"  />
                <Text style={styles.profile_text} >Logout</Text>
            </TouchableOpacity>
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
                onPress={fingerprint? handleRegisterWithFingerPrint:handleRegisterWithoutFingerPrint}
                setRegisterError={setRegisterError}
                registerError={registerError}
                registerSuccess={registerSuccess}
                setRegisterSuccess={setRegisterSuccess}
                setRegisterLoading={setRegisterLoading}
                registerLoading={registerLoading}
                labelText1={fingerprint ? 'Enter new pin code':'Enter the old pin code'}
                labelText2='New pin code'
                showConfirm={!fingerprint}
              />
            }

      </View>
    </SafeAreaView>
  )
}

export default profile