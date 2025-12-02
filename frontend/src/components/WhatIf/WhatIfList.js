import React from "react";

const WhatIfList = ({ whatifs = [], onDelete }) => { // <-- set default []
  return (
    <div>
      
      <ul>
        {whatifs.map(w => (
          <li key={w._id}>
            {w.name} - {w.value}
            <button onClick={() => onDelete(w._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WhatIfList;
