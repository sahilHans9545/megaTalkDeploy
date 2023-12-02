const link = "production";
const apiUrl = link === "deploy" ? "http://localhost:5000" : " ";
export default apiUrl;
