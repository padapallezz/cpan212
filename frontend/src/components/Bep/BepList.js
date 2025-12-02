import React, { useState } from "react";
import { Link } from "react-router-dom";
import {bepDummy} from "../../data/bepDummy"; //just for testing :))

const BepListPage = () => {
  const [beps, setBeps] = useState(bepDummy);

  const handleDelete = (id) => {
    const updated = beps.filter((bep) => bep.id !== id);
    setBeps(updated);
  };

  return (
    <div>
  
      <Link to="/bep/add" style={{ marginBottom: "15px", display: "inline-block" }}>
        Add New BEP
      </Link>

      <ul>
        {beps.map((bep) => (
          <li key={bep.id} style={{ marginBottom: "10px" }}>
            {bep.name}
            <Link to={`/bep/edit/${bep.id}`} style={{ marginLeft: "10px" }}>
              Edit
            </Link>
            <button onClick={() => handleDelete(bep.id)} style={{ marginLeft: "10px" }}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BepListPage;
