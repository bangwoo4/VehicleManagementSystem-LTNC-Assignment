import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { ref, child, get, update, remove, set } from "firebase/database";
import { database } from '../firebase'

function Actions({ Vehicleid, Planid, TripNextId }) {
  const [showAddTrip, setShowAddTrip] = useState(false);
  const [showEditTrip, setshowEditTrip] = useState(false);
  const [confirmClicked, setConfirmClicked] = useState(false);
  const [text, setText] = useState('Maintenance vehicle?');
  const [vehicle, setVehicle] = useState({});
  const [trip, setTrip] = useState({});
  const [listDriver, setListDriver] = useState([]);
  const [newTrip, setNewTrip] = useState({
    route: '',
    estimatedTime: '',
    estimatedCost: '',
    departureTime: '',
    status: 'Pending',
    driver: '',
    driverId: '',
    vehicle: '',
    vehicleId: '',
  });
  const dbRef = ref(database);

  //CREATE NEW PLAN BUTTON
  const toggleAddTrip = () => {
    setShowAddTrip(!showAddTrip);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'estimatedCost' && value && !value.startsWith('$')) {
      setNewTrip((prevTrip) => ({
        ...prevTrip,
        [name]: `$${value}`,
      }));
    }else {
      setNewTrip((prevTrip) => ({
        ...prevTrip,
        [name]: value,
      }));
    }
  };
  
  const handleAddTrip = () => {
    setConfirmClicked(true);
    for (const key in newTrip) {
      if (key === 'driver' || key === 'driverId' || key === 'vehicle' || key === 'vehicleId') continue;
      if (Vehicleid === null || (newTrip.hasOwnProperty(key) && (newTrip[key] === null || newTrip[key].trim() === ''))) {
        alert('Please fill in all required information');
        return;
      }
    }

    newTrip.vehicle = vehicle.name;
    newTrip.vehicleId = vehicle.id;
    //ADD TO DATA BASE
    const path = ref(database, `/plans/${parseInt(TripNextId) + 1}`)
    set(path, newTrip)
      .then(() => {
          console.log('Data added successfully!');
          setNewTrip({
              route: '',
              estimatedTime: '',
              estimatedCost: '',
              departureTime: '',
              status: 'Pending',
              driver: '',
              driverId: '',
              vehicle: '',
              vehicleId: ''
          });
          setVehicle({});
          setConfirmClicked(false);
      })
      .catch((error) => {
          console.error('Error adding data:', error);
          setConfirmClicked(false);
      });
  };

  const renderEstimatedTimeOptions = () => {
    const hours = [];
    for (let i = 1; i <= 12; i++) {
      hours.push(
        <option key={i} value={`${i} hours`}>
          Estimated Time: {i} hour{i > 1 ? "s" : ""}
        </option>
      );
    }
    return hours;
  };

  const ReturnVehicleValue = (Vehicleid) => {
    if (Vehicleid === null || vehicle === null) return'';
    get(child(dbRef, `/vehicles/${Vehicleid}`)).then((snapshot) => {
      if (snapshot.exists()) {
        let keyname = snapshot.key;
        let data = snapshot.val();
        data.id = keyname;
        setVehicle(data);
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
    return vehicle.name;
  };

  //EDIT PLAN BUTTON
  const toggleEditTrip = () => {
    setConfirmClicked(false);
    if (Planid === null) {
      setshowEditTrip(false);
      return;
    }
    setshowEditTrip(!showEditTrip);
    get(child(dbRef, `/plans/${Planid}`)).then((snapshot) => {
      if (snapshot.exists()) {
        setTrip(snapshot.val());
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
  };

  const handleUpdateInfo = (event) => {
    const { name, value } = event.target;
    setTrip((prevTrip) => ({
      ...prevTrip,
      [name]: value,
    }));
  };
  
  const UpdateInformation = (IdOfPlan) => {
    if (IdOfPlan === null) return;
    setConfirmClicked(true);
    for (const key in trip) {
      if (key === 'driver' || key === 'driverId') continue;
      if (trip.hasOwnProperty(key) && (trip[key] === null || trip[key].trim() === '')) {
        alert('Please fill in all required information');
        return;
      }
    }
    
    if (Vehicleid !== null) {
      trip.vehicle = vehicle.name;
      trip.vehicleId = vehicle.id;
    }
    //ADD TO DATA BASE
    const path = ref(database, `/plans/${IdOfPlan}`)
    update(path, trip)
      .then(() => {
          console.log('Database updated successfully');
          setVehicle({});
          setConfirmClicked(false);
          setTrip({});
      })
      .catch((error) => {
          console.error('Error updating database:', error);
          setConfirmClicked(false);
      });
  };

  //MAINTENANCE BUTTON
  const MaintenanceVehicle = (Vehicleid) => {
    if (Vehicleid === null) return text;
    get(child(dbRef, `/vehicles/${Vehicleid}`)).then((snapshot) => {
      if (snapshot.exists()) {
        setVehicle(snapshot.val());
        if (snapshot.val().status === 'Maintenance') {
          setText("Done maintenance?");
        }else if (snapshot.val().status === 'Inactive') {
          setText('Maintenance vehicle?');
        }
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
    return text;
  };

  const configVehicleStatus = (Vehicleid) => {
    if (Vehicleid === null) return;
    const path = ref(database, `/vehicles/${Vehicleid}`)
    if (vehicle.status === 'Working') {
      alert("Vehicle still working!");
    }else if (vehicle.status === 'Maintenance') {
      vehicle.status = 'Inactive';
    }else if (vehicle.status === 'Inactive') {
      vehicle.status = 'Maintenance';
    }
    update(path, vehicle)
      .then(() => {
        console.log('Database updated successfully');
      })
      .catch((error) => {
        console.error('Error updating database:', error);
      });
    
    setVehicle({});
  };

  //DELETE PLAN BUTTON
  const deletePlan = async (IdOfPlan) => {
    if (IdOfPlan === null) return;
    
    const tripSnapshot = await get(child(dbRef, `/plans/${IdOfPlan}`));
    const tripData = tripSnapshot.val();
    if (tripData.status === 'In progress') {
      alert('Can\'delete because plan is in progress');
      return;
    }
    
    const path = ref(database, `/plans/${IdOfPlan}`);
    remove(path)
      .then(() => {
        console.log('Data deleted successfully');
      })
      .catch((error) => {
        console.error('Error deleting data:', error);
      });
  };

  //START -- END TRIP BUTTON
  const hasNullValue = () => {
    for (let key in trip) {
      if (trip.hasOwnProperty(key) && trip[key] === "") {
        return true; // Found a null value
      }
    }
    return false; // No null values found
  };

  const startTrip = async (IdOfPlan) => {
    if (IdOfPlan === null) return;
    
    const tripSnapshot = await get(child(dbRef, `/plans/${IdOfPlan}`));
    const tripData = tripSnapshot.val();
    
    if (!tripData || hasNullValue(tripData)) return;
    
    const vehicleSnapshot = await get(child(dbRef, `/vehicles/${tripData.vehicleId}`));
    const vehicleData = vehicleSnapshot.val();
    
    const driverSnapshot = await get(child(dbRef, `/drivers/${tripData.driverId}`));
    const driverData = driverSnapshot.val();
    
    if (tripData.status === 'Scheduled' && driverData.status === "Ready" && vehicleData.status === "Inactive") {
        tripData.status = 'In progress';
    } else {
        alert("Don't have enough information or Driver/Vehicle in process");
        return;
    }

    const VehiclePath = ref(database, `/vehicles/${tripData.vehicleId}`);
    const DriverPath = ref(database, `/drivers/${tripData.driverId}`);
    vehicleData.status = "Working";
    driverData.status = "Not ready";

    await update(VehiclePath, vehicleData);
    await update(DriverPath, driverData);
    await update(ref(database, `/plans/${IdOfPlan}`), tripData);

    setTrip({});
    setVehicle({});
  };

  const endTrip = async (IdOfPlan) => {
    if (IdOfPlan === null) return;

    const tripSnapshot = await get(child(dbRef, `/plans/${IdOfPlan}`));
    const tripData = tripSnapshot.val();

    if (!tripData) return;

    const vehicleSnapshot = await get(child(dbRef, `/vehicles/${tripData.vehicleId}`));
    const vehicleData = vehicleSnapshot.val();

    const driverSnapshot = await get(child(dbRef, `/drivers/${tripData.driverId}`));
    const driverData = driverSnapshot.val();

    if (tripData.status === 'In progress') {
        tripData.status = 'Completed';
    } else {
        setTrip({});
        return;
    }

    const VehiclePath = ref(database, `/vehicles/${tripData.vehicleId}`);
    const DriverPath = ref(database, `/drivers/${tripData.driverId}`);
    vehicleData.status = "Inactive";
    driverData.status = "Ready";

    await update(VehiclePath, vehicleData);
    await update(DriverPath, driverData);
    await update(ref(database, `/plans/${IdOfPlan}`), tripData);

    setTrip({});
    setVehicle({});
  };

  //CHOOSE DRIVER BUTTON
  const chooseDirver = async (IdOfPlan) => {
    if (IdOfPlan === null) return;

    const tripSnapshot = await get(child(dbRef, `/plans/${IdOfPlan}`));
    const tripData = tripSnapshot.val();

    if (!tripData) return;

    const driverSnapshot = await get(child(dbRef, `/drivers`));
    const drivers = driverSnapshot.val();

    const temp = [];
    for (let key in drivers) {
        let data = drivers[key];
        data.id = key;
        if (data.status === 'Ready') {
            temp.push(data);
        }
    }
    setListDriver(temp);

    let flag = false, index = 0;
    if (tripData.vehicle === 'Motorcycle' ||
        tripData.vehicle === 'Sports Car' ||
        tripData.vehicle === 'Car' ||
        tripData.vehicle === 'Electric Car') {
          for (index; index < listDriver.length; ++index) {
            if (listDriver[index].licenseType === 'A' && listDriver[index].drivingHistory === 'Clean') {
              flag = true;
              break;
            }else if (listDriver[index].licenseType === 'A') {
              flag = true;
              break;
            }else if (listDriver[index].licenseType === 'B' && listDriver[index].drivingHistory === 'Clean') {
              flag = true;
              break;
            }else if (listDriver[index].licenseType === 'B') {
              flag = true;
              break;
            }else if (listDriver[index].licenseType === 'C' && listDriver[index].drivingHistory === 'Clean') {
              flag = true;
              break;
            }else if (listDriver[index].licenseType === 'C') {
              flag = true;
              break;
            }
          }
    }else 
    if (tripData.vehicle === 'Minivan' ||
        tripData.vehicle === 'SUV' ||
        tripData.vehicle === 'Van' ||
        tripData.vehicle === 'Compact Car') {
          for (index; index < listDriver.length; ++index) {
            if (listDriver[index].licenseType === 'B' && listDriver[index].drivingHistory === 'Clean') {
              flag = true;
              break;
            }else if (listDriver[index].licenseType === 'B') {
              flag = true;
              break;
            }else if (listDriver[index].licenseType === 'C' && listDriver[index].drivingHistory === 'Clean') {
              flag = true;
              break;
            }else if (listDriver[index].licenseType === 'C') {
              flag = true;
              break;
            }
          }
    }else 
    if (tripData.vehicle === 'Truck' ||
        tripData.vehicle === 'Bus' ||
        tripData.vehicle === 'Tractor' ||
        tripData.vehicle === 'Pickup Truck') {
          for (index; index < listDriver.length; ++index) {
            if (listDriver[index].licenseType === 'C' && listDriver[index].drivingHistory === 'Clean') {
              flag = true;
              break;
            }else if (listDriver[index].licenseType === 'C') {
              flag = true;
              break;
            }
          }
    }

    if (!flag) {
        alert("There are no suitable drivers");
        return;
    }

    tripData.driver = listDriver[index].name;
    tripData.driverId = listDriver[index].id;
    tripData.status = 'Scheduled';

    await update(ref(database, `/plans/${IdOfPlan}`), tripData);

    setTrip({});
    setListDriver([]);
  ;}
  

  
  return (
    <div className='actionContainer'>
      <h2 className='Actions'>Actions</h2>

      <div className='buttons' style={{ display: 'flex', flexWrap: 'wrap' }}>
        <Button variant="contained" style={{ flex: '0 0 100%', marginBottom: '10px', backgroundColor: '#01834D', color: 'white' }} onClick={toggleAddTrip}>Create new plan</Button>
        <Button variant="contained" style={{ flex: '0 0 100%', marginBottom: '10px', backgroundColor: '#0C4183', color: 'white' }} onClick={toggleEditTrip}>Edit plan</Button>
        <Button variant="contained" style={{ flex: '0 0 100%', marginBottom: '10px', backgroundColor: '#721E1D', color: 'white' }} onClick={() => deletePlan(Planid)}>Delete plan</Button>
        <Button variant="contained" style={{ flex: '0 0 100%', marginBottom: '10px', backgroundColor: '#6D3E18', color: 'white' }} onClick={() => chooseDirver(Planid)}>Choose driver</Button>
        <Button variant="contained" style={{ flex: '0 0 100%', marginBottom: '10px', backgroundColor: '#1E7381', color: 'white' }} onClick={() => startTrip(Planid)}>Start trip</Button>
        <Button variant="contained" style={{ flex: '0 0 100%', marginBottom: '10px', backgroundColor: '#533C3C', color: 'white' }} onClick={() => endTrip(Planid)}>End trip</Button>
        <Button variant="contained" style={{ flex: '0 0 100%', marginBottom: '10px', backgroundColor: '#505F73', color: 'white' }} onClick={() => configVehicleStatus(Vehicleid)}>{MaintenanceVehicle(Vehicleid)}</Button>
      </div>

      
      {showAddTrip && 
      (<div className="AddTripBlock">
        <h2 className="AddTripText">Add Trip</h2>
        <div className="input-group">
          <input
            type="text"
            name="route"
            value={newTrip.route}
            placeholder="Route"
            onChange={handleInputChange}
            className={confirmClicked  && newTrip.route.trim() === '' ? 'empty-input-field' : 'input-field'}
          />
          <select
            name="estimatedTime"
            value={newTrip.estimatedTime}
            onChange={handleInputChange}
            className={confirmClicked  && newTrip.estimatedTime.trim() === '' ? 'empty-input-field' : 'input-field'}
          >
            <option value="">Estimated Time</option>
            {renderEstimatedTimeOptions()}
          </select>
          <input
            type="text"
            name="estimatedCost"
            value={newTrip.estimatedCost}
            placeholder="Estimated Cost"
            onChange={handleInputChange}
            className={confirmClicked  && newTrip.estimatedCost.trim() === '' ? 'empty-input-field' : 'input-field'}
          />
          <input
            type="time"
            name="departureTime"
            defaultValue={newTrip.departureTime}
            placeholder="Departure Time"
            onChange={handleInputChange}
            className={confirmClicked  && newTrip.departureTime.trim() === '' ? 'empty-input-field' : 'input-field'}
          />
          <input
            type="text"
            name="vehicle"
            value={ReturnVehicleValue(Vehicleid)}
            placeholder="Select vehicle in vehicle list"
            className={confirmClicked  && Vehicleid === null   ? 'empty-input-field' : 'input-field'}
          />
        </div>
        <button 
          className="add-trip-button" onClick={handleAddTrip}>Add Trip</button>
      </div>)}

      {showEditTrip && 
      (<div className="AddTripBlock">
        <h2 className="AddTripText">Edit Plan</h2>
        <div className="input-group">
          <input
            type="text"
            name="route"
            value={trip.route}
            placeholder="Route"
            onChange={handleUpdateInfo}
            className={confirmClicked  && trip.route.trim() === '' ? 'empty-input-field' : 'input-field'}
          />
          <select
            name="estimatedTime"
            value={trip.estimatedTime}
            onChange={handleUpdateInfo}
            className={confirmClicked  && trip.estimatedTime.trim() === '' ? 'empty-input-field' : 'input-field'}
          >
            <option value="">Estimated Time</option>
            {renderEstimatedTimeOptions()}
          </select>
          <input
            type="text"
            name="estimatedCost"
            value={trip.estimatedCost}
            placeholder="Estimated Cost"
            onChange={handleUpdateInfo}
            className={confirmClicked  && trip.estimatedCost.trim() === '' ? 'empty-input-field' : 'input-field'}
          />
          <input
            type="time"
            name="departureTime"
            defaultValue={trip.departureTime}
            placeholder="Departure Time"
            onChange={handleUpdateInfo}
            className={confirmClicked  && trip.departureTime.trim() === '' ? 'empty-input-field' : 'input-field'}
          />
          <input
            type="text"
            name="vehicle"
            value={Vehicleid === null ? trip.vehicle : ReturnVehicleValue(Vehicleid)}
            placeholder="Vehicle"
            className={'input-field'}
          />
        </div>
        <button 
          className="add-trip-button" onClick={() => UpdateInformation(Planid)}>Update Information</button>
      </div>)}
    </div>
  );
}

export default Actions;