import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import { collection, getDocs } from "firebase/firestore";
import { firebase } from "../firebase";
import { PieChart } from "react-minimal-pie-chart";

function PlansManagement({
  setPlaneId,
  setTripLength,
  fetchPlans,
  setFetchPlans,
}) {
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [visibleTrips, setVisibleTrips] = useState(5);
  const [showAllTrips, setShowAllTrips] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const [trips, setData] = useState([]);
  //filter cho trip
  const [RouteFilter, setRouteFilter] = useState([]);
  const [EstimatedTimeFilter, setEstimatedTimeFilter] = useState([]);
  const [EstimatedCostFilter, setEstimatedCostFilter] = useState([]);
  const [DepartureTimeFilter, setDepartureTimeFilter] = useState([]);
  const [DriverFilter, setDriverFilter] = useState([]);
  const [VehicleFilter, setVehicleFilter] = useState([]);
  const [StatusFilter, setStatusFilter] = useState([]);
  const [EstimatedCostFilterMin, setEstimatedCostFilterMin] = useState("");
  const [EstimatedCostFilterMax, setEstimatedCostFilterMax] = useState("");
  const [DepartureTimeFilterMin, setDepartureTimeFilterMin] = useState("");
  const [DepartureTimeFilterMax, setDepartureTimeFilterMax] = useState("");
  const [showFields, setShowFields] = useState(false);

  //GET DATA
  useEffect(() => {
    if (fetchPlans) {
      const fetchData = async () => {
        try {
          const querySnapshot = await getDocs(collection(firebase, "plans"));
          const todoData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          todoData.sort((a, b) => a.STT - b.STT);
          setData(todoData);
          setTripLength(
            todoData.length === 0 ? 0 : todoData[todoData.length - 1].STT
          );
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchData();
      setFetchPlans(false);
    }
  }, [fetchPlans, setFetchPlans]);

  //FUNCTION
  const handleShowMore = () => {
    if (visibleTrips + 5 >= trips.length) {
      setVisibleTrips(trips.length);
      setShowAllTrips(true);
      return;
    }
    setVisibleTrips((prevVisibleTrips) => prevVisibleTrips + 5);
  };

  const handleShowAll = () => {
    setVisibleTrips(trips.length);
    setShowAllTrips(true);
  };

  const handleCollapse = () => {
    setVisibleTrips(5);
    setShowAllTrips(false);
  };

  const focusOn = (tripid) => {
    setIsFocus(!isFocus);
    setSelectedTrip(tripid === selectedTrip ? null : tripid);
    setPlaneId(selectedTrip !== tripid ? tripid : null);
  };

  const handleEstimatedCostFilterChange = (e) => {
    setEstimatedCostFilter(e.target.value);
  };
  const handleDepartureTimeFilterChange = (e) => {
    setDepartureTimeFilter(e.target.value);
  };

  const clearFilter = () => {
    setRouteFilter([]);
    setEstimatedTimeFilter([]);
    setEstimatedCostFilter([]);
    setDepartureTimeFilter([]);
    setDriverFilter([]);
    setVehicleFilter([]);
    setStatusFilter([]);  
    setEstimatedCostFilterMin("");
    setEstimatedCostFilterMax("");
    setDepartureTimeFilterMin("");
    setDepartureTimeFilterMax("");
  }
  
  //đếm status các trips
  let completed = 0;
  let scheduled = 0;
  let pending = 0;
  let inprogress = 0;

  trips.forEach((trip) => {
    if (trip.status === "Completed") {
      completed++;
    } else if (trip.status === "Scheduled") {
      scheduled++;
    } else if (trip.status === "Pending") {
      pending++;
    } else if (trip.status === "In progress") {
      inprogress++;
    }
  });

  let costUnder50 = 0;
  let costUnder500 = 0;
  let costUnder1000 = 0;
  let costLarger1000 = 0;

  trips.forEach((trip) => {
    let num = trip.estimatedCost.replace("$", "");
    if (Number(num) <= 50) {
      costUnder50++;
    } else if (Number(num) <= 500) {
      costUnder500++;
    } else if (Number(num) <= 1000) {
      costUnder1000++;
    } else {
      costLarger1000++;
    }
  });

  let EsTimeUnder2hour = 0;
  let EsTimeUnder5hour = 0;
  let EsTimeUnder8hour = 0;
  let EsTimeUnder12hour = 0;

  trips.forEach((trip) => {
    let num = trip.estimatedTime.replace("hours", "");
    if (Number(num) <= 2) {
      EsTimeUnder2hour++;
    } else if (Number(num) <= 5) {
      EsTimeUnder5hour++;
    } else if (Number(num) <= 8) {
      EsTimeUnder8hour++;
    } else {
      EsTimeUnder12hour++;
    }
  });



  return (
    <div className="TripTable">
      <table>
        <thead>
          <tr className="TripValueName">
            <th width="18%">Route</th>
            <th width="12%">Estimated Time</th>
            <th width="10%">Estimated Cost</th>
            <th width="10%">Departure Time</th>
            <th width="19%">Driver</th>
            <th width="19%">Vehicle</th>
            <th width="12%">Status</th>
          </tr>
        </thead>
        <tbody className="tbd">
          {trips
            //route filter
            .filter((trip) =>
              typeof RouteFilter === "string"
                ? trip.route.toLowerCase().includes(RouteFilter.toLowerCase())
                : true
            )
            //estimated time filter
            .filter((trip) =>
                typeof EstimatedTimeFilter === "string" && EstimatedTimeFilter !== ""
                ? trip.estimatedTime
                    .toString()
                    .toLowerCase() === EstimatedTimeFilter + ' hours'
                : true
            )
            //estimated cost filter
            .filter((trip) => {
              const cost = parseFloat(trip.estimatedCost.replace("$", ""));
              return (
                (EstimatedCostFilterMin
                  ? cost >= EstimatedCostFilterMin
                  : true) &&
                (EstimatedCostFilterMax ? cost <= EstimatedCostFilterMax : true)
              );
            })
            //departure time filter
            .filter((trip) =>
                (DepartureTimeFilterMin
                  ? trip.departureTime >= DepartureTimeFilterMin
                  : true) &&
                (DepartureTimeFilterMax
                  ? trip.departureTime <= DepartureTimeFilterMax
                  : true)
            )
            //driver filter
            .filter((trip) =>
              typeof DriverFilter === "string"
                ? trip.driver.toLowerCase().includes(DriverFilter.toLowerCase())
                : true
            )
            //vehicle filter
            .filter((trip) =>
              typeof VehicleFilter === "string"
                ? trip.vehicle
                    .toLowerCase()
                    .includes(VehicleFilter.toLowerCase())
                : true
            )
            //status filter
            .filter((trip) =>
              typeof StatusFilter === "string"
                ? trip.status.toLowerCase().includes(StatusFilter.toLowerCase())
                : true
            )
            .slice(0, visibleTrips)
            .map((trip) => (
              <tr
                className={`tripTripUnit ${
                  selectedTrip === trip.id ? "highlight" : ""
                }`}
                style={
                  trip.status === "Completed"
                    ? { backgroundColor: "#42D691" }
                    : trip.status === "Scheduled"
                    ? { backgroundColor: "#42AFD6" }
                    : trip.status === "Pending"
                    ? { backgroundColor: "grey" }
                    : trip.status === "In progress"
                    ? { backgroundColor: "#D6C742" }
                    : { backgroundColor: "white" }
                }
                key={trip.id}
                onClick={() => focusOn(trip.id)}
              >
                <td className="tripRoute">{trip.route}</td>
                <td className="tripEstimatedTime">{trip.estimatedTime}</td>
                <td className="tripEstimatedCost">{trip.estimatedCost}</td>
                <td className="tripDepartureTime">{trip.departureTime}</td>
                <td className="tripDriver">{trip.driver}</td>
                <td className="tripVehicle">{trip.vehicle}</td>
                <td className="tripStatus">{trip.status}</td>
              </tr>
            ))}
        </tbody>
        <div className="divider"></div>
      </table>

      {!showAllTrips && visibleTrips < trips.length && (
        <Button
          className="animated-button fade-in-button"
          variant="contained"
          style={{
            background: "linear-gradient(45deg, #3C7322, #1D3A4E)",
            color: "white",
          }}
          onClick={handleShowMore}
        >
          Show More
        </Button>
      )}

      {!showAllTrips && (
        <Button
          className="animated-button fade-in-button"
          variant="contained"
          style={{
            background: "linear-gradient(45deg, #0F3A57, #1D3A4E)",
            color: "white",
          }}
          onClick={handleShowAll}
        >
          Show All
        </Button>
      )}

      {showAllTrips && (
        <Button
          className="animated-button fade-in-button"
          variant="contained"
          style={{
            background: "linear-gradient(45deg, #51111D, #1D3A4E)",
            color: "white",
          }}
          onClick={handleCollapse}
        >
          Collapse
        </Button>
      )}
      
      <div className="filter">
        <Button
          className="animated-button fade-in-button"
          variant="contained"
          style={{
            background: "linear-gradient(45deg, #3A3A3A, #1D3A4E)",
            color: "white",
          }}
          onClick={() =>setShowFields(!showFields)}
        >
          {showFields ? "Hide trip filter" : "Trip filter 🔍"}
        </Button>
        {showFields && (
          <div>
            <button className="clear-filter" onClick={() => clearFilter()}>Clear filter</button>
            <div className="filterRoute">
              <input
                placeholder="Route"
                type="text"
                value={RouteFilter}
                onChange={(e) => setRouteFilter(e.target.value)}
              />
            </div>
            <select
              value={EstimatedTimeFilter}
              onChange={(e) => setEstimatedTimeFilter(e.target.value)}
            >
              <option value="">Estimated Time: All </option>
              {[...Array(12)].map((_, i) => (
                <option key={i} value={i + 1}>
                  Estimated Time: {i + 1} hour(s)
                </option>
              ))}
            </select>
            <div className="filterEstimatedCost">
              <input
                type="number"
                placeholder="Min Estimated Cost"
                value={EstimatedCostFilterMin}
                onChange={(e) => setEstimatedCostFilterMin(e.target.value)}
              />
              <input
                type="number"
                placeholder="Max Estimated Cost"
                value={EstimatedCostFilterMax}
                onChange={(e) => setEstimatedCostFilterMax(e.target.value)}
              />
            </div>
            <div className="filterDepartureTime">
              <label className="dt">Departure Time: </label>
              <input
                type="time"
                placeholder="Min Time"
                value={DepartureTimeFilterMin}
                onChange={(e) => setDepartureTimeFilterMin(e.target.value)}
              />
              <label className="dt"> to </label>
              <input
                type="time"
                placeholder="Max Time"
                value={DepartureTimeFilterMax}
                onChange={(e) => setDepartureTimeFilterMax(e.target.value)}
              />
            </div>
            <div className="filterDriver">
              <input
                placeholder="Driver"
                type="text"
                value={DriverFilter}
                onChange={(e) => setDriverFilter(e.target.value)}
              />
            </div>
            <div className="filterVehicle">
              <input
                placeholder="Vehicle"
                type="text"
                value={VehicleFilter}
                onChange={(e) => setVehicleFilter(e.target.value)}
              />
            </div>
            <select value={StatusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">Status: All</option>
              <option value="Completed">Status: Completed</option>
              <option value="Scheduled">Status: Scheduled</option>
              <option value="Pending">Status: Pending</option>
              <option value="In progress">Status: In progress</option>
            </select>
          </div>
        )}
      </div>
      <div className="divider"></div>
      <div className="graph">
        <div className="TimeGraph">
          <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
            Estimated Time
          </h2>
          <PieChart
            data={[
              {
                title: "1 - 2 hours",
                value: EsTimeUnder2hour,
                color: "#AB2B3A",
              },
              {
                title: "3 - 5 hours",
                value: EsTimeUnder5hour,
                color: "#D5FF9E",
              },
              {
                title: "6 - 8 hours",
                value: EsTimeUnder8hour,
                color: "#D4FFDB",
              },
              {
                title: "9 - 12 hours",
                value: EsTimeUnder12hour,
                color: "#85FF91",
              },
            ]}
            radius={40}
            lineWidth={20}
            paddingAngle={8}
            label={({ dataEntry }) => `${Math.round(dataEntry.percentage)}%`}
            labelStyle={{
              fontSize: "5px",
              fontFamily: "Arial",
              fill: "white",
            }}
          />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                color: "white",
                fontStyle: "italic",
                fontSize: "small",
              }}
            ></div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                color: "white",
                fontStyle: "italic",
                fontSize: "small",
              }}
            >
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  backgroundColor: "#AB2B3A",
                  marginRight: "5px",
                }}
              ></div>
              <span>1 - 2 hours</span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                color: "white",
                fontStyle: "italic",
                fontSize: "small",
              }}
            >
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  backgroundColor: "#D5FF9E",
                  marginRight: "5px",
                }}
              ></div>
              <span>2 - 5 hours</span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                color: "white",
                fontStyle: "italic",
                fontSize: "small",
              }}
            >
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  backgroundColor: "#D4FFDB",
                  marginRight: "5px",
                }}
              ></div>
              <span>5 - 8 hours</span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                color: "white",
                fontStyle: "italic",
                fontSize: "small",
              }}
            >
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  backgroundColor: "#85FF91",
                  marginRight: "5px",
                }}
              ></div>
              <span>8 - 12 hours</span>
            </div>
          </div>
        </div>

        <div className="CostGraph">
          <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
            Trip Cost
          </h2>
          <PieChart
            data={[
              { title: "< $50", value: costUnder50, color: "#C2519E" },
              { title: "$50 - $500", value: costUnder500, color: "#9A8FDB" },
              { title: "$500 - $1000", value: costUnder1000, color: "#F1F6B7" },
              { title: "> $1000", value: costLarger1000, color: "#C23E42" },
            ]}
            radius={40}
            lineWidth={20}
            paddingAngle={8}
            label={({ dataEntry }) => `${Math.round(dataEntry.percentage)}%`}
            labelStyle={{
              fontSize: "5px",
              fontFamily: "Arial",
              fill: "white",
            }}
          />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                color: "white",
                fontStyle: "italic",
                fontSize: "small",
              }}
            >
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  backgroundColor: "#C2519E",
                  marginRight: "5px",
                }}
              ></div>
              <span>&lt; $50</span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                color: "white",
                fontStyle: "italic",
                fontSize: "small",
              }}
            >
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  backgroundColor: "#9A8FDB",
                  marginRight: "5px",
                }}
              ></div>
              <span>$50 - $500</span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                color: "white",
                fontStyle: "italic",
                fontSize: "small",
              }}
            >
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  backgroundColor: "#F1F6B7",
                  marginRight: "5px",
                }}
              ></div>
              <span>$500 - $1000</span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                color: "white",
                fontStyle: "italic",
                fontSize: "small",
              }}
            >
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  backgroundColor: "#C23E42",
                  marginRight: "5px",
                }}
              ></div>
              <span>&gt; $1000</span>
            </div>
          </div>
        </div>

        <div className="StatusGraph" style={{ marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
            Trip Status
          </h2>
          <PieChart
            data={[
              { title: "Completed", value: completed, color: "#42D691" },
              { title: "Scheduled", value: scheduled, color: "#42AFD6" },
              { title: "Pending", value: pending, color: "grey" },
              { title: "In progress", value: inprogress, color: "#D6C742" },
            ]}
            radius={40}
            lineWidth={20}
            paddingAngle={8}
            label={({ dataEntry }) => `${Math.round(dataEntry.percentage)}%`}
            labelStyle={{
              fontSize: "5px",
              fontFamily: "Arial",
              fill: "white",
            }}
          />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                color: "white",
                fontStyle: "italic",
                fontSize: "small",
              }}
            >
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  backgroundColor: "#42D691",
                  marginRight: "5px",
                }}
              ></div>
              <span>Completed</span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                color: "white",
                fontStyle: "italic",
                fontSize: "small",
              }}
            >
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  backgroundColor: "#42AFD6",
                  marginRight: "5px",
                }}
              ></div>
              <span>Scheduled</span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                color: "white",
                fontStyle: "italic",
                fontSize: "small",
              }}
            >
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  backgroundColor: "grey",
                  marginRight: "5px",
                }}
              ></div>
              <span>Pending</span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                color: "white",
                fontStyle: "italic",
                fontSize: "small",
              }}
            >
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  backgroundColor: "#D6C742",
                  marginRight: "5px",
                }}
              ></div>
              <span>In progress</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlansManagement;
