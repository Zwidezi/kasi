
import React, { useState, useRef } from 'react';
import { MapPin, AlertTriangle, Store, Navigation, ShieldCheck, Crosshair, Map as MapIcon } from 'lucide-react';
import { Landmark, Incident, SpazaShop, Delivery } from '../types';
import { COLORS } from '../constants';

interface TownshipMapProps {
  landmarks: (Landmark | SpazaShop)[];
  incidents: Incident[];
  activeDelivery?: Delivery | null;
  onPinClick: (item: Landmark | Incident) => void;
  onMapClick?: (coords: { x: number; y: number }) => void;
  isOffline?: boolean;
}

const TownshipMap: React.FC<TownshipMapProps> = ({ landmarks, incidents, activeDelivery, onPinClick, onMapClick, isOffline }) => {
  const [viewBox, setViewBox] = useState('0 0 1000 800');
  const svgRef = useRef<SVGSVGElement>(null);

  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current || !onMapClick) return;
    const pt = svgRef.current.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const transformed = pt.matrixTransform(svgRef.current.getScreenCTM()?.inverse());
    onMapClick({ x: transformed.x, y: transformed.y });
  };

  return (
    <div className="relative w-full h-full bg-slate-100 rounded-3xl overflow-hidden border-2 border-slate-200 shadow-inner group">
      {/* Map Background Simulation */}
      <svg
        ref={svgRef}
        viewBox={viewBox}
        onClick={handleSvgClick}
        className="w-full h-full cursor-crosshair active:cursor-grabbing transition-opacity duration-300"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#cbd5e1" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Roads Simulation */}
        <path d="M 0 400 L 1000 400" stroke="#94a3b8" strokeWidth="16" strokeLinecap="round" opacity="0.6" />
        <path d="M 500 0 L 500 800" stroke="#94a3b8" strokeWidth="16" strokeLinecap="round" opacity="0.6" />
        <path d="M 200 0 L 200 800" stroke="#94a3b8" strokeWidth="10" strokeDasharray="15,10" opacity="0.4" />

        {/* Route Visualization */}
        {activeDelivery && (
          <>
            <path 
              d={`M ${activeDelivery.pickupCoords.x} ${activeDelivery.pickupCoords.y} L ${activeDelivery.dropoffCoords.x} ${activeDelivery.dropoffCoords.y}`}
              stroke={COLORS.primary}
              strokeWidth="4"
              strokeDasharray="8,8"
              fill="none"
              className="animate-[dash_20s_linear_infinite]"
            />
            <circle cx={activeDelivery.pickupCoords.x} cy={activeDelivery.pickupCoords.y} r="8" fill={COLORS.primary} />
            <circle cx={activeDelivery.dropoffCoords.x} cy={activeDelivery.dropoffCoords.y} r="8" fill={COLORS.secondary} />
          </>
        )}

        {/* Render Landmarks */}
        {landmarks.map((l) => (
          <g
            key={l.id}
            onClick={(e) => {
              e.stopPropagation();
              onPinClick(l);
            }}
            className="cursor-pointer transition-transform hover:scale-110"
          >
            <circle cx={l.coordinates.x} cy={l.coordinates.y} r="22" fill="white" className="shadow-lg" />
            <circle cx={l.coordinates.x} cy={l.coordinates.y} r="18" fill={l.category === 'spaza' ? COLORS.primary : COLORS.info} opacity="0.1" />
            <foreignObject x={l.coordinates.x - 12} y={l.coordinates.y - 12} width="24" height="24">
              {l.category === 'spaza' ? (
                <Store size={24} color={COLORS.primary} />
              ) : (
                <MapPin size={24} color={COLORS.info} />
              )}
            </foreignObject>
            <text x={l.coordinates.x} y={l.coordinates.y + 35} textAnchor="middle" className="text-[11px] font-bold fill-slate-800 pointer-events-none">{l.name}</text>
          </g>
        ))}

        {/* Render Incidents */}
        {incidents.map((i) => (
          <g
            key={i.id}
            onClick={(e) => {
              e.stopPropagation();
              onPinClick(i);
            }}
            className="cursor-pointer"
          >
            <circle cx={i.location.x} cy={i.location.y} r="25" fill={COLORS.danger} className="animate-pulse" opacity="0.2" />
            <foreignObject x={i.location.x - 12} y={i.location.y - 12} width="24" height="24">
              <AlertTriangle size={24} color={COLORS.danger} />
            </foreignObject>
          </g>
        ))}
      </svg>

      {/* Map Overlays */}
      <div className="absolute top-4 left-4 space-y-2 pointer-events-none">
        {isOffline && (
          <div className="bg-blue-600 text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xl animate-bounce">
            <ShieldCheck size={14} /> Offline Mode Active
          </div>
        )}
        <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-xl text-[10px] space-y-2 max-w-[180px] pointer-events-auto">
          <h4 className="font-black border-b pb-2 mb-2 uppercase tracking-tighter flex items-center gap-1.5 text-slate-400">
            <MapIcon size={12} /> Map Index
          </h4>
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-orange-500"></div> <span>Spaza Drop Hub</span></div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500"></div> <span>User Landmark</span></div>
          <div className="flex items-center gap-2 text-red-600 font-black uppercase"><AlertTriangle size={12} /> <span>Stay Away</span></div>
        </div>
      </div>

      <div className="absolute bottom-6 right-6 flex flex-col gap-3">
        <button className="p-4 bg-white rounded-2xl shadow-2xl hover:bg-slate-50 transition-all border border-slate-200 hover:-translate-y-1">
          <Crosshair size={24} className="text-blue-600" />
        </button>
        <button className="p-4 bg-slate-900 rounded-2xl shadow-2xl hover:bg-slate-800 transition-all border border-slate-700 hover:-translate-y-1">
          <Navigation size={24} className="text-white" />
        </button>
      </div>

      <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -100;
          }
        }
      `}</style>
    </div>
  );
};

export default TownshipMap;
