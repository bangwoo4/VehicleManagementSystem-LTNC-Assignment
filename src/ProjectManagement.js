import React, { useState }from 'react';
import VehiclesManagement from './components/VehiclesManagement';
import DriversManagement from './components/DriversManagement';
import PlansManagement from './components/PlansManagement';
import Actions from './components/Actions';

function Project() {
  const [Vehicleid, setVehicleId] = useState(null);
  const [Planid, setPlaneId] = useState(null);

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
          <VehiclesManagement VehicleIdPass={IdPassVehicle} />
        </div>
        <div className="middle-panel">
          <DriversManagement/>
        </div>
        <div className="right-panel">
          <PlansManagement PlanIdPass={IdPassPlan}/>
        </div>
        <div className="most-right-panel">
          <Actions Vehicleid={Vehicleid} Planid={Planid}/>
        </div>
      </div>
    </div>
  );
}

export default Project;