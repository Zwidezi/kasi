import React, { useState, useEffect, useRef } from 'react';
import {
  Package, Truck, BarChart3, LayoutDashboard, History, ShieldAlert,
  Menu, X, PlusCircle, Clock, CheckCircle2, TrendingUp, DollarSign,
  Users, AlertTriangle, MapPin, Store, Navigation, MessageSquare,
  Send, Download, ShieldCheck, Zap, Camera, ScanLine, ArrowRight, UserPlus
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, AreaChart, Area } from 'recharts';
import TownshipMap from './components/TownshipMap';
import LandmarkInput from './components/LandmarkInput';
import { UserRole, Landmark, Incident, Delivery } from './types';
import { MOCK_LANDMARKS, MOCK_INCIDENTS, COLORS } from './constants';
import { geminiService } from './services/geminiService';

// ==== ORIGINAL APP CODE START (paste your entire "App" function here) ====
const App: React.FC = () => {
  // All your original code from: https://github.com/Zwidezi/kasi/blob/849463ca49d899873f5f8ea3f66e7367d9d68ec3/App.tsx
  // For readability, this is not repeated in full length here
  // You can paste your previous version of the App function as is here

  // ----- Snip: Your full original JSX and logic goes here -----
  // The structure must end with:
  return (
    // Your original entire JSX tree goes here
    // e.g. the role switcher, sidebar, map, gig list, etc
    <div>Your original Kasi-Nav UI</div>
  );
};
// ==== ORIGINAL APP CODE END ====

// --- DEMO ADDONS - Live Driver Tracking, Payments, Network Panel ---
const EXAMPLE_DRIVERS = [
  {name: 'Thabo', lat: -26.2406, lng: 27.8647, status: 'active', zone: 'Soweto'},
  {name: 'Amahle', lat: -33.9258, lng: 18.4232, status: 'available', zone: 'Khayelitsha'},
  {name: 'Sipho', lat: -26.2906, lng: 27.8682, status: 'idle', zone: 'Soweto'},
];
const ZONES = {
  Soweto: {drivers: 2, customers: 5},
  Khayelitsha: {drivers: 1, customers: 3},
};

function PayGateway({gateway}:{gateway:'paystack'|'ozow'}) {
  const url = gateway === 'paystack' ? 'https://paystack.com/pay/demo' : 'https://ozow.com/demo-pay';
  return (
    <a href={url} target="_blank" rel="noopener noreferrer">
      <button style={{marginRight:8}}>Pay via {gateway.charAt(0).toUpperCase()+gateway.slice(1)}</button>
    </a>
  );
}
const DemoAddons: React.FC = () => {
  const [drivers, setDrivers] = React.useState(EXAMPLE_DRIVERS);
  const [selectedZone, setSelectedZone] = React.useState('Soweto');
  React.useEffect(() => {
    const interval = setInterval(() => {
      setDrivers(drivers =>
        drivers.map(d => ({
          ...d,
          lat: d.lat + (Math.random() - 0.5) * 0.001,
          lng: d.lng + (Math.random() - 0.5) * 0.001,
          status: Math.random() > 0.5 ? "active" : "idle",
        }))
      );
    }, 4000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div style={{margin: "40px 0", background: "#f6f6f9", borderRadius: 16, padding: 24}}>
      <h2 style={{marginBottom: 18, fontWeight: 700}}>Demo: Real-time Zone Density, Payments & Tracking</h2>
      {/* Network Effect panel */}
      <div style={{marginBottom: 24}}>
        <h3 style={{fontWeight: 600}}>Active Network Zones</h3>
        <div style={{display: "flex", gap: 24}}>
          {Object.entries(ZONES).map(([zone,data]:any) => (
            <div key={zone} style={{border: "1px solid #ccc", padding: 12, borderRadius: 10}}>
              <div style={{fontWeight: 600, fontSize: 18}}>{zone}</div>
              <div>Drivers: {data.drivers}</div>
              <div>Customers: {data.customers}</div>
              <button onClick={() => setSelectedZone(zone)} style={{marginTop: 8}}>
                Show on Map
              </button>
            </div>
          ))}
        </div>
      </div>
      <div style={{border: "2px solid #222", padding: 12, borderRadius: 8, margin: "30px 0"}}>
        <h3 style={{fontWeight: 600}}>Live Map — {selectedZone}</h3>
        <iframe src={`https://maps.google.com/maps?q=${selectedZone}&z=12&output=embed`}
                style={{width: 400, height: 280, border: 0}}
                title="Zone Map" />
        <ul style={{marginLeft: 16}}>
          {drivers.filter(d => d.zone === selectedZone).map(d => (
            <li key={d.name}>
              {d.name}: ({d.lat.toFixed(4)}, {d.lng.toFixed(4)}) - {d.status}
            </li>
          ))}
        </ul>
      </div>
      <div style={{margin: "30px 0"}}>
        <h3 style={{fontWeight: 600}}>Pay for Delivery</h3>
        <PayGateway gateway="paystack" />
        <PayGateway gateway="ozow" />
      </div>
      <div>
        <h3 style={{fontWeight: 600}}>Partnered Merchants (Demo)</h3>
        <ul>
          <li>Zulu Supermarket (Soweto)</li>
          <li>Khayelitsha Electronics</li>
          <li>Pep Store</li>
        </ul>
      </div>
    </div>
  );
}

// ======= EXPORT BOTH TOGETHER =======
const FinalAppCombined = () => (
  <>
    <App />
    <DemoAddons />
  </>
);

export default FinalAppCombined;

