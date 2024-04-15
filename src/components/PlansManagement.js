import React, { useState } from "react";
import Button from '@mui/material/Button';
import { ref, child, get } from "firebase/database";
import { database } from '../firebase'
import { PieChart } from "react-minimal-pie-chart";

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

  //count the status of the trips
  let completed = 0;
  let scheduled = 0;
  let pending = 0;
  let inprogress = 0;

  trips.forEach((trip) => {
    if (trip.status === 'Completed') {
      completed++;
    } else if (trip.status === 'Scheduled') {
      scheduled++;
    } else if (trip.status === 'Pending') {
      pending++;
    } else if (trip.status === 'In progress') {
      inprogress++;
    }
  }
  );

  let costUnder50 = 0;
  let costUnder500 = 0;
  let costUnder1000 = 0;
  let costLarger1000 = 0;

  trips.forEach((trip) => {
    let num = trip.estimatedCost.replace('$', '');
    if (Number(num) <= 50) {
      costUnder50++;
    } else if (Number(num) <= 500) {
      costUnder500++;
    } else if (Number(num) <= 1000) {
      costUnder1000++;
    } else {
      costLarger1000++;
    }
  }
  );


  
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
        <tbody className="tbd">
        {trips.slice(0, visibleTrips).map((trip) => (
            <tr
            className={`tripTripUnit ${selectedTrip === trip.id ? 'highlight' : ''}`}
            style={
                trip.status === 'Completed'
                ? { backgroundColor: '#0CDB12' }
                : trip.status === 'Scheduled'
                ? { backgroundColor: '#2F92F5' }
                : trip.status === 'Pending'
                ? { backgroundColor: 'grey' }
                : trip.status === 'In progress'
                ? { backgroundColor: '#F8B944' }
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
        <div className="divider"></div>
      </table>
      {!showAllTrips && visibleTrips < trips.length && (
        <Button variant="contained" style={{ backgroundColor: '#54A329', color: 'white' }} onClick={handleShowMore}>Show More</Button>
      )}
      {!showAllTrips && (
        <Button variant="contained" style={{ backgroundColor: '#225E8F', color: 'white' }} onClick={handleShowAll}>Show All</Button>
      )}
      {showAllTrips && (
        <Button variant="contained" style={{ backgroundColor: '#BE0E34', color: 'white' }} onClick={handleCollapse}>Collapse</Button>
      )}

        <div className="graph">
          <PieChart
            data={[
              { title: 'Completed', value: completed, color: '#0CDB12' },
              { title: 'Scheduled', value: scheduled, color: '#2F92F5' },
              { title: 'Pending', value: pending, color: 'grey' },
              { title: 'In progress', value: inprogress, color: '#F8B944' }
            ]}
            radius={30} //bán kính của biểu đồ
            lineWidth={20} //độ dày của đường viền
            paddingAngle={8} // Góc khoảng cách giữa các phần tử trong biểu đồ
            label={({ dataEntry }) => `${Math.round(dataEntry.percentage)}%`} // Hiển thị phần trăm
            labelStyle={{
              fontSize: '3px',
              fontFamily: 'Arial',
              fill: 'white' // Màu chữ cho nhãn
            }}
          />
          
          <PieChart
            data={[
              { title: '< $50', value: costUnder50, color: '#FF0000' },
              { title: '$50 - $500', value: costUnder500, color: '#FFA500' },
              { title: '$500 - $1000', value: costUnder1000, color: '#FFFF00' },
              { title: '> $1000', value: costLarger1000, color: '#00FF00' }
            ]}
            radius={30}
            lineWidth={20}
            paddingAngle={8}
            label={({ dataEntry }) => `${Math.round(dataEntry.percentage)}%`}
            labelStyle={{
              fontSize: '3px',
              fontFamily: 'Arial',
              fill: 'white'
            }}
          />
      </div>

    </div>
  );
};

export default PlansManagement;