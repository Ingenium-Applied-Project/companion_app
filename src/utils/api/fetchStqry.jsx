const fetchStqry = async (url) => {
  try {
    const username = '9403';
    const password = 'f313a575-e87e-45b4-88ef-43445071f0da';
    const authString = `${username}:${password}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Basic ${Buffer.from(authString).toString('base64')}`,
        'Content-Type': 'application/json',
        HTTP_STQRY_PROJECT_TYPE: 'app',
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching data:', error);
    return error;
  }
};

export default fetchStqry;
