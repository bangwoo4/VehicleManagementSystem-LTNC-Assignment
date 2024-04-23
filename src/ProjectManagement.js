import React, { useState } from "react";
import VehiclesManagement from "./components/VehiclesManagement";
import DriversManagement from "./components/DriversManagement";
import PlansManagement from "./components/PlansManagement";
import Actions from "./components/Actions";
import Header from "./components/Header";
import Footer from "./components/Footer";

function Project() {
  const [Vehicleid, setVehicleId] = useState(null);
  const [Planid, setPlaneId] = useState(null);
  const [tripLength, setTripLength] = useState(null);
  const [fetchDrivers, setFetchDrivers] = useState(true);
  const [fetchVehicles, setFetchVehicles] = useState(true);
  const [fetchPlans, setFetchPlans] = useState(true);

  return (
    <div className="App">
      <Header />
      <div className="container">
        <div className="left-panel">
          <VehiclesManagement
            setVehicleId={setVehicleId}
            fetchVehicles={fetchVehicles}
            setFetchVehicles={setFetchVehicles}
          />
        </div>
        <div className="middle-panel">
          <DriversManagement
            fetchDrivers={fetchDrivers}
            setFetchDrivers={setFetchDrivers}
          />
        </div>
        <div className="right-panel">
          <PlansManagement
            setPlaneId={setPlaneId}
            setTripLength={setTripLength}
            fetchPlans={fetchPlans}
            setFetchPlans={setFetchPlans}
          />
        </div>
        <div className="most-right-panel">
          <Actions
            Vehicleid={Vehicleid}
            Planid={Planid}
            tripLength={tripLength}
            setPlaneId={setPlaneId}
            setFetchVehicles={setFetchVehicles}
            setFetchDrivers={setFetchDrivers}
            setFetchPlans={setFetchPlans}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Project;
