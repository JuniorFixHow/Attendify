import { View, Text, TextInput, Modal, Pressable, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { styles } from '../utils/commonStyles'
import { loginProps } from '../Types/types'


const LoginPin = ({lpassword, onShowLogin, showLogin, onChangeLogin, onPress }:loginProps) => {
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

            <View style={{width:'100%',}} >
              <Text style={styles.mini_Text} >Enter password</Text>
              <TextInput onChangeText={(e)=>onChangeLogin(e)} selectionColor='black' style={styles.input} />
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

export default LoginPin