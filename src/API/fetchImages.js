import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/api/';
axios.defaults.params = {
  image_type: 'photo',
  key: '22640715-8f791d5797d8fe249801e9206',
  orientation: 'horizontal',
  per_page: 12,
};

export const fetchInfo = async (q, page) => {
  const response = await axios.get('', { params: { page, q } });

  return response.data;
};
