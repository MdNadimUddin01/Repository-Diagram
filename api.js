import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL + "/api/v1/flowChartCode";

export const flowchartCodeApi = async (file , repoName) => {

    let apiResult = ``;
    try {
        
        const {data} = await axios.post(BACKEND_URL, { file: JSON.stringify(file) , repoName : repoName });
        // console.log("response : ", data);
        apiResult = data.result;

    } catch (error) {
        console.log(error);
    }

    console.log(apiResult)
    return apiResult;
}