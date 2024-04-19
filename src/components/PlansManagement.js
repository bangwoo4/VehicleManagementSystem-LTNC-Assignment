import React, { useState, useEffect } from "react";
import Button from '@mui/material/Button';
import { collection, getDocs } from "firebase/firestore"; 
import { firebase } from '../firebase'
import { PieChart } from "react-minimal-pie-chart";

function PlansManagement({ PlanIdPass, fetchPlans, setFetchPlans }) {
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [visibleTrips, setVisibleTrips] = useState(5);
  const [showAllTrips, setShowAllTrips] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const [trips, setData] = useState([]);

  //GET DATA
  useEffect(() => {
    if (fetchPlans) {
      const fetchData = async () => {
        try {
          const querySnapshot = await getDocs(collection(firebase, 'plans'));
          const todoData = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
          }));
          setData(todoData);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      fetchData();
      setFetchPlans(false);
    }
  }, [fetchPlans, setFetchPlans]);

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
                ? { backgroundColor: '#42D691' }
                : trip.status === 'Scheduled'
                ? { backgroundColor: '#42AFD6' }
                : trip.status === 'Pending'
                ? { backgroundColor: 'grey' }
                : trip.status === 'In progress'
                ? { backgroundColor: '#D6C742' }
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
  <div style={{ marginBottom: '2rem' }}>
    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Trip Status</h2>
    <PieChart
      data={[
        { title: 'Completed', value: completed, color: '#42D691' },
        { title: 'Scheduled', value: scheduled, color: '#42AFD6' },
        { title: 'Pending', value: pending, color: 'grey' },
        { title: 'In progress', value: inprogress, color: '#D6C742' }
      ]}
      radius={40}
      lineWidth={20}
      paddingAngle={8}
      label={({ dataEntry }) => `${Math.round(dataEntry.percentage)}%`}
      labelStyle={{
        fontSize: '5px',
        fontFamily: 'Arial',
        fill: 'white'
      }}
    />
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', color: 'white', fontStyle: 'italic', fontSize: 'small'    }}>
        <div style={{ width: '10px', height: '10px', backgroundColor: '#42D691', marginRight: '5px' }}></div>
        <span>Completed</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', color: 'white', fontStyle: 'italic', fontSize: 'small'      }}>
        <div style={{ width: '10px', height: '10px', backgroundColor: '#42AFD6', marginRight: '5px' }}></div>
        <span>Scheduled</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', color: 'white', fontStyle: 'italic', fontSize: 'small'      }}>
        <div style={{ width: '10px', height: '10px', backgroundColor: 'grey', marginRight: '5px' }}></div>
        <span>Pending</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', color: 'white', fontStyle: 'italic', fontSize: 'small'      }}>
        <div style={{ width: '10px', height: '10px', backgroundColor: '#D6C742', marginRight: '5px' }}></div>
        <span>In progress</span>
      </div>
    </div>
  </div>
  <div>
    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Trip Cost</h2>
    <PieChart
      data={[
        { title: '< $50', value: costUnder50, color: '#C2519E' },
        { title: '$50 - $500', value: costUnder500, color: '#9A8FDB' },
        { title: '$500 - $1000', value: costUnder1000, color: '#F1F6B7' },
        { title: '> $1000', value: costLarger1000, color: '#C23E42' }
      ]}
      radius={40}
      lineWidth={20}
      paddingAngle={8}
      label={({ dataEntry }) => `${Math.round(dataEntry.percentage)}%`}
      labelStyle={{
        fontSize: '5px',
        fontFamily: 'Arial',
        fill: 'white'
      }}
    />
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', color: 'white', fontStyle: 'italic', fontSize: 'small'   }}>
        <div style={{ width: '10px', height: '10px', backgroundColor: '#C2519E', marginRight: '5px' }}></div>
        <span>&lt; $50</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', color: 'white', fontStyle: 'italic', fontSize: 'small'      }}>
        <div style={{ width: '10px', height: '10px', backgroundColor: '#9A8FDB', marginRight: '5px' }}></div>
        <span>$50 - $500</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', color: 'white', fontStyle: 'italic', fontSize: 'small'      }}>
        <div style={{ width: '10px', height: '10px', backgroundColor: '#F1F6B7', marginRight: '5px' }}></div>
        <span>$500 - $1000</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', color: 'white', fontStyle: 'italic', fontSize: 'small'      }}>
        <div style={{ width: '10px', height: '10px', backgroundColor: '#C23E42', marginRight: '5px' }}></div>
        <span>&gt; $1000</span>
      </div>
    </div>
  </div>
</div>


        

    </div>
  );
};

export default PlansManagement;