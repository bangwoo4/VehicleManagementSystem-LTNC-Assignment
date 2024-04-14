import React, { useState } from "react";
import Button from '@mui/material/Button';
import { ref, child, get } from "firebase/database";
import { database } from '../firebase'

function PlansManagement({ PlanIdPass, TripNextIdPass }) {
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [visibleTrips, setVisibleTrips] = useState(5);
  const [showAllTrips, setShowAllTrips] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const [trips, setData] = useState([]);
  const dbRef = ref(database);

  //GET DATA
  get(child(dbRef, `/plans`)).then((snapshot) => {
      if (snapshot.exists()) {
      let temp = [];
      snapshot.forEach(childsnapshot => {
          let keyname = childsnapshot.key;
          let data = childsnapshot.val();
          data.id = keyname;
          temp.push(data);
      });
      TripNextIdPass(temp[temp.length - 1].id);
      setData(temp);
      } else {
      TripNextIdPass(0);
      console.log("No data available");
      }
  }).catch((error) => {
      console.error(error);
  });

  //FUNCTION
  const handleShowMore = () => {
    setVisibleTrips(prevVisibleTrips => prevVisibleTrips + 5);
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
    PlanIdPass(selectedTrip !== tripid ? tripid : null)
  }


  
  return (
    <div className="TripTable">
      <table>
        <thead>
        <tr className="TripValueName">
            <th width='18%'>Route</th>
            <th width='12%'>Estimated Time</th>
            <th width='10%'>Estimated Cost</th>
            <th width='10%'>Departure Time</th>
            <th width='19%'>Driver</th>
            <th width='19%'>Vehicle</th>
            <th width='12%'>Status</th>
        </tr>
        </thead>
        <tbody>
        {trips.slice(0, visibleTrips).map((trip) => (
            <tr
            className={`tripTripUnit ${selectedTrip === trip.id ? 'highlight' : ''}`}
            style={
                trip.status === 'Completed'
                ? { backgroundColor: 'lightgreen' }
                : trip.status === 'Scheduled'
                ? { backgroundColor: 'lightblue' }
                : trip.status === 'Pending'
                ? { backgroundColor: 'grey' }
                : trip.status === 'In progress'
                ? { backgroundColor: 'lightcoral' }
                : { backgroundColor: 'white'}
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
      </table>
      {!showAllTrips && visibleTrips < trips.length && (
          <Button variant="contained" onClick={handleShowMore}>Show More</Button>
      )}
      {!showAllTrips && (
          <Button variant="contained" onClick={handleShowAll}>Show All</Button>
      )}
      {showAllTrips && (
          <Button variant="contained" onClick={handleCollapse}>Collapse</Button>
      )}
    </div>
  );
};

export default PlansManagement;