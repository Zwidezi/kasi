
// Live Driver Tracking + Payments + Network Effect
import React, {useState, useEffect} from 'react';

const EXAMPLE_DRIVERS = [
  {name: 'Thabo', lat: -26.2406, lng: 27.8647, status: 'active', zone: 'Soweto'},
  {name: 'Amahle', lat: -33.9258, lng: 18.4232, status: 'available', zone: 'Khayelitsha'},
  {name: 'Sipho', lat: -26.2906, lng: 27.8682, status: 'idle', zone: 'Soweto'},
];
const ZONES = {
  'Soweto': {drivers: 2, customers: 5},
  'Khayelitsha': {drivers: 1, customers: 3},
};

function PayGateway({gateway}) {
  const url = gateway === 'paystack'
    ? 'https://paystack.com/pay/demo'
    : 'https://ozow.com/demo-pay';
  return (
    <a href={url} target="_blank" rel="noopener noreferrer">
      <button style={{marginRight: 8}}>
        Pay via {gateway.charAt(0).toUpperCase() + gateway.slice(1)}
      </button>
    </a>
  );
}

export default function App() {
  const [drivers, setDrivers] = useState(EXAMPLE_DRIVERS);
  const [selectedZone, setSelectedZone] = useState('Soweto');

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setDrivers(drivers => drivers.map(d => ({
        ...d,
        lat: d.lat + (Math.random()-0.5)*0.001,
        lng: d.lng + (Math.random()-0.5)*0.001,
        status: Math.random() > 0.5 ? 'active' : 'idle'
      })));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{padding: 32, fontFamily: 'sans-serif'}}>
      <h1>Kasi Courier Platform</h1>
      {/* ==== Network Effect/Zone Panel ==== */}
      <div style={{margin: '30px 0'}}>
        <h3>Active Network Zones</h3>
        <div style={{display: 'flex', gap: 24}}>
          {Object.entries(ZONES).map(([zone,data]) => (
            <div key={zone} style={{border: '1px solid #ccc', padding: 12, borderRadius: 10}}>
              <div>
                <b>{zone}</b>
              </div>
              <div>Drivers: {data.drivers}</div>
              <div>Customers: {data.customers}</div>
              <button onClick={()=>setSelectedZone(zone)} style={{marginTop: 8}}>
                Show on Map
              </button>
            </div>
          ))}
        </div>
      </div>
      {/* ==== Map + Live Tracking ==== */}
      <div style={{border: '2px solid #222', padding: 12, borderRadius: 8, margin: '30px 0'}}>
        <h3>Live Map — {selectedZone}</h3>
        {/* DEMO: Replace with real map/driver feed */}
        <iframe src={`https://maps.google.com/maps?q=${selectedZone}&z=12&output=embed`}
          style={{width: 400, height: 280, border: 0}} title="Zone Map" />
        <ul style={{marginLeft: 16}}>
          {drivers.filter(d=>d.zone===selectedZone).map(d=>(
            <li key={d.name}>{d.name}: ({d.lat.toFixed(4)}, {d.lng.toFixed(4)}) - {d.status}</li>
          ))}
        </ul>
      </div>
      {/* ==== Payment gateways ==== */}
      <div style={{margin: '30px 0'}}>
        <h3>Pay for Delivery</h3>
        <PayGateway gateway="paystack" />
        <PayGateway gateway="ozow" />
      </div>
      {/* Merchants Demo (local shops, future API) */}
      <div style={{margin: '30px 0'}}>
        <h3>Partnered Local Merchants (Demo)</h3>
        <ul>
          <li>Zulu Supermarket (Soweto)</li>
          <li>Khayelitsha Electronics</li>
          <li>Pep Store</li>
        </ul>
      </div>
    </div>
  );
}
