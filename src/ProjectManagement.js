import React, { useState }from 'react';
import VehiclesManagement from './components/VehiclesManagement';
import DriversManagement from './components/DriversManagement';
import PlansManagement from './components/PlansManagement';
import Actions from './components/Actions';

function Project() {
  const [Vehicleid, setVehicleId] = useState(null);
  const [Planid, setPlaneId] = useState(null);
  const [fetchDrivers, setFetchDrivers] = useState(true)
  const [fetchVehicles, setFetchVehicles] = useState(true)
  const [fetchPlans, setFetchPlans] = useState(true)

  const IdPassVehicle = (Vehicleid) => {
    setVehicleId(Vehicleid);
  }

  const IdPassPlan = (Planid) => {
    setPlaneId(Planid);
  }
  
  return (
    <div className="App">
      <h1 className='Pm'>Project management</h1>

      <div className="container">
        <div className="left-panel">
          <VehiclesManagement VehicleIdPass={IdPassVehicle} fetchVehicles={fetchVehicles} setFetchVehicles={setFetchVehicles} />
        </div>
        <div className="middle-panel">
          <DriversManagement fetchDrivers={fetchDrivers} setFetchDrivers={setFetchDrivers}/>
        </div>
        <div className="right-panel">
          <PlansManagement PlanIdPass={IdPassPlan} fetchPlans={fetchPlans} setFetchPlans={setFetchPlans} />
        </div>
        <div className="most-right-panel">
          <Actions Vehicleid={Vehicleid} Planid={Planid} setPlaneId={setPlaneId} setFetchVehicles={setFetchVehicles} setFetchDrivers={setFetchDrivers} setFetchPlans={setFetchPlans}/>
        </div>
      </div>
    </div>
  );
}

export default Project;