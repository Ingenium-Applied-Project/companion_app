'use client';

import React, { useEffect, useState } from 'react';
import apiHandler from '../../utils/api/fetchScreens'; // Adjust the path based on your actual file structure

const MultipleSizeImage = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiHandler(); // Call the API route handler function
        setData(response); // Update state with the fetched data
        setIsLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error); // Set error state if fetching data fails
        setIsLoading(false); // Set loading to false in case of error
      }
    };

    fetchData(); // Call the fetchData function when the component mounts
  }, []);

  if (isLoading) {
    return <p>Loading...</p>; // Render a loading message while fetching data
  }

  if (error) {
    return <p>Error: {error.message}</p>; // Render an error message if fetching data fails
  }

  return (
    <div>
      <h1>Multiple Size Image</h1>
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
      {Array.isArray(data.screens) && data.screens.length > 0 ? (
        <div>
          <p>Data fetched successfully!</p>
          {/* Render your data here */}
          <ul>
            {data.screens.map((item) => (
              <li key={item.id}>{item.name}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default MultipleSizeImage;
