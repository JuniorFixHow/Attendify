import { View, Text, SafeAreaView, ScrollView, Pressable, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { styles } from '../../../utils/commonStyles'
import Header from '../../../components/Header'
import { NotificationData } from '../../../utils/Dummy';
import { MaterialIcons } from '@expo/vector-icons';
import { collection, deleteDoc, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { useAuth } from '../../../context/AuthContext';
import { db } from '../../../firebase';
import { NotiProps } from '../../../Types/types';
import { checkTimeSince } from '../../../functions/dates';
import Nothing from '../../../components/Nothing';

const Page = () => {
    // const [isNotiTapped, setIsNotiTapped] = useState(false);
    const {user}= useAuth();
    const [currentNotiId, setCurrentNotiId] = useState<string>();
    const [notifications, setNotifications] = useState<NotiProps>([]);
    const [notiLoading, setNotiLoading] = useState<boolean>(false)

    const tapNotification = async(id:string, read:boolean)=>{
        if(id === currentNotiId){
            setCurrentNotiId(undefined);
        }
        else{
          try {
            setCurrentNotiId(id);
            if(user && !read){
              const notiRef = doc(db, 'Students', user?.sID.toString(), 'Notifications', id)
              await updateDoc(notiRef, {read:true})
              // console.log(noti.data())
            }
            
          } catch (error) {
            console.log(error)
          }
        }
    }

    const deleteNotification = async(id:string)=>{
      try {
        if(user){
          const deleteRef = doc(db, 'Students', user?.sID.toString(), 'Notifications', id )
          await deleteDoc(deleteRef);
        }
      } catch (error) {
        console.log(error)
      }
    }

    useEffect(()=>{
      
      if(user){
        setNotiLoading(true);
        const reference = collection(db, 'Students', user?.sID.toString(), 'Notifications');
        // const q = query(reference, where('ongoing', '==', true))
        const unsub = onSnapshot(
            reference,  (snapshot)=>{
                let list:NotiProps = [];
                snapshot.docs.forEach((doc)=>{
                  list.push({id:doc.id, ...doc.data()} as NotiProps[0])
                })
                setNotifications(list.sort((a, b)=> new Date(a.start) < new Date(b.start) ? 1:-1));      
                // console.log(list)
                setNotiLoading(false);
                // console.log('My list', list[0].students.filter((st:attendanceProps[0])=>st.id !== user?.sID));
                
            },
            (error)=>{
                console.log(error);
                setNotiLoading(false);
            },
            
        )
        // user && unsub();
        return()=>{
            unsub()
        }

      }
  },[])

  // console.log(notifications);
  if (notiLoading) {
    // Handle location loading state
    return <View style={{flex:1, backgroundColor:'#fff', alignItems:'center', justifyContent:'center'}} >
    <ActivityIndicator size='large' />
  </View>;
  }
  

  return (
    <>
    {
      notifications.length?
      <SafeAreaView style={styles.main} >
        <Header title='Notifications' />
        <View style={styles.container} >
          <ScrollView style={{width:'100%'}} contentContainerStyle={{flexGrow:1}} >
          <View style={{width:'90%', paddingBottom:110, alignSelf:'center'}} >
            {
              notifications && notifications.map(noti=>(
                  <Pressable onPress={()=>tapNotification(noti.id, noti.read)} key={noti.id} style={styles.noti} >
                      <Text style={[styles.noti_title, !noti.read &&{fontWeight:'800'}]} >{noti.title}</Text>
                      <View style={[styles.noti_box, noti?.id !== currentNotiId && {display:'none'}]}  >
                      <TouchableOpacity onPress={()=>deleteNotification(noti?.id)} style={{position:'absolute', zIndex:10, right:0}} >
                          <MaterialIcons name="delete" size={24} color="crimson" />
                      </TouchableOpacity>
                          <Text style={[styles.noti_content, noti.read&&{color:'grey'}]} >{noti.body}</Text>
                          <View style={[{justifyContent:'space-between', flexDirection:'row'},
                          
                          ]} >
                              <Text style={{}} >{new Date(noti.start).toLocaleDateString([], {hour: '2-digit', minute:'2-digit'})}</Text>
                              <Text style={{}} >-</Text>
                              <Text style={{}} >{new Date(noti.end).toLocaleDateString([], {hour: '2-digit', minute:'2-digit'})}</Text>
                          </View>
                      </View>
                      <Text style={{alignSelf:'flex-end'}} >{checkTimeSince(new Date(noti.start))}</Text>
                  </Pressable>
              ))
            }
          </View>
          </ScrollView>
        </View>
      </SafeAreaView>
      :
      <Nothing header='Notifications' title='There are no notifications available. Attendance actions will appear here.' />
    }
    </>
  )
}

export default Page