import * as Location from 'expo-location';


export const useLocation = async()=>{
    try {
        let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
            // Handle permission not granted
            alert('Permission to use device location is denied. You cannot take attendance.')
            return;
            }
        const accuracy = Location.Accuracy.BestForNavigation;
        let location = await Location.getCurrentPositionAsync({accuracy});
        return location;
        
    } catch (error) {
        console.log(error)
    }
}