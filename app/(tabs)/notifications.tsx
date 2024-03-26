import { View, Text, SafeAreaView, ScrollView, Pressable, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { styles } from '../../utils/commonStyles'
import Header from '../../components/Header'
import { NotificationData } from '../../utils/Dummy';
import { MaterialIcons } from '@expo/vector-icons';

const Page = () => {
    // const [isNotiTapped, setIsNotiTapped] = useState(false);
    const [currentNotiId, setCurrentNotiId] = useState<number>();

    const tapNotification = (id:number)=>{
        if(id === currentNotiId){
            setCurrentNotiId(undefined);
        }
        else{

            setCurrentNotiId(id);
        }
    }
  return (
    <SafeAreaView style={styles.main} >
      <Header title='Notifications' />
      <View style={styles.container} >
        <ScrollView style={{width:'100%'}} contentContainerStyle={{flexGrow:1}} >
        <View style={{width:'90%', paddingBottom:110, alignSelf:'center'}} >
          {
            NotificationData && NotificationData.map(noti=>(
                <Pressable onPress={()=>tapNotification(noti.id)} key={noti.id} style={styles.noti} >
                    <Text style={[styles.noti_title, !noti.read &&{fontWeight:'800'}]} >{noti.title}</Text>
                    <View style={[styles.noti_box, noti.id !== currentNotiId && {display:'none'}]}  >
                    <TouchableOpacity style={{position:'absolute', right:0}} >
                        <MaterialIcons name="delete" size={24} color="crimson" />
                    </TouchableOpacity>
                        <Text style={[styles.noti_content, noti.read&&{color:'grey'}]} >{noti.content}</Text>
                        <View style={[{justifyContent:'space-between', flexDirection:'row'},
                        
                        ]} >
                            <Text style={{}} >{noti.started}</Text>
                            <Text style={{}} >-</Text>
                            <Text style={{}} >{noti.ending}</Text>
                        </View>
                    </View>
                    <Text style={{alignSelf:'flex-end'}} >{noti.created}</Text>
                </Pressable>
            ))
          }
        </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

export default Page