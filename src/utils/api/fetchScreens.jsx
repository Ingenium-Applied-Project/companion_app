// app/api/route.jsx

import fetchStqry from '../../utils/api/fetch';

const screens = async () => {
  const url = 'https://app.mytoursapp.com/api/v3/app/manifest';
  const screensArr = await fetchStqry(url);
  console.log(screensArr);
  return { screensArr };
};

export default screens;
