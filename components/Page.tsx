import { View, Text, SafeAreaView, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { styles } from '../utils/commonStyles'
import Header from './Header';
import PAGE1 from '../assets/imgs/page1.jpg'
import PAGE2 from '../assets/imgs/page2.jpg'
import PAGE3 from '../assets/imgs/page3.jpg'
import { useRouter } from 'expo-router';


type pageProps ={
    pagenumber:string,
    page:number,
    message:string,
    onTap?:()=>any
}

const Pages = ({pagenumber, page, message, onTap}:pageProps) => {
    const router = useRouter();
  return (
    <SafeAreaView style={styles.main} >
      <Header title='Welcome' />
      <View style={styles.page_content} >
        <Text style={{...styles.mini_Text, alignSelf:'flex-end'}} >{pagenumber}</Text>
        <Image source={page===0 ? PAGE1 : page === 1 ? PAGE2 : PAGE3} style={{width:'100%', height:300, borderRadius:10, objectFit:'cover'}} />
        <View style={{width:'100%', gap:7, justifyContent:'center', flexDirection:'row'}} >
            <View style={page === 0 ? styles.dottoed:styles.dot} />
            <View style={page === 1 ? styles.dottoed:styles.dot} />
            <View style={page === 2 ? styles.dottoed:styles.dot} />
        </View>
        <Text style={{...styles.mainText, fontWeight:'900', textAlign:'center', fontSize:23}} >{message}</Text>
        {
            page === 2 &&
            <TouchableOpacity onPress={()=>router.push('/')} style={styles.button} >
                <Text style={{fontSize:18, fontWeight:'800', color:'#fff'}} >Next</Text>
            </TouchableOpacity>
        }
      </View>
    </SafeAreaView>
  )
}

export default Pages