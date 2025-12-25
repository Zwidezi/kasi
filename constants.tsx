
import React from 'react';
import { Landmark, Incident, SpazaShop } from './types';

export const COLORS = {
  primary: '#f97316', // Orange
  secondary: '#22c55e', // Green
  danger: '#ef4444', // Red
  info: '#3b82f6', // Blue
  dark: '#1f2937', // Dark Gray
};

export const MOCK_LANDMARKS: (Landmark | SpazaShop)[] = [
  {
    id: 'l1',
    name: "Ma-Zulu's Spaza",
    description: "The big yellow building with the green roof near the main rank.",
    category: 'spaza',
    coordinates: { x: 450, y: 300 },
    owner: "Zoleka Zulu",
    isHub: true,
    activeDeliveries: 4
  },
  {
    id: 'l2',
    name: "Green Taxi Rank",
    description: "Primary transport hub for Section B.",
    category: 'transport',
    coordinates: { x: 200, y: 500 },
  },
  {
    id: 'l3',
    name: "The Blue House",
    description: "Behind the spaza shop, has a satellite dish and red gate.",
    category: 'house',
    coordinates: { x: 480, y: 280 },
  },
  {
    id: 'l4',
    name: "Corner Shop Hub",
    description: "Collection point for Amazon & Takealot parcels.",
    category: 'spaza',
    coordinates: { x: 700, y: 650 },
    owner: "Peter Moyo",
    isHub: true,
    activeDeliveries: 12
  }
];

export const MOCK_INCIDENTS: Incident[] = [
  {
    id: 'i1',
    type: 'protest',
    severity: 'high',
    description: "Service delivery protest at the main entrance.",
    location: { x: 100, y: 100 },
    timestamp: Date.now()
  },
  {
    id: 'i2',
    type: 'high-risk',
    severity: 'medium',
    description: "High incident report near the sports ground.",
    location: { x: 800, y: 200 },
    timestamp: Date.now() - 3600000
  }
];
