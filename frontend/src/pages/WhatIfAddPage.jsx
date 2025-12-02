import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import WhatIfForm from "../components/WhatIf/WhatIfForm";
import { whatIfDummy } from "../data/whatIfDummy";

const WhatIfAddPage = () => {
  const [whatifs, setWhatifs] = useState(whatIfDummy);
  const navigate = useNavigate();

  const handleAdd = (newScenario) => {
    newScenario.id = whatifs.length + 1;
    setWhatifs([...whatifs, newScenario]);
    navigate("/whatif");
  };

  return (
    <div>
      <h1>Add Scenario</h1>
      <WhatIfForm onSubmit={handleAdd} />
    </div>
  );
};

export default WhatIfAddPage;
