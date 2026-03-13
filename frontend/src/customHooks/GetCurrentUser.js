import { useEffect } from "react"
import axios from "axios";
import serverUrl from "../App"
import {useDispatch } from "react-redux"
import { setUserData } from "../redux/userSlice";



const useGetCurrentuser = () =>{
    const dispatch = useDispatch();
    useEffect(() =>{
        const fetchUser = async() =>{
            try{
                const result = await axios.get(serverUrl +"/api/user/getCurrentuser", {withCredentials:true});
                dispatch(setUserData(result.data))
            }catch(error){
                console.log(error);
                dispatch(setUserData(null));
            }
        }
        fetchUser();

    },[dispatch])
}

export default useGetCurrentuser;