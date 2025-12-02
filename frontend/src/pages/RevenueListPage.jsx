import React, { useState } from "react";
import { Link } from "react-router-dom";
import { revenueDummy } from "../data/revenueDummy";
import RevenueList from "../components/Revenue/RevenueList";

const RevenueListPage = () => {
  const [revenues, setRevenues] = useState(revenueDummy || []);

  const handleDelete = (id) => setRevenues(revenues.filter(r => r.id !== id));

  return (
    <div>
      <h1>Revenue List</h1>
      <Link to="/revenue/add">Add New Revenue</Link>
      <RevenueList revenues={revenues} onDelete={handleDelete} />
    </div>
  );
};

export default RevenueListPage;
