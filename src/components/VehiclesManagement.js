import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { collection, getDocs } from "firebase/firestore";
import { firebase } from '../firebase';

function VehiclesManagement({ setVehicleId, fetchVehicles, setFetchVehicles }) {
  const [vehicles, setData] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showAllVehicles, setShowAllVehicles] = useState(false);

  //GET DATA
  useEffect(() => {
    if (fetchVehicles) {
      const fetchData = async () => {
          try {
            const querySnapshot = await getDocs(collection(firebase, 'vehicles'));
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
      setFetchVehicles(false);
    }
  }, [fetchVehicles, setFetchVehicles]);

  //FUNCTION    
  const handleShowAllVehicles = () => {
    setShowAllVehicles(!showAllVehicles);
  };

  const showAllBtnStyle = {
    background: showAllVehicles 
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

  const toggleShowInfo = (vehicleId) => {
    setSelectedVehicle(vehicleId === selectedVehicle ? null : vehicleId);
    setVehicleId(selectedVehicle !== vehicleId ? vehicleId : null);
  };

  return (
    <div>
      <h2 className='VehicleManagement'>Vehicle Management</h2>
      <div>
        <h3 className="vl">Vehicles List</h3>
        <Button
          onClick={handleShowAllVehicles}
          style={showAllBtnStyle}
        >
          {showAllVehicles ? "Hide all vehicle's information" : "Show all vehicle's information"}
        </Button>
        {vehicles.map((vehicle) => (
          <button
            className={`VehicleUnit ${selectedVehicle === vehicle.id || showAllVehicles ? 'expanded' : ''}`}
            key={vehicle.id}

            style={
              vehicle.status === 'Working'
                ? { background: 'linear-gradient(to right, lightcoral, red)' }
                : vehicle.status === 'Maintenance'
                ? { background: 'linear-gradient(to right, grey, darkgrey)' }
                : vehicle.status === 'Inactive'
                ? { background: 'linear-gradient(to right, #70E2FF, #0072FF)' }
                : {}
            }

            onClick={() => toggleShowInfo(vehicle.id)}
          >
            <strong className="VehicleName">{vehicle.name}</strong>
            <ul className="VehicleDetails">
              <li>Size: {vehicle.size ? vehicle.size : 'unknown'}</li>
              <li>Payload: {vehicle.payload ? vehicle.payload : 'unknown'}</li>
              <li>Fuel Type: {vehicle.fuel ? vehicle.fuel : 'unknown'}</li>
              <li>Status: {vehicle.status ? vehicle.status : 'unknown'}</li>
              <li>License Plate: {vehicle.licensePlate ? vehicle.licensePlate : 'unknown'}</li>
              {vehicle.image ? (
                <img
                  src={vehicle.image}
                  alt={vehicle.name}
                  className="VehicleImage"
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
                  src="https://t3.ftcdn.net/jpg/02/33/69/46/360_F_233694647_8fEIOuq6QVxjFHTOhLrN3xBLYAnP8WA7.jpg"
                  alt="BrkImage"
                  className="VehicleImage"
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

export default VehiclesManagement;