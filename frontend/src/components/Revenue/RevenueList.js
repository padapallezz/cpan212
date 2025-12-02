import React from "react";

const RevenueList = ({ revenues = [], onDelete }) => (
  <div>
    <h2>Revenue List</h2>
    <ul>
      {revenues.map(r => (
        <li key={r._id}>
          {r.name} - {r.amount}{" "}
          <button onClick={() => onDelete(r._id)}>Delete</button>
        </li>
      ))}
    </ul>
  </div>
);

export default RevenueList;
