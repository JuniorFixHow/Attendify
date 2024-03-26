import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
export const registerForPushNotificationsAsync = async()=>{
    // let token;
    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
        }
        if (finalStatus !== 'granted') {
        alert("Couldn't get user's permission");
        return;
        }
        // token = (await Notifications.getExpoPushTokenAsync()).data;
        // console.log(token);
    } else {
        alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
        });
    }

}

export const handleBackgroundNotifications = ()=>{

    const notificationListener = useRef<any>();
    const responseListener = useRef<any>();

    useEffect(()=>{
      registerForPushNotificationsAsync().then(()=>{
        console.log('Asked for permission Permissions')
      })
         
      Notifications.setNotificationHandler({
          handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: true,
          }),
      });
  },[])

  useEffect(() => {
    registerForPushNotificationsAsync().then(() => console.log('Permission asked'));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('notification received here');
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('response recieved');
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);


}