import React from "react";

interface Props {
  baseImage: string;
  overlayText: Record<string, string>;
}

const PreviewCanvas: React.FC<Props> = ({ baseImage, overlayText }) => {
  return (
    <div className="relative w-64 h-64">
      <img
        src={baseImage}
        alt="Preview"
        className="w-full h-full object-cover rounded"
      />
      {Object.entries(overlayText).map(([key, text]) => (
        <span
          key={key}
          className="absolute text-white font-bold text-xl"
          style={{ top: "10%", left: "10%" }}
        >
          {text}
        </span>
      ))}
    </div>
  );
};

export default PreviewCanvas;
