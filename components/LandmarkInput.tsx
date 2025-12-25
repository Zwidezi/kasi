
import React, { useState } from 'react';
import { Search, Sparkles, MapPin } from 'lucide-react';
import { geminiService } from '../services/geminiService';

interface LandmarkInputProps {
  onParsed: (data: any) => void;
}

const LandmarkInput: React.FC<LandmarkInputProps> = ({ onParsed }) => {
  const [description, setDescription] = useState('');
  const [isParsing, setIsParsing] = useState(false);

  const handleParse = async () => {
    if (!description.trim()) return;
    setIsParsing(true);
    const result = await geminiService.parseLandmarkDescription(description);
    if (result) {
      onParsed(result);
    }
    setIsParsing(false);
  };

  return (
    <div className="w-full space-y-3">
      <label className="block text-sm font-semibold text-slate-700">Where should we deliver?</label>
      <div className="relative group">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g., The green house with a silver gate behind Ma-Zulu's Spaza Shop..."
          className="w-full p-4 pr-12 rounded-xl border-2 border-slate-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all text-sm h-28 resize-none"
        />
        <button
          onClick={handleParse}
          disabled={isParsing || !description}
          className="absolute bottom-4 right-4 p-2 bg-orange-500 text-white rounded-lg shadow-md hover:bg-orange-600 disabled:bg-slate-300 transition-colors"
          title="Analyze description with AI"
        >
          {isParsing ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Sparkles size={20} />
          )}
        </button>
      </div>
      <p className="text-[10px] text-slate-500 flex items-center gap-1 italic">
        <MapPin size={10} /> Street addresses often fail here. Use landmarks!
      </p>
    </div>
  );
};

export default LandmarkInput;
