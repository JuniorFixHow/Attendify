import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { userProps } from "../Types/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigationContainerRef, useRouter, useSegments } from "expo-router";
import { ActivityIndicator } from "react-native";

type childrenProp = {
    children:ReactNode
}
type contextProps = {
    setUserData:(e:userProps)=>void,
    logout:()=>void,
    user:userProps | null,
    onboardUser:()=>void,
    authInitialized:boolean,
}
export const AuthContext = createContext<contextProps | null>(null)
export const AuthContextProvider = ({children}:childrenProp) =>{
    const [user, setUser] = useState<userProps | null>(null);
    const [isNew, setIsNew] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);
    const [authInitialized, setAuthInitialized] = useState<boolean>(false);

    // const router = useRouter();

    const setUserData = (data:userProps)=>{
        setLoading(true);
        try {         
            setUser(data);
            AsyncStorage.setItem('user', JSON.stringify(data));
        } catch (error) {
            console.log(error);
        }finally{
            setLoading(false);
        }
    }

    const logout = async()=>{
        setLoading(true);
        try {
            setUser(null);
            await AsyncStorage.removeItem('user');      
        } catch (error) {
            console.log(error);
        }finally{
            setLoading(false);
        }
    }

    const onboardUser = ()=>{
        setLoading(true);
        try {
            AsyncStorage.setItem('new', JSON.stringify(false))
            setIsNew(false);
        } catch (error) {
            console.log(error)
        }
        finally{
            setLoading(false);
        }
    }
    const useProtectedRoute = (user:userProps | null)=>{
        const segment = useSegments();
        const router = useRouter();

        const [isNavigationReady, setNavigationReady] = useState(false);
        const rootNavigation = useNavigationContainerRef();

        useEffect(()=>{
            const unsubscribe = rootNavigation?.addListener('state', (event)=>{
                setNavigationReady(true);
            });
            return function cleanup(){
                if(unsubscribe){
                    unsubscribe();
                }
            }
        },[rootNavigation]);

        useEffect(()=>{
            if(!isNavigationReady){
                return
            }

            const inAuthGroup = segment[0] === '(auth)';

            if(!authInitialized) return;
            if(!isNew){
                router.push('/(auth)/welcome');
            }
            else if(!user && !inAuthGroup){
                router.push('/(auth)/register');
            }else if(user && inAuthGroup){
                router.push('/(tabs)');
            }
        },[user, segment, authInitialized, isNavigationReady]);
    };

    const isAuth = async()=>{
        setLoading(true);
        try {
            const newUser = await AsyncStorage.getItem('new');
            const userInfo = await AsyncStorage.getItem('user');
            if(!newUser){
                setIsNew(true);
                // router.push('/welcome');
            }
            else if(newUser && !userInfo){
                setIsNew(false);
                // router.push('/');
            }
            else if(newUser && userInfo){
                setUser(JSON.parse(userInfo));
                // router.push('/tabs/home');
            }
            // else{
            //     router.push('/');
            // }
        } catch (error) {
            console.log(error);
        }finally{
            setLoading(false);
            setAuthInitialized(true);
        }
    }

    useEffect(()=>{
        isAuth();
    },[]);

    // console.log(user)

    // if(loading){
    //     return(
    //         <ActivityIndicator size='large' />
    //     )
    // }
    useProtectedRoute(user);
    return(
        <AuthContext.Provider value={{user, onboardUser, logout, setUserData, authInitialized}} >
            {children}
        </AuthContext.Provider>
    )
}

export const authContext = ()=>{
    const authContext = useContext(AuthContext);
    if(!authContext){
        throw new Error('useAuth must be within auth provider')
    }
    return authContext;
}