import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RevenueForm from "../components/Revenue/RevenueForm";
import { revenueDummy } from "../data/revenueDummy";

const RevenueAddPage = () => {
  const [revenues, setRevenues] = useState(revenueDummy);
  const navigate = useNavigate();

  const handleAdd = (newRevenue) => {
    newRevenue.id = revenues.length + 1;
    setRevenues([...revenues, newRevenue]);
    navigate("/revenue");
  };

  return (
    <div>
      <h1>Add Revenue</h1>
      <RevenueForm onSubmit={handleAdd} />
    </div>
  );
};

export default RevenueAddPage;
