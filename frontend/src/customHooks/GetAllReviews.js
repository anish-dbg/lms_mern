import axios  from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux"
import { serverUrl } from "../App";
import { setReviewData } from "../redux/reviewSlice";



const useGetAllReviews = () =>{
    const dispatch = useDispatch();

    useEffect(() =>{
        const allReviews = async() =>{
            try {
                const result = await axios.get(serverUrl +'/api/review/getreview', {withCredentials:true});
                dispatch(setReviewData(result.data));
                console.log(result.data);
            } catch (error) {
                console.log(error);
            }
        }
        allReviews();
    }, [])
}

export default useGetAllReviews;