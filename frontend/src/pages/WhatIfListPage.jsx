import React, { useState } from "react";
import { Link } from "react-router-dom";
import { whatIfDummy } from "../data/whatIfDummy";
import WhatIfList from "../components/WhatIf/WhatIfList";

const WhatIfListPage = () => {
  const [whatifs, setWhatifs] = useState(whatIfDummy);

  const handleDelete = (id) => setWhatifs(whatifs.filter(w => w.id !== id));

  return (
    <div>
      <h1>What-If List</h1>
      <Link to="/whatif/add">Add New Scenario</Link>
      <WhatIfList whatifs={whatifs} onDelete={handleDelete} />
    </div>
  );
};

export default WhatIfListPage;
