import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, SafeAreaView } from 'react-native';
import PagerView from 'react-native-pager-view';
import Pages from '../../components/Page';
import { handleBackgroundNotifications } from '../../hooks/useNotifications';
import { styles } from '../../utils/commonStyles';

const Page = () => {
    handleBackgroundNotifications()
   
  return (
    <>
    <PagerView  style={{flex:1}} initialPage={0}>
        <View style={styles.pages} key="1">
          <Pages  pagenumber='1/3' page={0}
            message='A Revolution to Class Attendance'
          />
        </View>
        <View style={styles.pages} key="2">
        <Pages pagenumber='2/3' page={1}
            message='With Just A Scan Of Your Finger'
          />
        </View>
        <View style={styles.pages} key="3">
        <Pages pagenumber='3/3' page={2}
            message='You Can Only Take Attendance When You Are In Class Range'
          />
        </View>
    </PagerView>
    </>
  );
};


export default Page;