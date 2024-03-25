// app/api/route.jsx

import fetchStqry from '../../utils/api/fetchStqry';

const screens = async () => {
  const url = 'https://app.mytoursapp.com/api/v3/app/manifest';
  const screensArr = await fetchStqry(url);
  console.log(screensArr);
  screensArr.screens.map(async (screen) => {
    const screenUrl = `https://app.mytoursapp.com/api/v3/screens/${screen.id}/en/${screen.version}`;
    const screenData = await fetchStqry(screenUrl);
    console.log(screenData);
    return screenData;
  });
  return { screensArr };
};

export default screens;
