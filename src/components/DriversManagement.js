import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { collection, getDocs } from "firebase/firestore"; 
import { firebase } from '../firebase'

function DriversManagement({ fetchDrivers, setFetchDrivers }) {
  const [drivers, setData] = useState([]);
  const [selectedDriverId, setSelectedDriverId] = useState(null);
  const [showAllDrivers, setShowAllDrivers] = useState(false);

  //GET DATA
  useEffect(() => {
    if (fetchDrivers) {
      const fetchData = async () => {
        try {
          const querySnapshot = await getDocs(collection(firebase, 'drivers'));
          const todoData = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
          }));
          setData(todoData);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      fetchData();
      setFetchDrivers(false);
    }
  }, [fetchDrivers, setFetchDrivers]);
    
  const toggleShowInfo = (driverId) => {
    setSelectedDriverId(driverId === selectedDriverId ? null : driverId);
  };

  const handleShowAllDrivers = () => {
    setShowAllDrivers(!showAllDrivers);
  };


  const showAllBtnStyle = {
    background: showAllDrivers 
      ? 'linear-gradient(to left, #FFFF00, #FFFFFF)' 
      : 'linear-gradient(to left, #FFFFFF, #FFFF00)',
    color: 'black',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '20px',
    maxWidth: '97%',
    fontSize: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    padding: '5px 10px',
    boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.1)',
    whiteSpace: 'nowrap',
  };
        
  return (
    <div>
      <h2 className='DriverManagement'>Driver Management</h2>
      <div>
        <h3 className="dl">Drivers List</h3>
        <Button
          className='showAllBtn'
          onClick={handleShowAllDrivers}
          style={showAllBtnStyle}
        >
          {showAllDrivers ? "Hide all driver's information" : "Show all driver's information"}
        </Button>
        {drivers.map((driver) => (
          
          /*Màu cho DriverUnit //status */
          <button 
          className={`DriverUnit ${selectedDriverId === driver.id || showAllDrivers ? 'expanded' : ''}`} 
          key={driver.id} 
          style={ 
            driver.status === 'Ready' 
              ? { background: 'linear-gradient(to right, #70E2FF, #0072FF)' } 
              : driver.status === 'Not ready' 
                ? { background: 'linear-gradient(to right, lightcoral, red)' } 
                : {} 
          } 
          onClick={() => toggleShowInfo(driver.id)}
        >

            <strong className="DriverName">{driver.name}</strong>
            <ul className="DriverDetails">
              <li>Age: {driver.age ? driver.age : 'unknown'}</li>
              <li>License Type: {driver.licenseType ? driver.licenseType : 'unknown'}</li>
              <li>Phone: {driver.phone ? driver.phone : 'unknown'}</li>
              <li>Address: {driver.address ? driver.address : 'unknown'}</li>
              <li>Driving History: {driver.drivingHistory ? driver.drivingHistory : 'unknown'}</li>
              <li>Status: {driver.status}</li>
              {driver.image ? (
                <img
                  src={driver.image}
                  alt="Driver Image"
                  style={{
                    width: '150px',
                    maxWidth: '100%',
                    border: '2px solid black',
                    borderRadius: '5px',
                    display: 'inline-block',
                    marginRight: 'auto',
                  }}
                />
              ) : (
                <img
                  src="https://www.shutterstock.com/shutterstock/photos/535853263/display_1500/stock-vector-profile-photo-vector-placeholder-pic-male-person-default-profile-gray-photo-picture-avatar-535853263.jpg"
                  alt="Broken Image"
                  style={{
                    width: '150px',
                    maxWidth: '100%',
                    border: '2px solid black',
                    borderRadius: '5px',
                    display: 'inline-block',
                    marginRight: 'auto',
                  }}
                />
              )}
            </ul>
          </button>
        ))}
      </div>
      <div className="divider"></div>
    </div>
  );
}

export default DriversManagement;