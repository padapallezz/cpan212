import React from "react";

const ForecastList = ({ forecasts = [], onDelete }) => (
  <div>
    <h2>Forecast List</h2>
    <ul>
      {forecasts.map(f => (
        <li key={f.id}>
          {f.name} - {f.value}{" "}
          <button onClick={() => onDelete(f.id)}>Delete</button>
        </li>
      ))}
    </ul>
  </div>
);
export default ForecastList;