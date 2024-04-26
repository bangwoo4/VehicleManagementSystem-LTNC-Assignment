import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import { collection, getDocs } from "firebase/firestore";
import { firebase } from "../firebase";

function VehiclesManagement({ setVehicleId, fetchVehicles, setFetchVehicles }) {
  const [vehicles, setData] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showAllVehicles, setShowAllVehicles] = useState(false);
  const [showSreach, setShowSreach] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  //filter
  const [sizeFilter, setSizeFilter] = useState("");
  const [payloadFilter, setPayloadFilter] = useState("");
  const [fuelFilter, setFuelFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [licensePlateFilter, setLicensePlateFilter] = useState("");
  //filter payload
  const [minPayloadFilter, setMinPayloadFilter] = useState("");
  const [maxPayloadFilter, setMaxPayloadFilter] = useState("");

  //GET DATA
  useEffect(() => {
    if (fetchVehicles) {
      const fetchData = async () => {
        try {
          const querySnapshot = await getDocs(collection(firebase, "vehicles"));
          const todoData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setData(todoData);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchData();
      setFetchVehicles(false);
    }
  }, [fetchVehicles, setFetchVehicles]);

  //FUNCTION
  const handlePayloadFilterChange = (e) => {
    setPayloadFilter(e.target.value);
  };

  const showAllBtnStyle = {
    background: showAllVehicles
      ? "linear-gradient(to right, #9890e3 0%, #b1f4cf 100%)"
      : "linear-gradient(to left, #9890e3 0%, #b1f4cf 100%)",
    color: "black",
    fontWeight: "bold",
    border: "none",
    borderRadius: "10px",
    maxWidth: "98%",
    fontSize: "12px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    padding: "5px 10px",
    boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.1)",
    whiteSpace: "nowrap",
  };

  const toggleShowInfo = (vehicleId) => {
    setSelectedVehicle(vehicleId === selectedVehicle ? null : vehicleId);
    setVehicleId(selectedVehicle !== vehicleId ? vehicleId : null);
  };

  return (
    <div>
      <h2 className="VehicleManagement">Vehicle Management</h2>
      <div>
        <h3 className="vl">
          {" "}
          <button
            className="magnifier"
            onClick={() => setShowSreach(!showSreach)}
          >
            🚕🔎
          </button>
          {showSreach && (
            <div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="🔎 Search for vehicle..."
                className="searchInput"
              />
              <select
                value={sizeFilter}
                onChange={(e) => setSizeFilter(e.target.value)}
                className="searchInput"
              >
                <option value="">Size: All</option>
                <option value="Normal">Size: Normal</option>
                <option value="Large">Size: Large</option>
              </select>
              <div
                className="payloadFilter"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "95%",
                  margin: "0 auto",
                }}
              >
                <input
                  type="number"
                  value={minPayloadFilter}
                  onChange={(e) => setMinPayloadFilter(e.target.value)}
                  placeholder="Min Payload"
                  className="searchInput"
                />
                <input
                  type="number"
                  value={maxPayloadFilter}
                  onChange={(e) => setMaxPayloadFilter(e.target.value)}
                  placeholder="Max Payload"
                  className="searchInput"
                />
              </div>
              <select
                value={fuelFilter}
                onChange={(e) => setFuelFilter(e.target.value)}
                className="searchInput"
              >
                <option value="">Fuel Type: All</option>
                <option value="Gasoline">Fuel Type: Gasoline</option>
                <option value="Diesel">Fuel Type: Diesel</option>
                <option value="Electricity">Fuel Type: Electricity</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="searchInput"
              >
                <option value="">Status: All</option>
                <option value="Working">Status: Working</option>
                <option value="Inactive">Status: Inactive</option>
                <option value="Maintenance">Status: Maintenance</option>
              </select>
              <input
                type="text"
                value={licensePlateFilter}
                onChange={(e) => setLicensePlateFilter(e.target.value)}
                placeholder="License Plate"
                className="searchInput"
              />
            </div>
          )}
        </h3>
        <Button
          onClick={() => setShowAllVehicles(!showAllVehicles)}
          style={showAllBtnStyle}
        >
          {showAllVehicles
            ? "Hide all vehicle's information"
            : "Show all vehicle's information"}
        </Button>
        {vehicles
          .filter(
            (vehicle) =>
              vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
              (!minPayloadFilter ||
                (minPayloadFilter &&
                  parseInt(vehicle.payload) >= parseInt(minPayloadFilter))) &&
              (!maxPayloadFilter ||
                (maxPayloadFilter &&
                  parseInt(vehicle.payload) <= parseInt(maxPayloadFilter))) &&
              (!sizeFilter || vehicle.size === sizeFilter) &&
              (!fuelFilter || vehicle.fuel === fuelFilter) &&
              (!statusFilter || vehicle.status === statusFilter) &&
              (!licensePlateFilter ||
                vehicle.licensePlate
                  .toLowerCase()
                  .includes(licensePlateFilter.toLowerCase()))
          )
          .map((vehicle) => (
            <button
              className={`VehicleUnit ${
                selectedVehicle === vehicle.id || showAllVehicles
                  ? "expanded"
                  : ""
              }`}
              key={vehicle.id}
              style={{
                background:
                  vehicle.status === "Working"
                    ? "linear-gradient(to top, #c1dfc4 0%, #deecdd 100%)"
                    : vehicle.status === "Maintenance"
                    ? "linear-gradient(to right, #868f96 0%, #596164 100%)"
                    : vehicle.status === "Inactive"
                    ? "linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)"
                    : {},
              }}
              onClick={() => toggleShowInfo(vehicle.id)}
            >
              <strong className="VehicleName">{vehicle.name}</strong>
              <br />
              {vehicle.image ? (
                <img
                  src={vehicle.image}
                  alt={vehicle.name}
                  className="VehicleImage"
                  style={{
                    width: "150px",
                    maxWidth: "100%",
                    border: "2px solid black",
                    borderRadius: "5px",
                    display: "inline-block",
                    marginRight: "auto",
                  }}
                />
              ) : (
                <img
                  src="https://t3.ftcdn.net/jpg/02/33/69/46/360_F_233694647_8fEIOuq6QVxjFHTOhLrN3xBLYAnP8WA7.jpg"
                  alt="BrkImage"
                  className="VehicleImage"
                  style={{
                    width: "150px",
                    maxWidth: "100%",
                    border: "2px solid black",
                    borderRadius: "5px",
                    display: "inline-block",
                    marginRight: "auto",
                  }}
                />
              )}
              <ul className="VehicleDetails">
                <li>Size: {vehicle.size ? vehicle.size : "unknown"}</li>
                <li>
                  Payload: {vehicle.payload ? vehicle.payload : "unknown"}
                </li>
                <li>Fuel Type: {vehicle.fuel ? vehicle.fuel : "unknown"}</li>
                <li>Status: {vehicle.status ? vehicle.status : "unknown"}</li>
                <li>
                  License Plate:{" "}
                  {vehicle.licensePlate ? vehicle.licensePlate : "unknown"}
                </li>
              </ul>
            </button>
          ))}
      </div>
      <div className="divider"></div>
    </div>
  );
}
export default VehiclesManagement;
