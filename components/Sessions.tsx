import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { styles } from '../utils/commonStyles'
import Header from './Header'
import { AttendanceData } from '../utils/Dummy';
import { Feather, MaterialCommunityIcons  } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { Colours } from '../utils/Colours';
import { useRouter } from 'expo-router';
import { and, collection, onSnapshot, or, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { SessionListProps, attendanceProps, sessionProp, sessionProps } from '../Types/types';
import { useAuth } from '../context/AuthContext';
import { checkTimeSince } from '../functions/dates';
import Nothing from './Nothing';
import { useFetch } from '../hooks/useFetch';



const Sessions: React.FC<SessionListProps> = ({sessionP}) => {
    const router = useRouter();
    const {user} = useAuth();
    // const [sessions, setSessions] = useState<sessionProp[]>([])

    // const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(
    //     null
    //   );
    //   const [filteredSessions, setFilteredSessions] = useState<sessionProp[]>([]);
    
    const [refreshing, setRefreshing] =useState(false);
    
    const {isLoading, fetchData, refetch, error, sessions, userLocation} = useFetch();
    // useEffect(()=>{
    //     fetchData();
    // },[])

        const onRefresh =useCallback(() => {
            setRefreshing(true);
            setTimeout(() => {
                refetch();
                // console.log('refetched')
            setRefreshing(false);
            }, 30000);
        }, []);

        // useEffect(()=>{
        //     setInterval(()=>{
        //         refetch();
        //     },5000)
        // },[])


    //   useEffect(()=>{
        
    //       const reference = collection(db, 'Sessions');
    //           const q = query(reference, where('ongoing', '==', true));
  
    //           const unsub = onSnapshot(
    //               q,  (snapshot)=>{
    //                   let data:sessionProp[] = [];
    //                   snapshot.docs.forEach((doc)=>{
    //                       data.push({id:doc.id, ...doc.data()} as sessionProp );
    //                   })
    //                   if(userLocation && data.length){
    //                     // console.log(data)
    //                     const filtered = data
    //                     .sort((a, b)=> new Date(a.end) < new Date(b.end) ? 1:-1)
    //                       .filter((item:sessionProps)=>
    //                       item.list?.every((student) => student !== undefined && typeof student === 'number' && student !== user?.sID)
    //                       )
    //                       .filter((ss)=>new Date(ss.end) > new Date())
    //                     .filter((session) => {
    //                         // const [lat, long] = session.position;
    //                         const distance = calculateDistance(
    //                           userLocation.coords.latitude,
    //                           userLocation.coords.longitude,
    //                           session.position.lat,
    //                           session.position.long
    //                         );
    //                         // console.log(distance <= 20)
    //                         return distance <= 20;
    //                       });
    //                     //   console.log('the filtered ',filtered);
    //                       setSessions(filtered);
    //                   }
    //                   // .sort((a, b)=> new Date(a.start)> new Date(b.start) ? 1:-1)   
    //                   // console.log(data.filter((item:sessionProps)=>!item.list.includes(user?.sID)))                 
    //               },
    //               (error)=>{
    //                   console.log(error)
    //               },
                  
    //           )
    //           // user && unsub();
    //           return()=>{
    //               unsub()
    //           }
    //   },[])
      
      
    //   useEffect(() => {
    //     if (userLocation && sessions.length) {
    //       // Filter sessions based on distance
    //       const filtered = sessions?.filter((session) => {
    //         // const {lat, lon} = session.position;
    //         const distance = calculateDistance(
    //           userLocation.coords.latitude,
    //           userLocation.coords.longitude,
    //           session.position.lat,
    //           session.position.long
    //         );
    //         return distance <= 20;
    //       });
    //       setFilteredSessions(filtered);
    //     }
    //   }, [userLocation, sessions]);
    
      if (!userLocation || isLoading) {
        // Handle location loading state
        return <View style={{flex:1, backgroundColor:'#fff', alignItems:'center', justifyContent:'center'}} >
        <ActivityIndicator size='large' />
      </View>;
      }

 
    //   console.log(sessions.filter(item=>item.list.filter(item=>item === user?.sID)));
    // console.log('filtered ',user?.sID);

  return (
    
    <>
    {
        sessions.length >0 ?
        <SafeAreaView style={ styles.main}>
            
            <Header icon title='Sessions' />
            <View style={styles.mini_container} >
                <ScrollView refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                } style={{width:'100%'}} contentContainerStyle={{flexGrow:1}} >
                    <View style={{width:'100%', alignItems:'center', marginBottom:110}} >

                        {
                            sessions && sessions
                            .map(session=>(
                                <LinearGradient
                                //  colors={[Colors.gradient_a, Colors.gradient_b]} 
                                colors={['#3165F7', '#8C1AD1']}
                                start={{x: 0.8, y: 0.1 }}
                                key={session.id} style={styles.session_box} >

                                        <Text style={{fontWeight:'800', fontSize:35, color:'#fff'}} >{session.code}</Text>
                                        <View style={{alignItems:'center', justifyContent:'flex-start', marginTop:10, gap:8, flexDirection:'row', width:'100%',}} >
                                            <Text style={styles.mini_Title} >Status:</Text>
                                            <Feather name="info" size={24} color={session.ongoing? 'green':'crimson'} />
                                        </View>
                                        <View style={{alignItems:'center', justifyContent:'flex-start', marginTop:10, gap:8, flexDirection:'row', width:'100%',}} >
                                            
                                        </View>
                                        <Text style={{fontSize:12, color:'#DBD8D8', alignSelf:'flex-end'}} >{checkTimeSince(new Date(session.start))}</Text>
                                        <TouchableOpacity onPress={()=>router.push({pathname:`/(app)/${session.id}`, params:{data:JSON.stringify(session)}})} disabled={!session.ongoing} 
                                            style={{borderWidth:1, borderColor:(!session.ongoing)? Colours.primary:'teal', width:'80%', paddingVertical:5,
                                            alignItems:'center', borderRadius:4, marginTop:5,
                                        }}
                                        >
                                            <Text style={{fontSize:16, color:(!session.ongoing)? 'grey':'#fff'}} >Take Attendance</Text>
                                        </TouchableOpacity>
                                </LinearGradient>
                            ))
                        }
                    </View>
                </ScrollView>
            </View>
            
            
        </SafeAreaView>
    :

    
        sessions.length < 1 ?
        <Nothing header='Sessions' title='There are no sessions available for you at the moment.' />
    
        :
    
        error &&
        <SafeAreaView style={{flex:1, backgroundColor:'#fff', alignItems:'center', justifyContent:'center'}} >
            <Text style={{fontSize:22, color:'crimson', fontWeight:'800'}} >Error occured fetching data</Text>
        </SafeAreaView>
    }
      
    
    </>
  )
}

export default Sessions