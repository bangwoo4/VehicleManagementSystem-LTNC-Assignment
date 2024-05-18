import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import ReactDOM from "react-dom";
import { collection, getDocs } from "firebase/firestore";
import { firebase } from "../firebase";
import DriverHistoryTable from "./DriverHistoryTable";

function DriversManagement({ fetchDrivers, setFetchDrivers }) {
  const [drivers, setData] = useState([]);
  const [selectedDriverId, setSelectedDriverId] = useState(null);
  const [showAllDrivers, setShowAllDrivers] = useState(false);
  const [showSreach, setShowSreach] = useState(false);
  //search
  const [searchTerm, setSearchTerm] = useState("");
  //filter
  const [ageFilter, setAgeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  //filter age
  const [minAgeFilter, setMinAgeFilter] = useState("");
  const [maxAgeFilter, setMaxAgeFilter] = useState("");
  //filter license
  const [selectedLicenseType, setSelectedLicenseType] = useState("");
  //notification
  const [showNotification, setShowNotification] = useState(false);
  const [message, setMessage] = useState("");

  //history

  let DrivingHistoryTable = `
    <table>
        <tr>
            <th>Column 1</th>
            <th>Column 2</th>
        </tr>
        <tr>
            <td>Data 1</td>
            <td>Data 2</td>
        </tr>
    </table>
`;

  // GET DATA
  useEffect(() => {
    if (fetchDrivers) {
      const fetchData = async () => {
        try {
          const querySnapshot = await getDocs(collection(firebase, "drivers"));
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
      setFetchDrivers(false);
    }
  }, [fetchDrivers, setFetchDrivers]);

  const toggleShowInfo = (driverId) => {
    setSelectedDriverId((prevId) => (prevId === driverId ? null : driverId));
  };

  const handleAgeFilterChange = (e) => {
    setAgeFilter(e.target.value);
  };

  /*background-image: linear-gradient(to top, #9890e3 0%, #b1f4cf 100%);*/
  const showAllBtnStyle = {
    background: showAllDrivers
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

  const clearFilters = () => {
    setSearchTerm("");
    setAgeFilter("");
    setStatusFilter("");
    setMinAgeFilter("");
    setMaxAgeFilter("");
    setSelectedLicenseType("");
  };

  // ReactDOM.render(DrivingHistoryTable, document.getElementById("root"));
  const showDrivingHistoryTable = () => {
    ReactDOM.render(<DriverHistoryTable />, document.getElementById("root"));
  };

  return (
    <div>
      <h2 className="DriverManagement">Driver Management</h2>
      <div className="Block">
        <h3 className="dl">
          {" "}
          <button
            className="magnifier"
            onClick={() => setShowSreach(!showSreach)}
          >
            🧑‍✈️🔎
          </button>
          {showSreach && (
            <div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="🔎 Search for driver..."
                className="searchInput"
              />
              <div
                className="ageFilter"
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
                  value={minAgeFilter}
                  onChange={(e) => setMinAgeFilter(e.target.value)}
                  placeholder="Min Age"
                  className="searchInput"
                />
                <input
                  type="number"
                  value={maxAgeFilter}
                  onChange={(e) => setMaxAgeFilter(e.target.value)}
                  placeholder="Max Age"
                  className="searchInput"
                />
              </div>
              <select
                value={selectedLicenseType}
                onChange={(e) => setSelectedLicenseType(e.target.value)}
                className="searchInput"
              >
                <option value="">License Type: All</option>
                <option value="A">License Type: A</option>
                <option value="B">License Type: B</option>
                <option value="C">License Type: C</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="searchInput"
              >
                <option value="">Status: All</option>
                <option value="Ready">Status: Ready</option>
                <option value="Not ready">Status: Not ready</option>
              </select>
              <button className="clear-filter2" onClick={() => clearFilters()}>
                Clear filter
              </button>
            </div>
          )}
        </h3>
        <Button
          onClick={() => setShowAllDrivers(!showAllDrivers)}
          style={showAllBtnStyle}
        >
          {showAllDrivers
            ? "Hide all driver's information"
            : "Show all driver's information"}
        </Button>
        {drivers
          .filter(
            (driver) =>
              driver.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
              (!minAgeFilter || driver.age >= parseInt(minAgeFilter)) && // Filter by minimum age
              (!maxAgeFilter || driver.age <= parseInt(maxAgeFilter)) && // Filter by maximum age
              (!statusFilter || driver.status === statusFilter) && // Filter by status
              (!selectedLicenseType ||
                driver.licenseType === selectedLicenseType) // Filter by license type
          )
          /* Màu cho DriverUnit //status 
            background-image: linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%);
            background-image: linear-gradient(120deg, #a6c0fe 0%, #f68084 100%);
            background-image: linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%);
            background-image: linear-gradient(to top, #feada6 0%, #f5efef 100%);
            background-image: linear-gradient(to top, #accbee 0%, #e7f0fd 100%);
            background-image: linear-gradient(to right, #868f96 0%, #596164 100%);
            background-image: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            background-image: linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%);
            background-image: linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%);
            background-image: linear-gradient(to top, #c1dfc4 0%, #deecdd 100%);
            background: linear-gradient(to bottom, rgba(255,255,255,0.15) 0%, rgba(0,0,0,0.15) 100%), radial-gradient(at top center, rgba(255,255,255,0.40) 0%, rgba(0,0,0,0.40) 120%) #989898;
          background-blend-mode: multiply,multiply;
            background-image: linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%);
            */

          .map((driver) => (
            <button
              className={`DriverUnit ${
                selectedDriverId === driver.id || showAllDrivers
                  ? "expanded"
                  : ""
              }`}
              key={driver.id}
              style={
                driver.status === "Ready"
                  ? {
                      background:
                        "linear-gradient(to top, #c1dfc4 0%, #deecdd 100%)",
                    }
                  : driver.status === "Not ready"
                  ? {
                      background:
                        "linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)",
                    }
                  : {}
              }
              onClick={() => toggleShowInfo(driver.id)}
            >
              <strong className="DriverName">{driver.name}</strong>
              <br />
              {driver.image ? (
                <img
                  src={driver.image}
                  alt="Driver Image"
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
                  src="https://www.shutterstock.com/shutterstock/photos/535853263/display_1500/stock-vector-profile-photo-vector-placeholder-pic-male-person-default-profile-gray-photo-picture-avatar-image.jpg"
                  alt="Default Profile"
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
              <ul className="DriverDetails">
                <li>Age: {driver.age ? driver.age : "unknown"}</li>
                <li>
                  License Type:{" "}
                  {driver.licenseType ? driver.licenseType : "unknown"}
                </li>
                <li>Phone: {driver.phone ? driver.phone : "unknown"}</li>
                <li>Address: {driver.address ? driver.address : "unknown"}</li>
                <li>Status: {driver.status}</li>
                <button
                  id="HistoryButton"
                  className="HistoryButton"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowNotification(true);
                    setMessage("Driver's driving history is not available");
                    //hàm này để in ra cái bảng
                    showDrivingHistoryTable();
                  }}
                >
                  Show driver's driving history
                </button>
              </ul>
            </button>
          ))}
      </div>
      {showNotification && (
        <div className="DrivingHistoryPopup">
          <div className="HistoryNotification">
            <a
              href="#"
              class="x"
              onClick={() => {
                setShowNotification(false);
                setMessage("");
              }}
            ></a>
            <span>{"🔔 " + message}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default DriversManagement;
