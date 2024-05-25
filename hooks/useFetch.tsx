import { collection, doc, getDocs, query, where } from "firebase/firestore"
import { db } from "../firebase"
import { sessionProp } from "../Types/types";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import * as Location from 'expo-location';
import { calculateDistance } from "../functions/location";
import { useLocation } from "./useLoacation";

type ExtendedLocationObject = Location.LocationObject & {
    coords: Location.LocationObjectCoords;
  };


export const useFetch =()=>{
    const [sessions, setSessions] = useState<sessionProp[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
      const [filteredSessions, setFilteredSessions] = useState<sessionProp[]>([]);
    const {user} = useAuth();


    const getLocationAsync = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.log('Location permission denied');
          return;
        }
  
        const accuracy = Location.Accuracy.BestForNavigation;
  
        const locationSubscription = await Location.watchPositionAsync(
          {
            accuracy,
            timeInterval: 30000,
            distanceInterval: 10,
          },
          (location) => {
            // console.log('New location:', location.coords);
            setUserLocation(location);
            fetchData(location)
          }
        );
  
        return () => {
          if (locationSubscription) {
            locationSubscription.remove();
          }
        };
      } catch (error) {
        console.log('Error requesting location permissions:', error);
      }
    };



    useEffect(() => {
      if(user){
        getLocationAsync();
      }
    }, [user]);

       const fetchData = async (locationData: ExtendedLocationObject) => {
        setIsLoading(true);
        const reference = collection(db, 'Sessions');
        const q = query(reference, where('ongoing', '==', true));
        let list: sessionProp[] = [];
      
        const data = await getDocs(q);
        try {
      
            data.docs.forEach((doc) => {
              const session = doc.data() as sessionProp;
              const distance = calculateDistance(
                session.position.lat,
                session.position.long,
                locationData.coords.latitude,
                locationData.coords.longitude,
              );
              
              console.log('user location ',locationData.coords.latitude, locationData.coords.longitude);
              // console.log(distance, distance <= 1)
              if (distance <= 30) {
                list.push({id:doc.id, ...doc.data()} as sessionProp );
              }
            });
            if(user){
              const filteredSessions = list
                .sort((a, b) => new Date(a.end) < new Date(b.end) ? 1 : -1)
                .filter((item: sessionProp) =>
                  item.list?.every(
                    (student) =>
                    student !== undefined &&
                    typeof student === 'number' &&
                    (user === undefined || student !== user?.sID)
                  )
                )
                .filter((ss) => new Date(ss.end) > new Date())
                .filter((content)=> new Date(content.start)<= new Date());
                setSessions(filteredSessions);
            }
      
          
        } catch (error) {
          setError(true);
          alert('Error occurred while trying to fetch sessions. Please retry.');
          console.log(error);
        } finally {
          setIsLoading(false);
        }
      };

    // useEffect(()=>{  
    //     fetchData() 
    // },[])
        // console.log(userLocation?.coords)
    // console.log('filte ',filteredSessions)
    // console.log('filte ',sessions)

    const refetch = ()=>{
        // setIsLoading(true);
        getLocationAsync();
    }

    return {sessions, isLoading, error, refetch, fetchData, userLocation}
}