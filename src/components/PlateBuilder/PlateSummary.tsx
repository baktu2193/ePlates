import React from "react";

interface PlateSummaryProps {
  plateNumber: string;
  roadLegalSpacing: boolean;
  frontStyle: string;
  rearStyle: string;
  frontPrice: number;
  rearPrice: number;
}

const PlateSummary: React.FC<PlateSummaryProps> = ({
  plateNumber,
  roadLegalSpacing,
  frontStyle,
  rearStyle,
  frontPrice,
  rearPrice,
}) => {
  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-md max-w-sm mx-auto border border-gray-300">
      {/* Header */}
      <h2 className="text-xl font-bold mb-4 text-gray-800">Your Plates</h2>

      {/* Plate Number and Spacing */}
      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <p className="text-sm font-medium text-gray-600">Registration</p>
          <p className="text-base font-bold text-gray-800">{plateNumber}</p>
        </div>
        <div className="flex justify-between">
          <p className="text-sm font-medium text-gray-600">Spacing</p>
          <p className="text-base font-bold text-gray-800">
            {roadLegalSpacing ? "Road legal" : "Not road legal"}
          </p>
        </div>
      </div>

      {/* Front Plate */}
      <div className="border-t border-gray-300 pt-4 mb-4">
        <h3 className="text-base font-bold text-gray-800 mb-2">Front Plate</h3>
        <div className="flex justify-between text-sm mb-1">
          <p>Style</p>
          <p className="font-bold">{frontStyle}</p>
        </div>
        <div className="flex justify-between text-sm mb-1">
          <p>Size</p>
          <p className="font-bold">Included</p>
        </div>
        <div className="flex justify-between text-sm">
          <p>Price</p>
          <p className="font-bold">£{frontPrice.toFixed(2)}</p>
        </div>
      </div>

      {/* Rear Plate */}
      <div className="border-t border-gray-300 pt-4 mb-4">
        <h3 className="text-base font-bold text-gray-800 mb-2">Rear Plate</h3>
        <div className="flex justify-between text-sm mb-1">
          <p>Style</p>
          <p className="font-bold">{rearStyle}</p>
        </div>
        <div className="flex justify-between text-sm mb-1">
          <p>Size</p>
          <p className="font-bold">Included</p>
        </div>
        <div className="flex justify-between text-sm">
          <p>Price</p>
          <p className="font-bold">£{rearPrice.toFixed(2)}</p>
        </div>
      </div>

      {/* Total */}
      <div className="border-t border-gray-300 pt-4 mb-4">
        <div className="flex justify-between text-lg font-bold text-gray-800">
          <p>Total</p>
          <p>£{(frontPrice + rearPrice).toFixed(2)}</p>
        </div>
      </div>

      {/* Add to Basket Button */}
      <button className="w-full bg-yellow text-black font-bold py-3 rounded hover:bg-yellow/80 transition">
        ADD TO BASKET
      </button>
    </div>
  );
};

export default PlateSummary;
