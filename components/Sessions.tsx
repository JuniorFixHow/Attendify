import { View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import { styles } from '../utils/commonStyles'
import Header from './Header'
import { AttendanceData } from '../utils/Dummy';
import { Feather, MaterialCommunityIcons  } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { Colours } from '../utils/Colours';
import { useRouter } from 'expo-router';

const Sessions = () => {
    const router = useRouter();
  return (
    <SafeAreaView style={styles.main}>
      <Header icon title='Sessions' />
      <View style={styles.mini_container} >
        <ScrollView style={{width:'100%'}} contentContainerStyle={{flexGrow:1}} >
            <View style={{width:'100%', alignItems:'center', marginBottom:110}} >

                {
                    AttendanceData && AttendanceData.map(session=>(
                        <LinearGradient
                        //  colors={[Colors.gradient_a, Colors.gradient_b]} 
                        colors={['#3165F7', '#8C1AD1']}
                        start={{x: 0.8, y: 0.1 }}
                        key={session.id} style={styles.session_box} >

                                <Text style={{fontWeight:'800', fontSize:35, color:'#fff'}} >{session.title}</Text>
                                <View style={{alignItems:'center', justifyContent:'flex-start', marginTop:10, gap:8, flexDirection:'row', width:'100%',}} >
                                    <Text style={styles.mini_Title} >Status:</Text>
                                    <Feather name="info" size={24} color={session.ongoing? 'green':'crimson'} />
                                </View>
                                <View style={{alignItems:'center', justifyContent:'flex-start', marginTop:10, gap:8, flexDirection:'row', width:'100%',}} >
                                    <Text style={styles.mini_Title} >Range:</Text>
                                    {
                                        session.withinRange?
                                        <Feather name="check-circle" size={24} color="green" />:
                                        <MaterialCommunityIcons name="information-off-outline" size={24} color={'grey'} />
                                    }
                                </View>
                                <TouchableOpacity onPress={()=>router.push('/attendance')} disabled={!session.ongoing || !session.withinRange} 
                                    style={{borderWidth:1, borderColor:(!session.ongoing || !session.withinRange)? Colours.primary:'teal', width:'80%', paddingVertical:5,
                                    alignItems:'center', borderRadius:4, marginTop:5,
                                }}
                                >
                                    <Text style={{fontSize:16, color:(!session.ongoing || !session.withinRange)? 'grey':'#fff'}} >Take Attendance</Text>
                                </TouchableOpacity>
                        </LinearGradient>
                    ))
                }
            </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

export default Sessions