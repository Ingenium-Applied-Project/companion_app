'use client';

import SystemHealthCheck from '@/components/SystemHealthCheck/SystemHealthCheck';
import React, { useEffect, useState } from 'react';
import apiHandler from '../../utils/api/fetchScreens'; // Adjust the path based on your actual file structure
import style from './page.module.css';

const HealthCheck = () => {
  // const [data, setData] = useState(null);
  // const [isLoading, setIsLoading] = useState(true);
  // const [error, setError] = useState(null);

  useEffect(() => {
    // const fetchData = async () => {
    //   try {
    //     const response = await apiHandler(); // Call the API route handler function
    //     setData(response); // Update state with the fetched data
    //     setIsLoading(false); // Set loading to false once data is fetched
    //   } catch (error) {
    //     console.error('Error fetching data:', error);
    //     setError(error); // Set error state if fetching data fails
    //     setIsLoading(false); // Set loading to false in case of error
    //   }
    // };
    // fetchData(); // Call the fetchData function when the component mounts
  }, []);

  // if (isLoading) {
  //   return <p>Loading...</p>; // Render a loading message while fetching data
  // }

  // if (error) {
  //   return <p>Error: {error.message}</p>; // Render an error message if fetching data fails
  // }

  return <SystemHealthCheck />;

  // return (
  //   <div>
  //     <h1>Fetch Data</h1>
  //     {/* <pre>{JSON.stringify(data.screensArr.screens, null, 2)}</pre> */}
  //     {Array.isArray(data.screensArr.screens) &&
  //     data.screensArr.screens.length > 0 ? (
  //       <div>
  //         <p>Data fetched successfully!</p>
  //         {/* Render your data here */}
  //         <ul className={style.grid}>
  //           {data.screensArr.screens.map((element) => {
  //             return (
  //               <li key={element.id} className={style.gridItems}>
  //                 <span className={style.gridItem}>
  //                   Screen Id: {element.id}
  //                 </span>
  //                 <span className={style.gridItem}>
  //                   Screen Version: {element.version}
  //                 </span>
  //               </li>
  //             );
  //           })}
  //         </ul>
  //       </div>
  //     ) : (
  //       <p>No data available</p>
  //     )}
  //   </div>
  // );
};

export default HealthCheck;
