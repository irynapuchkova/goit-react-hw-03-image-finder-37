import axios from "axios";

const BASE_URL = "https://pixabay.com/api/";
const API_KEY = "22640715-8f791d5797d8fe249801e9206";

axios.defaults.baseURL = BASE_URL;
axios.defaults.params = {
  image_type: "photo",
  key: API_KEY,
  orientation: "horizontal",
  per_page: 12,
};

export const fetchInfo = async (query, page) => {
  const response = await axios.get("", {
    params: { page, q: query },
  });

  return response.data;
};
