import React, { useState } from "react";
import BepList from "../components/Bep/BepList";
import {bepDummy} from "../data/bepDummy";

const BepListPage = () => {
  const [beps, setBeps] = useState(bepDummy);

  const handleDelete = (id) => {
    const updated = beps.filter((bep) => bep.id !== id);
    setBeps(updated);
  };

  return (
    <div>
      <h1>BEP List</h1>
      <BepList beps={beps} onDelete={handleDelete} />
    </div>
  );
};

export default BepListPage;
