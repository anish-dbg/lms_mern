import axios from "axios";
import { serverUrl } from "../App";
import { setCourseData } from "../redux/courseSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";


const GetPublishedCourse = () =>{
    const dispatch = useDispatch();
    useEffect(() =>{
        const getCourseData = async () =>{
            try{
                const result = await axios.get(serverUrl + "/api/course/getpublished", {withCredentials:true});
                dispatch(setCourseData(result.data));
                console.log(result.data);
            }catch(error){
                console.log(error);

            }
        }
        getCourseData();
    },[])
}

export default GetPublishedCourse;