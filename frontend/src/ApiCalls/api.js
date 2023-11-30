import axios from "axios";
import apiUrl from "../apiurl";
//https://megatalkbackend.onrender.com
export const getUser = (username) => {
  return axios
    .get(`${apiUrl}/api/getUser/${username}`)
    .then((response) => {
      // Handle the successful response
      // console.log("salu", response.data);
      return response.data;
    })
    .catch((error) => {
      // Handle error
      console.error("Error:", error);
      return error;
    });
};
