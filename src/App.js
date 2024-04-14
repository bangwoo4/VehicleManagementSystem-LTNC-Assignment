import React, { useState }from 'react';
import VehiclesManagement from './components/VehiclesManagement';
import DriversManagement from './components/DriversManagement';
import PlansManagement from './components/PlansManagement';
import Actions from './components/Actions';
import './App.css';

function App() {
  const [Vehicleid, setVehicleId] = useState(null);
  const [Driverid, setDriverId] = useState(null);
  const [Planid, setPlaneId] = useState(null);
  const [TripNextId, setTripNextId] = useState(null);

  const IdPassVehicle = (Vehicleid) => {
    setVehicleId(Vehicleid);
  }

  const IdPassDriver = (Driverid) => {
    setDriverId(Driverid);
  }

  const IdPassPlan = (Planid) => {
    setPlaneId(Planid);
  }
  
  const NextIdPassTrip = (TripNextId) => {
    setTripNextId(TripNextId);
  }
  
  return (
    <div className="App">
      <h1 className='Pm'>Project management</h1>

      <div className="container">
        <div className="left-panel">
          <VehiclesManagement VehicleIdPass={IdPassVehicle} />
        </div>
        <div className="middle-panel">
          <DriversManagement DriverIdPass={IdPassDriver}/>
        </div>
        <div className="right-panel">
          <PlansManagement PlanIdPass={IdPassPlan} TripNextIdPass={NextIdPassTrip}/>
        </div>
        <div className="most-right-panel">
          <Actions Vehicleid={Vehicleid} Driverid={Driverid} Planid={Planid} TripNextId={TripNextId}/>
        </div>
      </div>

    </div>
  );
}

export default App;