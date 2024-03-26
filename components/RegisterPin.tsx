import { View, Text, TextInput, Modal, Pressable, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { styles } from '../utils/commonStyles'
import { registerProps } from '../Types/types'

const RegisterPin = ({cpassword, password, onChangeRegister, onShowRegister, showRegister, onChageCRegister, onPress}:registerProps) => {
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

            <View style={{width:'100%',}} >
              <Text style={styles.mini_Text} >Enter password</Text>
              <TextInput onChangeText={(e)=>onChangeRegister(e)} selectionColor='black' style={styles.input} />
            </View>
            <View style={{width:'100%',}} >
              <Text style={styles.mini_Text} >Confrim password</Text>
              <TextInput onChangeText={(e)=>onChageCRegister(e)} selectionColor='black' style={styles.input} />
            </View>
            <TouchableOpacity onPress={onPress} style={[styles.button, {marginTop:10, alignSelf:'flex-end'}]} >
              <Text style={{fontSize:16, color:'#fff'}} >Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    </Modal>
  )
}

export default RegisterPin