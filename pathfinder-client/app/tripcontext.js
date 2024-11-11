import React, { createContext, useState } from 'react';

export const TripContext = createContext();


export const TripProvider = ({ children }) => {
  const [trips, setTrips] = useState([]); 

 
  return (
    <TripContext.Provider value={{ trips, setTrips }}>
      {children}
    </TripContext.Provider>
  );
};