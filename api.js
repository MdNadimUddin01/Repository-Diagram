import axios from "axios";

const BACKEND_URL = "http://localhost:3000" + "/api/v1/flowChartCode";
export const flowchartCodeApi = async (file) => {

    let apiResult = ``;
    try {
        
        const {data} = await axios.post(BACKEND_URL, { file: JSON.stringify(file) });
        console.log("response : ", data);
        apiResult = data.result;

    } catch (error) {
        console.log(error);
    }

    return apiResult;
}