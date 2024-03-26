import * as Notifications from 'expo-notifications';

type notiProps={
    title:string,
    body:string
}

export const handleNotifications = async({title, body}:notiProps)=>{
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