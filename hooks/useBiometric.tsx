import * as LocalAuthentication from "expo-local-authentication";
export const useBiometric = async()=>{
    const compatible = await LocalAuthentication.hasHardwareAsync();
    const enroll = await LocalAuthentication.isEnrolledAsync();
    return compatible && enroll;
}