import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { userProps } from "../Types/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigationContainerRef, useRouter, useSegments } from "expo-router";

type childrenProp = {
    children:ReactNode
}
type contextProps = {
    setUserData:(e:userProps)=>void,
    logout:()=>void,
    user:userProps | null,
    onboardUser:()=>void,
    loading:boolean,
}
export const AuthContext = createContext<contextProps | null>(null);

export const AuthContextProvider = ({children}:childrenProp)=>{
    const router = useRouter();
    const [user, setUser] = useState<userProps | null>(null);
    const [old, setOld] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const setUserData=(data:userProps)=>{
        try {
            setUser(data);
            AsyncStorage.setItem('user', JSON.stringify(data));
        } catch (error) {
            console.log(error)
        }
    }

    const logout = async()=>{
        try {    
            setUser(null);
            await AsyncStorage.removeItem('user');
            router.replace('/(app)/(auth)/register');
        } catch (error) {
            console.log(error);
        }

    }

    const onboardUser = ()=>{
        try {
            setOld(true);
            AsyncStorage.setItem('old', JSON.stringify(true));
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(()=>{
        fetchUser().then(()=>console.log('context run'))
    },[])

    const fetchUser = async()=>{
        setLoading(true);
        try {
            const oldUser = await AsyncStorage.getItem('old');
            const userInfo = await AsyncStorage.getItem('user');
            // console.log(oldUser, userInfo);
            if(!oldUser && !userInfo){
                setLoading(false);
               router.replace('/(app)/(auth)/welcome');
                // alert('no user and new user')
            }
            else if(oldUser && !userInfo){
                setLoading(false);
                setOld(true);
                // alert('no user and old user')
                router.replace('/(app)/(auth)/register');
            }
            else if(oldUser && userInfo){
                setLoading(false);
                setUser(JSON.parse(userInfo));
                setOld(true);
                // alert('user and old user')
                router.replace('/(app)/(tabs)');
            }
        } catch (error) {
            console.log(error)
            setLoading(false);
        }
    }

    // const useProtectedRoute = (user:userProps | null)=>{
    //     const segment = useSegments();
    //     // const router = useRouter();

    //     const [isNavigationReady, setNavigationReady] = useState(false);
    //     const rootNavigation = useNavigationContainerRef();

    //     useEffect(()=>{
    //         const unsubscribe = rootNavigation?.addListener('state', (event)=>{
    //             setNavigationReady(true);
    //         });
    //         return function cleanup(){
    //             if(unsubscribe){
    //                 unsubscribe();
    //             }
    //         }
    //     },[rootNavigation]);

    //     useEffect(()=>{
    //         if(isNavigationReady){
    //             return
    //         }
    //         fetchUser()
    //     },[user, segment, isNavigationReady]);
    //     // console.log(isNavigationReady)
    // };
   

    // useProtectedRoute(user);

    return(
        <AuthContext.Provider value={{onboardUser, loading, user, setUserData, logout}} >
            {children}
        </AuthContext.Provider>
    )

}

export const useAuth = ()=>{
    const authContext = useContext(AuthContext);
    if(!authContext){
        throw new Error('useAuth must be within auth provider')
    }
    return authContext;
}