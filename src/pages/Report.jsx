import { useState, useEffect } from "react";
import axios from "axios";

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [date, setDate] = useState("");
  const [error, setError] = useState("");

  const fetchReports = async (reportDate) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:5000/api/reports/daily?date=${reportDate}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setReports(res.data);
      setError("");
    } catch {
      setError("Failed to fetch reports");
      setReports([]);
    }
  };

  useEffect(() => {
    // Optionally fetch today’s reports by default
    const today = new Date().toISOString().slice(0, 10);
    setDate(today);
    fetchReports(today);
  }, []);

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    setDate(selectedDate);
    fetchReports(selectedDate);
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl mb-6">Daily Reports</h1>

      <div className="mb-6">
        <label className="block mb-2 font-semibold" htmlFor="report-date">
          Select Date:
        </label>
        <input
          id="report-date"
          type="date"
          value={date}
          onChange={handleDateChange}
          className="border p-2 rounded"
        />
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 p-2">Plate Number</th>
            <th className="border border-gray-300 p-2">Package Name</th>
            <th className="border border-gray-300 p-2">Package Description</th>
            <th className="border border-gray-300 p-2">Amount Paid (RWF)</th>
            <th className="border border-gray-300 p-2">Payment Date</th>
          </tr>
        </thead>
        <tbody>
          {reports.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center p-4">
                No records found for this date.
              </td>
            </tr>
          ) : (
            reports.map((item, idx) => (
              <tr key={idx} className="hover:bg-gray-100">
                <td className="border border-gray-300 p-2">
                  {item.PlateNumber}
                </td>
                <td className="border border-gray-300 p-2">
                  {item.PackageName}
                </td>
                <td className="border border-gray-300 p-2">
                  {item.PackageDescription}
                </td>
                <td className="border border-gray-300 p-2">
                  {item.AmountPaid}
                </td>
                <td className="border border-gray-300 p-2">
                  {new Date(item.PaymentDate).toLocaleDateString()}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
