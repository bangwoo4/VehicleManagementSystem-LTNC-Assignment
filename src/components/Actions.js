import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import {
  collection,
  getDoc,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  getDocs,
  where,
  query,
} from "firebase/firestore";
import { firebase } from "../firebase";

function Actions({
  Vehicleid,
  Planid,
  setPlaneId,
  tripLength,
  setFetchVehicles,
  setFetchDrivers,
  setFetchPlans,
}) {
  const [showAddTrip, setShowAddTrip] = useState(false);
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [showAddDriver, setShowAddDriver] = useState(false);
  const [showEditTrip, setshowEditTrip] = useState(false);
  const [confirmClicked, setConfirmClicked] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [text, setText] = useState("Maintenance vehicle?");
  const [message, setMessage] = useState("");
  const [vehicle, setVehicle] = useState({});
  const [trip, setTrip] = useState({});
  const [newTrip, setNewTrip] = useState({
    route: "",
    estimatedTime: "",
    estimatedCost: "",
    departureTime: "",
    status: "Pending",
    driver: "",
    driverId: "",
    vehicle: "",
    vehicleId: "",
  });
  const [newVehicle, setNewVehicle] = useState({
    name: "",
    size: "",
    payload: "",
    fuel: "",
    status: "Inactive",
    licensePlate: "",
    image: "",
  });
  const [newDriver, setNewDriver] = useState({
    name: "",
    age: "",
    licenseType: "",
    address: "",
    phone: "",
    status: "Ready",
    image: "",
  });

  const showPopup = (notify) => {
    setMessage(notify);
    setShowNotification(true);

    // Hide the notification after a certain time (e.g., 3 seconds)
    setTimeout(() => {
      setShowNotification(false);
      setMessage("");
    }, 2000); // 3000 milliseconds = 3 seconds
  };

  //CREATE NEW PLAN BUTTON
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "estimatedCost" && value && !value.startsWith("$")) {
      setNewTrip((prevTrip) => ({
        ...prevTrip,
        [name]: `$${value}`,
      }));
    } else {
      setNewTrip((prevTrip) => ({
        ...prevTrip,
        [name]: value,
      }));
    }
  };

  const handleAddTrip = async () => {
    setConfirmClicked(true);
    for (const key in newTrip) {
      if (
        key === "driver" ||
        key === "driverId" ||
        key === "vehicle" ||
        key === "vehicleId"
      )
        continue;
      if (
        Vehicleid === null ||
        (newTrip.hasOwnProperty(key) &&
          (newTrip[key] === null || newTrip[key].trim() === ""))
      ) {
        showPopup("Please fill in all required information");
        return;
      }
    }

    newTrip.STT = tripLength + 1;
    newTrip.vehicle = vehicle.name;
    newTrip.vehicleId = Vehicleid;
    //ADD TO DATA BASE
    try {
      await addDoc(collection(firebase, "plans"), newTrip);
      showPopup("Trip added successfully!");
      setNewTrip({
        route: "",
        estimatedTime: "",
        estimatedCost: "",
        departureTime: "",
        status: "Pending",
        driver: "",
        driverId: "",
        vehicle: "",
        vehicleId: "",
      });
      setFetchPlans(true);
      setVehicle({});
      setConfirmClicked(false);
    } catch (error) {
      console.error("Error adding trip:", error);
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

  //EDIT PLAN BUTTON
  const toggleEditTrip = () => {
    setConfirmClicked(false);
    if (Planid === null) {
      setshowEditTrip(false);
      return;
    }
    setshowEditTrip(!showEditTrip);
  };

  useEffect(() => {
    if (Planid === null || !showEditTrip) {
      setshowEditTrip(false);
      return;
    }
    const getTrip = () => {
      getDoc(doc(firebase, "plans", Planid))
        .then((snapshot) => {
          setTrip(snapshot.data());
        })
        .catch((error) => {
          console.error(error);
        });
    };
    getTrip();
  }, [Planid, showEditTrip]);

  const handleUpdateInfo = (event) => {
    const { name, value } = event.target;
    setTrip((prevTrip) => ({
      ...prevTrip,
      [name]: value,
    }));
  };

  const UpdateInformation = async () => {
    if (Planid === null) return;

    if (trip.status === "In progress") {
      showPopup("Trip is in progress, can't edit!");
      return;
    } else if (trip.status === "Completed") {
      showPopup("Trip have completed, can't edit!");
      return;
    }

    setConfirmClicked(true);
    for (const key in trip) {
      if (key === "driver" || key === "driverId" || key === "STT") continue;
      if (
        trip.hasOwnProperty(key) &&
        (trip[key] === null || trip[key].trim() === "")
      ) {
        showPopup("Please fill in all required information");
        return;
      }
    }

    if (Vehicleid !== null) {
      trip.vehicle = vehicle.name;
      trip.vehicleId = Vehicleid;
    }

    //UPDATED TO DATA BASE
    try {
      const docRef = doc(firebase, "plans", Planid);
      await updateDoc(docRef, trip);
      showPopup("Plan updated successfully!");
      setFetchPlans(true);
      setVehicle({});
      setConfirmClicked(false);
      setTrip({});
    } catch (error) {
      console.error("Error updating document:", error);
      setConfirmClicked(false);
    }
  };

  //MAINTENANCE BUTTON
  useEffect(() => {
    if (Vehicleid === null) return;
    const MaintenanceVehicle = () => {
      getDoc(doc(firebase, "vehicles", Vehicleid))
        .then((snapshot) => {
          setVehicle(snapshot.data());
          if (snapshot.data().status === "Maintenance") {
            setText("Done maintenance?");
          } else if (snapshot.data().status === "Inactive") {
            setText("Maintenance vehicle?");
          }
        })
        .catch((error) => {
          console.error(error);
        });
    };
    MaintenanceVehicle();
  }, [Vehicleid]);

  const configVehicleStatus = () => {
    if (Vehicleid === null) return;
    const docRef = doc(firebase, "vehicles", Vehicleid);
    if (vehicle.status === "Working") {
      showPopup("Vehicle still working!");
      return;
    } else if (vehicle.status === "Maintenance") {
      vehicle.status = "Inactive";
    } else if (vehicle.status === "Inactive") {
      vehicle.status = "Maintenance";
    }

    updateDoc(docRef, vehicle)
      .then(() => {
        showPopup("Updated vehicle's status successfully!");
        setFetchVehicles(true);
        setVehicle({});
      })
      .catch((error) => {
        console.error("Error updating database:", error);
        setVehicle({});
      });
  };

  //DELETE PLAN BUTTON
  const deletePlan = async () => {
    if (Planid === null) return;

    const tripSnapshot = await getDoc(doc(firebase, "plans", Planid));
    const tripData = tripSnapshot.data();
    if (tripData.status === "In progress") {
      showPopup("Can't delete because plan is in progress");
      return;
    }
    const planRef = doc(firebase, "plans", Planid);
    deleteDoc(planRef)
      .then(() => {
        showPopup("Deleted plan successfully!");
        setFetchPlans(true);
        setPlaneId(null);
      })
      .catch((error) => {
        console.error("Error deleting data:", error);
      });
    if (tripData.status !== "Completed") return;
    const historySnapshot = await getDocs(
      query(
        collection(firebase, "drivers", tripData.driverId, "history"),
        where(
          "STT",
          "==",
          tripData.STT
        )
      )
    );
    const historyData = historySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    const historyRef = doc(firebase, "drivers", tripData.driverId, "history", historyData[0].id);
    deleteDoc(historyRef)
      .then(() => {
        console.log("Success!");
      })
      .catch((error) => {
        console.error("Error deleting data:", error);
      });
  };

  //START -- END TRIP BUTTON
  const startTrip = async () => {
    if (Planid === null) return;

    const tripSnapshot = await getDoc(doc(firebase, "plans", Planid));
    const tripData = tripSnapshot.data();

    if (!tripData) return;
    if (tripData.status === "Pending") {
      showPopup("Please choose driver to start!");
      return;
    } else if (tripData.status === "Completed") {
      showPopup("Trip have completed, can't start!");
      return;
    } else if (tripData.status === "In progress") {
      showPopup("Trip is in progess, can't start!");
      return;
    }

    const vehicleSnapshot = await getDoc(
      doc(firebase, "vehicles", tripData.vehicleId)
    );
    const vehicleData = vehicleSnapshot.data();

    const driverSnapshot = await getDoc(
      doc(firebase, "drivers", tripData.driverId)
    );
    const driverData = driverSnapshot.data();

    if (
      tripData.status === "Scheduled" &&
      driverData.status === "Ready" &&
      vehicleData.status === "Inactive"
    ) {
      tripData.status = "In progress";
    } else if (
      driverData.status === "Not ready" &&
      vehicleData.status === "Working"
    ) {
      showPopup("Driver and vehicle are in progress!");
      return;
    } else if (driverData.status === "Not ready") {
      showPopup("Driver is in progress!");
      return;
    } else if (vehicleData.status === "Working") {
      showPopup("Vehicle is in progress!");
      return;
    } else if (vehicleData.status === "Maintenance") {
      showPopup("Vehicle is maintaining!");
      return;
    }else {
      showPopup("Error!");
      return;
    }

    vehicleData.status = "Working";
    driverData.status = "Not ready";

    await updateDoc(doc(firebase, "vehicles", tripData.vehicleId), vehicleData);
    await updateDoc(doc(firebase, "drivers", tripData.driverId), driverData);
    await updateDoc(doc(firebase, "plans", Planid), tripData);
    showPopup("Trip started!");
    setFetchDrivers(true);
    setFetchVehicles(true);
    setFetchPlans(true);
  };

  const endTrip = async () => {
    if (Planid === null) return;

    const tripSnapshot = await getDoc(doc(firebase, "plans", Planid));
    const tripData = tripSnapshot.data();

    if (!tripData) return;
    if (tripData.status === "In progress") {
      tripData.status = "Completed";
    } else if (tripData.status === "Completed") {
      showPopup("Trip have completed!");
      return;
    } else {
      showPopup("Trip haven't started yet!");
      return;
    }

    const vehicleSnapshot = await getDoc(
      doc(firebase, "vehicles", tripData.vehicleId)
    );
    const vehicleData = vehicleSnapshot.data();

    const driverSnapshot = await getDoc(
      doc(firebase, "drivers", tripData.driverId)
    );
    const driverData = driverSnapshot.data();

    vehicleData.status = "Inactive";
    driverData.status = "Ready";
    

    await updateDoc(doc(firebase, "vehicles", tripData.vehicleId), vehicleData);
    await updateDoc(doc(firebase, "drivers", tripData.driverId), driverData);
    await addDoc(collection(firebase, "drivers", tripData.driverId, "history"), tripData);
    await updateDoc(doc(firebase, "plans", Planid), tripData);
    showPopup("Trip end!");
    setFetchDrivers(true);
    setFetchVehicles(true);
    setFetchPlans(true);
  };

  //CHOOSE DRIVER BUTTON
  const chooseDirver = async () => {
    if (Planid === null) return;

    const tripSnapshot = await getDoc(doc(firebase, "plans", Planid));
    const tripData = tripSnapshot.data();

    if (!tripData) return;

    const vehicelSnapshot = await getDoc(
      doc(firebase, "vehicles", tripData.vehicleId)
    );
    const vehicleData = vehicelSnapshot.data();

    const snapshot = await getDocs(
      query(
        collection(firebase, "drivers"),
        where(
          "licenseType",
          "==",
          vehicleData.payload < 500
            ? "A"
            : vehicleData.payload < 1000
            ? "B"
            : "C"
        )
      )
    );
    const temp = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const listDriver = [];
    if (temp && temp.length > 0) {
      for (let i = 0; i < temp.length; ++i) {
        let data = temp[i];
        if (data.status === "Ready") {
          listDriver.push(data);
        }
      }
    }

    if (listDriver.length === 0) {
      showPopup("There are no suitable drivers!");
      return;
    }

    tripData.driver = listDriver[0].name;
    tripData.driverId = listDriver[0].id;
    tripData.status = "Scheduled";

    try {
      await updateDoc(doc(firebase, "plans", Planid), tripData);
      showPopup("Choose driver successfully!");
      setFetchPlans(true);
    } catch (error) {
      console.error("Error updating trip data:", error);
    }
  };

  //ADD VEHICLE BUTTON
  const handleInputVehicle = (event) => {
    const { name, value } = event.target;
    setNewVehicle((prevVehicle) => ({
      ...prevVehicle,
      [name]: value,
    }));
  };

  const handleAddVehicle = async () => {
    setConfirmClicked(true);
    for (const key in newVehicle) {
      if (key === "image" || key === "size") continue;
      if (
        newVehicle.hasOwnProperty(key) &&
        (newVehicle[key] === null || newVehicle[key].trim() === "")
      ) {
        showPopup("Please fill in all required information");
        return;
      }
    }

    if (parseInt(newVehicle.payload) < 100) return;
    newVehicle.size = parseInt(newVehicle.payload) < 500 ? "Normal" : "Large";
    newVehicle.payload += "kg";
    //ADD TO DATA BASE
    try {
      await addDoc(collection(firebase, "vehicles"), newVehicle);
      showPopup("Vehicle added successfully!");
      setNewVehicle({
        name: "",
        size: "",
        payload: "",
        fuel: "",
        status: "Inactive",
        licensePlate: "",
        image: "",
      });
      setFetchVehicles(true);
      setConfirmClicked(false);
    } catch (error) {
      console.error("Error adding trip:", error);
      setConfirmClicked(false);
    }
  };

  //ADD DRIVER BUTTON
  const handleInputDriver = (event) => {
    const { name, value } = event.target;
    setNewDriver((prevVehicle) => ({
      ...prevVehicle,
      [name]: value,
    }));
  };

  const handleAddDriver = async () => {
    setConfirmClicked(true);
    for (const key in newDriver) {
      if (key === "image") continue;
      if (
        newDriver.hasOwnProperty(key) &&
        (newDriver[key] === null || newDriver[key].trim() === "")
      ) {
        showPopup("Please fill in all required information");
        return;
      }
    }

    if (
      newDriver.age <= 18 ||
      newDriver.age >= 75 ||
      newDriver.phone.length !== 10
    )
      return;
    newDriver.phone =
      newDriver.phone.slice(0, 3) +
      "-" +
      newDriver.phone.slice(3, 6) +
      "-" +
      newDriver.phone.slice(6);
    //ADD TO DATA BASE
    try {
      await addDoc(collection(firebase, "drivers"), newDriver);
      showPopup("Driver added successfully!");
      setNewDriver({
        name: "",
        age: "",
        licenseType: "",
        address: "",
        phone: "",
        status: "Ready",
        image: "",
      });
      setFetchDrivers(true);
      setConfirmClicked(false);
    } catch (error) {
      console.error("Error adding trip:", error);
      setConfirmClicked(false);
    }
  };

  return (
    <div className="actionContainer">
      <h2 className="Actions">Actions</h2>
      <div className="buttons" style={{ display: "flex", flexWrap: "wrap" }}>
        <Button
          variant="contained"
          style={{
            flex: "0 0 100%",
            marginBottom: "10px",
            backgroundColor: "#1E7381",
            color: "white",
          }}
          onClick={() => setShowAddTrip(!showAddTrip)}
        >
          Create new plan
        </Button>
        <Button
          variant="contained"
          style={{
            flex: "0 0 100%",
            marginBottom: "10px",
            backgroundColor: "#0C4183",
            color: "white",
          }}
          onClick={toggleEditTrip}
        >
          Edit plan
        </Button>
        <Button
          variant="contained"
          style={{
            flex: "0 0 100%",
            marginBottom: "10px",
            backgroundColor: "#01834D",
            color: "white",
          }}
          onClick={() => deletePlan()}
        >
          Delete plan
        </Button>
        <hr></hr>

        <Button
          variant="contained"
          style={{
            flex: "0 0 100%",
            marginBottom: "10px",
            backgroundColor: "#1E7381",
            color: "white",
          }}
          onClick={() => setShowAddDriver(!showAddDriver)}
        >
          Add Driver
        </Button>
        <Button
          variant="contained"
          style={{
            flex: "0 0 100%",
            marginBottom: "10px",
            backgroundColor: "#0C4183",
            color: "white",
          }}
          onClick={() => chooseDirver()}
        >
          Choose driver
        </Button>
        <hr></hr>
        <Button
          variant="contained"
          style={{
            flex: "0 0 100%",
            marginBottom: "10px",
            backgroundColor: "#01834D",
            color: "white",
          }}
          onClick={() => startTrip()}
        >
          Start trip
        </Button>
        <Button
          variant="contained"
          style={{
            flex: "0 0 100%",
            marginBottom: "10px",
            backgroundColor: "#1E7381",
            color: "white",
          }}
          onClick={() => endTrip()}
        >
          End trip
        </Button>
        <hr></hr>
        <Button
          variant="contained"
          style={{
            flex: "0 0 100%",
            marginBottom: "10px",
            backgroundColor: "#0C4183",
            color: "white",
          }}
          onClick={() => setShowAddVehicle(!showAddVehicle)}
        >
          Add Vehicle
        </Button>
        <Button
          variant="contained"
          style={{
            flex: "0 0 100%",
            marginBottom: "10px",
            backgroundColor: "#01834D",
            color: "white",
          }}
          onClick={() => configVehicleStatus()}
        >
          {text}
        </Button>
      </div>

      {showAddTrip && (
        <div className="AddTripBlock">
          <h2 className="AddTripText">Add Trip</h2>
          <div className="input-group">
            <input
              type="text"
              name="route"
              value={newTrip.route}
              placeholder="Route"
              onChange={handleInputChange}
              className={
                confirmClicked && newTrip.route.trim() === ""
                  ? "empty-input-field"
                  : "input-field"
              }
            />
            <select
              name="estimatedTime"
              value={newTrip.estimatedTime}
              onChange={handleInputChange}
              className={
                confirmClicked && newTrip.estimatedTime.trim() === ""
                  ? "empty-input-field"
                  : "input-field"
              }
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
              className={
                confirmClicked && newTrip.estimatedCost.trim() === ""
                  ? "empty-input-field"
                  : "input-field"
              }
            />
            <input
              type="time"
              name="departureTime"
              defaultValue={newTrip.departureTime}
              placeholder="Departure Time"
              onChange={handleInputChange}
              className={
                confirmClicked && newTrip.departureTime.trim() === ""
                  ? "empty-input-field"
                  : "input-field"
              }
            />
            <input
              type="text"
              name="vehicle"
              value={Vehicleid === null ? "" : vehicle.name}
              placeholder="Select vehicle in vehicle list"
              className={
                confirmClicked && Vehicleid === null
                  ? "empty-input-field"
                  : "input-field"
              }
            />
          </div>
          <button className="add-trip-button" onClick={handleAddTrip}>
            Add Trip
          </button>
        </div>
      )}

      {showEditTrip && (
        <div className="AddTripBlock">
          <h2 className="AddTripText">Edit Plan</h2>
          <div className="input-group">
            <input
              type="text"
              name="route"
              value={trip.route}
              placeholder="Route"
              onChange={handleUpdateInfo}
              className={
                confirmClicked && trip.route.trim() === ""
                  ? "empty-input-field"
                  : "input-field"
              }
            />
            <select
              name="estimatedTime"
              value={trip.estimatedTime}
              onChange={handleUpdateInfo}
              className={
                confirmClicked && trip.estimatedTime.trim() === ""
                  ? "empty-input-field"
                  : "input-field"
              }
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
              className={
                confirmClicked && trip.estimatedCost.trim() === ""
                  ? "empty-input-field"
                  : "input-field"
              }
            />
            <input
              type="time"
              name="departureTime"
              defaultValue={trip.departureTime}
              placeholder="Departure Time"
              onChange={handleUpdateInfo}
              className={
                confirmClicked && trip.departureTime.trim() === ""
                  ? "empty-input-field"
                  : "input-field"
              }
            />
            <input
              type="text"
              name="vehicle"
              value={Vehicleid === null ? trip.vehicle : vehicle.name}
              placeholder="Vehicle"
              className={"input-field"}
            />
          </div>
          <button
            className="add-trip-button"
            onClick={() => UpdateInformation()}
          >
            Update Information
          </button>
        </div>
      )}

      {showAddVehicle && (
        <div className="AddTripBlock">
          <h2 className="AddTripText">Add Vehicle</h2>
          <div className="input-group">
            <input
              type="text"
              name="name"
              value={newVehicle.name}
              placeholder="Vehicle's name"
              onChange={handleInputVehicle}
              className={
                confirmClicked && newVehicle.name.trim() === ""
                  ? "empty-input-field"
                  : "input-field"
              }
            />
            <select
              name="fuel"
              value={newVehicle.fuel}
              onChange={handleInputVehicle}
              className={
                confirmClicked && newVehicle.fuel.trim() === ""
                  ? "empty-input-field"
                  : "input-field"
              }
            >
              <option value="">Fuel Type</option>
              <option value="Gasoline">Fuel Type: Gasoline</option>
              <option value="Diesel">Fuel Type: Diesel</option>
              <option value="Electric">Fuel Type: Electric</option>
            </select>
            <input
              type="number"
              name="payload"
              value={newVehicle.payload}
              placeholder="Pay Load (kg)"
              onChange={handleInputVehicle}
              className={
                confirmClicked && newVehicle.payload.trim() === ""
                  ? "empty-input-field"
                  : "input-field"
              }
            />
            {parseInt(newVehicle.payload) < 100 && newVehicle.payload !== "" ? (
              <small className="error-message">*Minimum is 100kg*</small>
            ) : null}
            <input
              type="text"
              name="licensePlate"
              value={newVehicle.licensePlate}
              placeholder="License Plate"
              onChange={handleInputVehicle}
              className={
                confirmClicked && newVehicle.licensePlate.trim() === ""
                  ? "empty-input-field"
                  : "input-field"
              }
            />
            <input
              type="text"
              name="size"
              value={
                newVehicle.payload === "" || parseInt(newVehicle.payload) < 100
                  ? ""
                  : parseInt(newVehicle.payload) < 500
                  ? "Normal"
                  : "Large"
              }
              placeholder="Size"
              className={
                confirmClicked &&
                (newVehicle.payload.trim() === "" ||
                  parseInt(newVehicle.payload) < 100)
                  ? "empty-input-field"
                  : "input-field"
              }
            />
          </div>
          <button className="add-trip-button" onClick={handleAddVehicle}>
            Add Vehicle
          </button>
        </div>
      )}

      {showAddDriver && (
        <div className="AddTripBlock">
          <h2 className="AddTripText">Add Driver</h2>
          <div className="input-group">
            <input
              type="text"
              name="name"
              value={newDriver.name}
              placeholder="Driver's name"
              onChange={handleInputDriver}
              className={
                confirmClicked && newDriver.name.trim() === ""
                  ? "empty-input-field"
                  : "input-field"
              }
            />
            <select
              name="licenseType"
              value={newDriver.licenseType}
              onChange={handleInputDriver}
              className={
                confirmClicked && newDriver.licenseType.trim() === ""
                  ? "empty-input-field"
                  : "input-field"
              }
            >
              <option value="">License Type</option>
              <option value="A">License Type: A</option>
              <option value="B">License Type: B</option>
              <option value="C">License Type: C</option>
            </select>
            <input
              type="number"
              name="age"
              value={newDriver.age}
              placeholder="Age"
              onChange={handleInputDriver}
              className={
                confirmClicked && newDriver.age.trim() === ""
                  ? "empty-input-field"
                  : "input-field"
              }
            />
            {(newDriver.age <= 18 || newDriver.age >= 75) &&
            newDriver.age !== "" ? (
              <small className="error-message">
                *Age must be between 18 and 75*
              </small>
            ) : null}
            <input
              type="text"
              name="address"
              value={newDriver.address}
              placeholder="Address"
              onChange={handleInputDriver}
              className={
                confirmClicked && newDriver.address.trim() === ""
                  ? "empty-input-field"
                  : "input-field"
              }
            />
            <input
              type="text"
              name="phone"
              value={newDriver.phone}
              placeholder="Phone number"
              onChange={handleInputDriver}
              className={
                confirmClicked && newDriver.phone.trim() === ""
                  ? "empty-input-field"
                  : "input-field"
              }
            />
            {newDriver.phone.length !== 10 && newDriver.phone !== "" ? (
              <small className="error-message">
                *Phone number must be 10 num*
              </small>
            ) : null}
          </div>
          <button className="add-trip-button" onClick={handleAddDriver}>
            Add Driver
          </button>
        </div>
      )}

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
