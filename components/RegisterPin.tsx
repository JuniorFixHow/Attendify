import { View, Text, TextInput, Modal, Pressable, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { styles } from '../utils/commonStyles'
import { registerProps } from '../Types/types'

const RegisterPin = ({cpassword, 
  password, 
  onChangeRegister, 
  onShowRegister, 
  showRegister, 
  onChageCRegister, 
  onPress,
  registerError, setRegisterError, registerSuccess, setRegisterSuccess,
  registerLoading, setRegisterLoading,
  labelText1, labelText2, showConfirm
}:registerProps) => {
  return (
    <Modal
      animationType='fade'
      transparent={true}
      visible={showRegister}
      onRequestClose={()=>onShowRegister(false)}
      >
      <Pressable onPress={()=>onShowRegister(false)} style={styles.mainmodal} >

        <View style={styles.inside_container} >
          <View style={{width:'80%', padding:15, gap:5, borderRadius:5, backgroundColor:'#fff'}} >
            <Text style={styles.register_Text} >Set a new pin</Text>
            <View style={{width:'100%',}} >
              <Text style={styles.mini_Text} >{labelText1}</Text>
              <TextInput onChangeText={(e)=>onChangeRegister(parseInt(e,10))} selectionColor='black' style={styles.input} />
            </View>
              {
                showConfirm &&
              <View style={{width:'100%',}} >
                <Text style={styles.mini_Text} >{labelText2}</Text>
                <TextInput onChangeText={(e)=>onChageCRegister(parseInt(e,10))} selectionColor='black' style={styles.input} />
              </View>
              }

            {
              registerError && <Text style={{color:'crimson'}} >{registerError}</Text>
            }
            {
              registerSuccess && <Text style={{color:'teal'}} >{registerSuccess}</Text>
            }

            <TouchableOpacity disabled={registerLoading} onPress={onPress} style={[registerLoading? styles.disabled : styles.button, {marginTop:10, alignSelf:'flex-end'}]} >
              <Text style={{fontSize:16, color:'#fff'}} >{registerLoading ? 'Loading...':'Submit'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    </Modal>
  )
}

export default RegisterPin