import React from 'react';
import type { PredictionResponse } from '../types';

export function ResultsDisplay({ data }: { data: PredictionResponse }) {
  const totalPredictions = data.predictions.length;
  const ddosCount = data.predictions.filter(p => p.startsWith('DDOS')).length;
  const normalCount = totalPredictions - ddosCount;
  
  const ddosPercentage = (ddosCount / totalPredictions) * 100;
  const normalPercentage = (normalCount / totalPredictions) * 100;

  return (
    <div className="space-y-6">
      <div className="neumorphic-inset rounded-xl p-6">
        <h2 className="text-xl font-semibold text-[#2A2F35] mb-4">Detection Results</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Predictions ({totalPredictions} total)</span>
            <div className="flex items-center space-x-4">
              <span className="text-[#7FE7D9]">{ddosCount} DDoS</span>
              <span className="text-[#7FE7D9]">{normalCount} Normal</span>
            </div>
          </div>

          <div className="mt-4">
            <div className="neumorphic-inset rounded-lg p-4 max-h-40 overflow-y-auto">
              <div className="space-y-2">
                {data.predictions.map((prediction, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-gray-600">Packet {index + 1}</span>
                    <span className={`font-medium ${
                      prediction.startsWith('DDOS') 
                        ? 'text-red-500' 
                        : 'text-[#7FE7D9]'
                    }`}>
                      {prediction}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="neumorphic-inset rounded-xl p-4">
          <span className="block text-[#7FE7D9] text-2xl font-bold">
            {normalPercentage.toFixed(1)}%
          </span>
          <span className="text-gray-600">Normal</span>
        </div>
        <div className="neumorphic-inset rounded-xl p-4">
          <span className="block text-red-500 text-2xl font-bold">
            {ddosPercentage.toFixed(1)}%
          </span>
          <span className="text-gray-600">DDoS</span>
        </div>
        <div className="neumorphic-inset rounded-xl p-4">
          <span className="block text-[#7FE7D9] text-2xl font-bold">
            {totalPredictions}
          </span>
          <span className="text-gray-600">Total Packets</span>
        </div>
      </div>
    </div>
  );
}