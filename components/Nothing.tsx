import { View, Text, SafeAreaView, Image } from 'react-native'
import React from 'react'
import { styles } from '../utils/commonStyles'
import Header from './Header';
import NoData from '../assets/imgs/nodata.png';

type nothingProp={
  title:string
}
const Nothing = ({title}:nothingProp) => {
  return (
    <SafeAreaView style={styles.main}>
        <Header title='Sessions' />
        <View style={styles.container} >
            <Image source={NoData} style={{width:'80%', height:350, objectFit:'cover'}} />
            <Text style={styles.mainText} >{title}</Text>
        </View >
    </SafeAreaView>
  )
}

export default Nothing