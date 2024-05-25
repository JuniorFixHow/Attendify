import * as Notifications from 'expo-notifications';

export const handleNotifications = async(title:string, body:string)=>{
    try { 
          await Notifications.scheduleNotificationAsync({
            content: {
              title,
              body,
              data:{},
              sound:'default'
            },
            trigger: {
              seconds: 1,
            },
          });
    } catch (error) {
        console.log(error)
    }
}