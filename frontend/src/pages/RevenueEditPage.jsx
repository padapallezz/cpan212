import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import RevenueForm from "../components/Revenue/RevenueForm";
import { revenueDummy } from "../data/revenueDummy";

const RevenueEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [revenues, setRevenues] = useState(revenueDummy);
  const [current, setCurrent] = useState(null);

  useEffect(() => {
    const r = revenues.find(r => r.id === parseInt(id));
    if(r) setCurrent(r);
  }, [id, revenues]);

  const handleEdit = (updated) => {
    setRevenues(revenues.map(r => (r.id === parseInt(id) ? {...r, ...updated} : r)));
    navigate("/revenue");
  };

  return (
    <div>
      <h1>Edit Revenue</h1>
      {current && <RevenueForm initialData={current} onSubmit={handleEdit} />}
    </div>
  );
};

export default RevenueEditPage;
