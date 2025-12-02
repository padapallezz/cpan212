import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import WhatIfForm from "../components/WhatIf/WhatIfForm";
import {whatIfDummy} from "../data/whatIfDummy";

const WhatIfEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [whatifs, setWhatifs] = useState(whatIfDummy);
  const [current, setCurrent] = useState(null);

  useEffect(() => {
    const w = whatifs.find(w => w.id === parseInt(id));
    if(w) setCurrent(w);
  }, [id, whatifs]);

  const handleEdit = (updated) => {
    setWhatifs(whatifs.map(w => (w.id === parseInt(id) ? {...w, ...updated} : w)));
    navigate("/whatif");
  };

  return (
    <div>
      <h1>Edit Scenario</h1>
      {current && <WhatIfForm initialData={current} onSubmit={handleEdit} />}
    </div>
  );
};

export default WhatIfEditPage;
