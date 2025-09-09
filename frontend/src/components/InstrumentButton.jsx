import React from "react";
import "../styles/InstrumentButton";

function InstrumentButton({ buttonInstrument, handleSetInstrument, Icon }) {
  return (
    <button
      onClick={() => handleSetInstrument(buttonInstrument)}
      className="instrument-button"
    >
      {Icon && <Icon size={20} />}
    </button>
  );
}

export default InstrumentButton;
