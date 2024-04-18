import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { collection, getDoc, addDoc, doc, updateDoc, deleteDoc, getDocs } from "firebase/firestore"; 
import { firebase } from '../firebase'

function Actions({ Vehicleid, Planid }) {
  const [showAddTrip, setShowAddTrip] = useState(false);
  const [showEditTrip, setshowEditTrip] = useState(false);
  const [confirmClicked, setConfirmClicked] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [text, setText] = useState('Maintenance vehicle?');
  const [message, setMessage] = useState('');
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
  
  const showPopup = (notify) => {
    setMessage(notify);
    setShowNotification(true);

    // Hide the notification after a certain time (e.g., 3 seconds)
    setTimeout(() => {
      setShowNotification(false);
      setMessage('');
    }, 2000); // 3000 milliseconds = 3 seconds
  };

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
  
  const handleAddTrip = async () => {
    setConfirmClicked(true);
    for (const key in newTrip) {
      if (key === 'driver' || key === 'driverId' || key === 'vehicle' || key === 'vehicleId') continue;
      if (Vehicleid === null || (newTrip.hasOwnProperty(key) && (newTrip[key] === null || newTrip[key].trim() === ''))) {
        showPopup('Please fill in all required information');
        return;
      }
    }

    newTrip.vehicle = vehicle.name;
    newTrip.vehicleId = Vehicleid;
    //ADD TO DATA BASE
    try {
      await addDoc(collection(firebase, 'plans'), newTrip );
      showPopup('Trip added successfully!');
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
    } catch (error) {
        console.error('Error adding trip:', error);
        setConfirmClicked(false);
    }
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

  const ReturnVehicleValue = () => {
    if (Vehicleid === null || vehicle === null) return'';
    getDoc(doc(firebase, "vehicles", Vehicleid))
      .then((snapshot) => {
        setVehicle(snapshot.data());
    })
    .catch((error) => {
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
    getDoc(doc(firebase, "plans", Planid))
      .then((snapshot) => {
        setTrip(snapshot.data());
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
  
  const UpdateInformation = async () => {
    if (Planid === null) return;
    setConfirmClicked(true);
    for (const key in trip) {
      if (key === 'driver' || key === 'driverId') continue;
      if (trip.hasOwnProperty(key) && (trip[key] === null || trip[key].trim() === '')) {
        showPopup('Please fill in all required information');
        return;
      }
    }
    
    if (Vehicleid !== null) {
      trip.vehicle = vehicle.name;
      trip.vehicleId = Vehicleid;
    }
    //ADD TO DATA BASE
    try {
      const docRef = doc(firebase, 'plans', Planid);
      await updateDoc(docRef, trip);
      showPopup('Plan updated successfully!');
      setVehicle({});
      setConfirmClicked(false);
      setTrip({});
    } catch (error) {
      console.error('Error updating document:', error);
      setConfirmClicked(false);
    }
  };

  //MAINTENANCE BUTTON
  const MaintenanceVehicle = () => {
    if (Vehicleid === null) return text;
    getDoc(doc(firebase, "vehicles", Vehicleid))
      .then((snapshot) => {
        setVehicle(snapshot.data());
        if (snapshot.data().status === 'Maintenance') {
          setText("Done maintenance?");
        }else if (snapshot.data().status === 'Inactive') {
          setText('Maintenance vehicle?');
        }
    }).catch((error) => {
      console.error(error);
    });
    return text;
  };

  const configVehicleStatus = () => {
    if (Vehicleid === null) return;
    const docRef = doc(firebase, 'vehicles', Vehicleid);
    if (vehicle.status === 'Working') {
      showPopup("Vehicle still working!");
    }else if (vehicle.status === 'Maintenance') {
      vehicle.status = 'Inactive';
    }else if (vehicle.status === 'Inactive') {
      vehicle.status = 'Maintenance';
    }
    
    updateDoc(docRef, vehicle)
      .then(() => {
        showPopup('Updated vehicle\'s status successfully!');
        setVehicle({});
      })
      .catch((error) => {
        console.error('Error updating database:', error);
        setVehicle({});
      });
  };

  //DELETE PLAN BUTTON
  const deletePlan = async () => {
    if (Planid === null) return;
    
    const tripSnapshot = await getDoc(doc(firebase, "plans", Planid));
    const tripData = tripSnapshot.data();
    if (tripData.status === 'In progress') {
      showPopup('Can\'t delete because plan is in progress');
      return;
    }
    const docRef = doc(firebase, 'plans', Planid);
    deleteDoc(docRef)
      .then(() => {
        showPopup('Deleted plan successfully!');
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

  const startTrip = async () => {
    if (Planid === null) return;
    
    const tripSnapshot = await getDoc(doc(firebase, "plans", Planid));
    const tripData = tripSnapshot.data();
    
    if (!tripData || hasNullValue(tripData)) return;
    
    const vehicleSnapshot = await getDoc(doc(firebase, "vehicles", tripData.vehicleId));
    const vehicleData = vehicleSnapshot.data();
    
    const driverSnapshot = await getDoc(doc(firebase, "drivers", tripData.driverId));
    const driverData = driverSnapshot.data();
    
    if (tripData.status === 'Scheduled' && driverData.status === "Ready" && vehicleData.status === "Inactive") {
        tripData.status = 'In progress';
    } else {
        showPopup("Don't have enough information or Driver/Vehicle in process");
        return;
    }

    vehicleData.status = "Working";
    driverData.status = "Not ready";
    
    await updateDoc(doc(firebase, 'vehicles', tripData.vehicleId), vehicleData);
    await updateDoc(doc(firebase, 'drivers', tripData.driverId), driverData);
    await updateDoc(doc(firebase, 'plans', Planid), tripData);
    showPopup('Trip started!');

    setTrip({});
    setVehicle({});
  };

  const endTrip = async () => {
    if (Planid === null) return;

    const tripSnapshot = await getDoc(doc(firebase, "plans", Planid));
    const tripData = tripSnapshot.data();

    if (!tripData) return;

    const vehicleSnapshot = await getDoc(doc(firebase, "vehicles", tripData.vehicleId));
    const vehicleData = vehicleSnapshot.data();

    const driverSnapshot = await getDoc(doc(firebase, "drivers", tripData.driverId));
    const driverData = driverSnapshot.data();

    if (tripData.status === 'In progress') {
        tripData.status = 'Completed';
    } else {
        setTrip({});
        return;
    }

    vehicleData.status = "Inactive";
    driverData.status = "Ready";

    await updateDoc(doc(firebase, 'vehicles', tripData.vehicleId), vehicleData);
    await updateDoc(doc(firebase, 'drivers', tripData.driverId), driverData);
    await updateDoc(doc(firebase, 'plans', Planid), tripData);
    showPopup('Trip end!');

    setTrip({});
    setVehicle({});
  };

  //CHOOSE DRIVER BUTTON
  const chooseDirver = async () => {
    if (Planid === null) return;

    const tripSnapshot = await getDoc(doc(firebase, "plans", Planid));
    const tripData = tripSnapshot.data();

    if (!tripData) return;

    const querySnapshot = await getDocs(collection(firebase, 'drivers'));
    const todoData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
    
    const temp = [];
    if (todoData && todoData.length > 0) {
      for (let i = 0; i < todoData.length; ++i) {
        let data = todoData[i];
        if (data.status === 'Ready') {
          temp.push(data);
        }
      }
    }
    temp.sort((a, b) => {
      if (a.licenseType < b.licenseType) return -1; // 'A' trước 'B' và 'C'
      if (a.licenseType > b.licenseType) return 1; // 'B' và 'C' sau 'A'
      return 0;
    });

    setListDriver(temp);
    
    let flag = false, index = 0;
    if ((tripData.vehicle === 'Motorcycle' ||
        tripData.vehicle === 'Sports Car' ||
        tripData.vehicle === 'Car' ||
        tripData.vehicle === 'Electric Car') && listDriver && listDriver.length > 0 ) {
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
    if ((tripData.vehicle === 'Minivan' ||
        tripData.vehicle === 'SUV' ||
        tripData.vehicle === 'Van' ||
        tripData.vehicle === 'Compact Car') && listDriver && listDriver.length > 0 ) {
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
    if ((tripData.vehicle === 'Truck' ||
        tripData.vehicle === 'Bus' ||
        tripData.vehicle === 'Tractor' ||
        tripData.vehicle === 'Pickup Truck') && listDriver && listDriver.length > 0 ) {
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
      showPopup("There are no suitable drivers!");
      return;
    }
    
    tripData.driver = listDriver[index].name;
    tripData.driverId = listDriver[index].id;
    tripData.status = 'Scheduled';
    
    try {
      await updateDoc(doc(firebase, 'plans', Planid), tripData);
      showPopup('Choose driver successfully!');
    } catch (error) {
      console.error('Error updating trip data:', error);
    }

    setTrip({});
    setListDriver([]);
  ;}
  

  
  return (
    <div className='actionContainer'>
      <h2 className='Actions'>Actions</h2>

      <div className='buttons' style={{ display: 'flex', flexWrap: 'wrap' }}>
        <Button variant="contained" style={{ flex: '0 0 100%', marginBottom: '10px', backgroundColor: '#01834D', color: 'white' }} onClick={toggleAddTrip}>Create new plan</Button>
        <Button variant="contained" style={{ flex: '0 0 100%', marginBottom: '10px', backgroundColor: '#0C4183', color: 'white' }} onClick={toggleEditTrip}>Edit plan</Button>
        <Button variant="contained" style={{ flex: '0 0 100%', marginBottom: '10px', backgroundColor: '#721E1D', color: 'white' }} onClick={() => deletePlan()}>Delete plan</Button>
        <Button variant="contained" style={{ flex: '0 0 100%', marginBottom: '10px', backgroundColor: '#6D3E18', color: 'white' }} onClick={() => chooseDirver()}>Choose driver</Button>
        <Button variant="contained" style={{ flex: '0 0 100%', marginBottom: '10px', backgroundColor: '#1E7381', color: 'white' }} onClick={() => startTrip()}>Start trip</Button>
        <Button variant="contained" style={{ flex: '0 0 100%', marginBottom: '10px', backgroundColor: '#533C3C', color: 'white' }} onClick={() => endTrip()}>End trip</Button>
        <Button variant="contained" style={{ flex: '0 0 100%', marginBottom: '10px', backgroundColor: '#505F73', color: 'white' }} onClick={() => configVehicleStatus()}>{MaintenanceVehicle()}</Button>
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
            value={Vehicleid === null ? '' : ReturnVehicleValue()}
            placeholder="Select vehicle in vehicle list"
            className={confirmClicked  && Vehicleid === null ? 'empty-input-field' : 'input-field'}
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
            value={Vehicleid === null ? trip.vehicle : ReturnVehicleValue()}
            placeholder="Vehicle"
            className={'input-field'}
          />
        </div>
        <button 
          className="add-trip-button" onClick={() => UpdateInformation()}>Update Information</button>
      </div>)}
      <div className="notification-container">        
        {showNotification && (
          <div className="notification">
            <p>{"🔔 " + message}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Actions;