import { useState } from "react";

export default function RevenueForm({ onSubmit, onCancel, initialData }) {
  const [month, setMonth] = useState(initialData?.month || "");
  const [year, setYear] = useState(initialData?.year || "");
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!month || month < 1 || month > 12) errs.month = "Month must be 1–12.";
    if (!year || year < 2000) errs.year = "Year must be >= 2000.";
    if (!file) errs.file = "CSV file is required.";
    else if (!file.name.endsWith(".csv")) errs.file = "Must be a .csv file.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const formData = new FormData();
    formData.append("month", month);
    formData.append("year", year);
    formData.append("file", file);

    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow p-4 rounded-lg flex flex-wrap items-end gap-4"
    >
      <div className="flex flex-col">
        <label className="font-medium">Month</label>
        <input
          type="number"
          className="border w-24 px-3 py-2 rounded"
          placeholder="1-12"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        />
        {errors.month && <p className="text-red-500 text-sm">{errors.month}</p>}
      </div>

      <div className="flex flex-col">
        <label className="font-medium">Year</label>
        <input
          type="number"
          className="border w-28 px-3 py-2 rounded"
          placeholder="2024"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
        {errors.year && <p className="text-red-500 text-sm">{errors.year}</p>}
      </div>

      <div className="flex flex-col">
        <label className="font-medium">CSV File</label>
        <input
          type="file"
          accept=".csv"
          className="border px-3 py-2 rounded w-100"
          onChange={(e) => setFile(e.target.files[0])}
        />
        {errors.file && <p className="text-red-500 text-sm">{errors.file}</p>}
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        {initialData ? "Update" : "Upload"}
      </button>
      {onCancel && (
        <button
          type="button"
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
          onClick={onCancel}
        >
          Cancel
        </button>
      )}
    </form>
  );
}
