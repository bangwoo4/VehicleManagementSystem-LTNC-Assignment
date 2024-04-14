import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { ref, child, get } from "firebase/database";
import { database } from '../firebase'

function VehiclesManagement({ VehicleIdPass }) {
  const [vehicles, setData] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showAllVehicles, setShowAllVehicles] = useState(false);
  const dbRef = ref(database);

  //GET DATA
  get(child(dbRef, `/vehicles`)).then((snapshot) => {
    if (snapshot.exists()) {
      let temp = [];
      snapshot.forEach(childsnapshot => {
        let keyname = childsnapshot.key;
        let data = childsnapshot.val();
        data.id = keyname;
        temp.push(data);
      });
      setData(temp);
    } else {
      console.log("No data available");
    }
  }).catch((error) => {
    console.error(error);
  });

  //FUNCTION    
  const handleShowAllVehicles = () => {
    setShowAllVehicles(!showAllVehicles);
  };

  const showAllBtnStyle = {
    backgroundColor: showAllVehicles ? 'lightblue' : 'white',
    color: showAllVehicles ? 'white' : 'black',
    border: '1px solid #ccc',
    borderRadius: '4px',
    maxWidth: '90%',
    fontSize: '10px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    padding: '5px',
  };

  const toggleShowInfo = (vehicleId) => {
    setSelectedVehicle(vehicleId === selectedVehicle ? null : vehicleId);
    VehicleIdPass(selectedVehicle !== vehicleId ? vehicleId : null)
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
        className="VehicleUnit"
        key={vehicle.id}
        style={
            vehicle.status === 'Working'
            ? { backgroundColor: 'lightcoral' }
            : vehicle.status === 'Maintenance'
            ? { backgroundColor: 'grey' }
            : vehicle.status === 'Inactive'
            ? { backgroundColor: 'lightgreen' }
            : {}
        }
        onClick={() => toggleShowInfo(vehicle.id)}
        >
        <strong className="VehicleName">{vehicle.name}</strong>
        {(selectedVehicle === vehicle.id || showAllVehicles) && (
          <ul className="VehicleDetails">

          <li>Size: 
              {vehicle.size ? vehicle.size : 'unknown'}
          </li>

          <li>Payload: 
              {vehicle.payload ? vehicle.payload : 'unknown'}
          </li>

          <li>Fuel Type: 
              {vehicle.fuel ? vehicle.fuel : 'unknown'}
          </li>

          <li>Status: 
              {vehicle.status ? vehicle.status : 'unknown'}
          </li>

          <li>License Plate: 
              {vehicle.licensePlate ? vehicle.licensePlate : 'unknown'}
          </li>

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
        )}
        </button>
        ))}
      </div>
    </div>
  );
}
  
  export default VehiclesManagement;