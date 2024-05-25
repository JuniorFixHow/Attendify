import { View, Text, TextInput, Modal, Pressable, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { styles } from '../utils/commonStyles'
import { loginProps } from '../Types/types'


const LoginPin = ({lpassword, 
  onShowLogin, 
  showLogin, 
  onChangeLogin, 
  onPress,
  setLoginError, loginError, loginSuccess, setLoginSuccess,
  loginLoading, setLoginLoading
 }:loginProps) => {
  return (
    <Modal
      animationType='fade'
      transparent={true}
      visible={showLogin}
      onRequestClose={()=>onShowLogin(false)}
      >
      <Pressable onPress={()=>onShowLogin(false)} style={styles.mainmodal} >

        <View style={styles.inside_container} >
          <View style={{width:'80%', padding:15, gap:5, borderRadius:5, backgroundColor:'#fff'}} >
            <Text style={styles.register_Text} >Enter your pin</Text>
            <View style={{width:'100%',}} >
              <Text style={styles.mini_Text} >Enter pin</Text>
              <TextInput keyboardType='number-pad' secureTextEntry onChangeText={(e)=>onChangeLogin(parseInt(e))} selectionColor='black' style={styles.input} />
            </View>
            {
              loginError && <Text style={{color:'crimson'}} >{loginError}</Text>
            }
            {
              loginSuccess && <Text style={{color:'teal'}} >{loginSuccess}</Text>
            }
            <TouchableOpacity disabled={loginLoading} onPress={onPress} style={[loginLoading?styles.disabled:styles.button, {marginTop:10, alignSelf:'flex-end'}]} >
              <Text style={{fontSize:16, color:'#fff'}} >{loginLoading ? 'Loading...':'Submit'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    </Modal>
  )
}

export default LoginPin