import { useState, useEffect } from "react";
import axios from "axios";

export default function Car() {
  const [cars, setCars] = useState([]);
  const [form, setForm] = useState({
    PlateNumber: "",
    CarType: "",
    CarSize: "",
    DriverName: "",
    PhoneNumber: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch existing cars on load
  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/car", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCars(res.data);
    } catch (err) {
      setError("Failed to fetch cars");
    }
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/car", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Car added successfully!");
      setForm({
        PlateNumber: "",
        CarType: "",
        CarSize: "",
        DriverName: "",
        PhoneNumber: "",
      });
      fetchCars();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add car");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl mb-6">Manage Cars</h1>

      <form
        onSubmit={handleSubmit}
        className="mb-8 bg-white p-6 rounded shadow"
      >
        {error && <p className="text-red-600 mb-3">{error}</p>}
        {success && <p className="text-green-600 mb-3">{success}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            name="PlateNumber"
            placeholder="Plate Number"
            value={form.PlateNumber}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="CarType"
            placeholder="Car Type"
            value={form.CarType}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="CarSize"
            placeholder="Car Size"
            value={form.CarSize}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="DriverName"
            placeholder="Driver Name"
            value={form.DriverName}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="PhoneNumber"
            placeholder="Phone Number"
            value={form.PhoneNumber}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Add Car
        </button>
      </form>

      <h2 className="text-2xl mb-4">Existing Cars</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 p-2">Plate Number</th>
            <th className="border border-gray-300 p-2">Car Type</th>
            <th className="border border-gray-300 p-2">Car Size</th>
            <th className="border border-gray-300 p-2">Driver Name</th>
            <th className="border border-gray-300 p-2">Phone Number</th>
          </tr>
        </thead>
        <tbody>
          {cars.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center p-4">
                No cars found.
              </td>
            </tr>
          ) : (
            cars.map((car) => (
              <tr key={car.PlateNumber} className="hover:bg-gray-100">
                <td className="border border-gray-300 p-2">
                  {car.PlateNumber}
                </td>
                <td className="border border-gray-300 p-2">{car.CarType}</td>
                <td className="border border-gray-300 p-2">{car.CarSize}</td>
                <td className="border border-gray-300 p-2">{car.DriverName}</td>
                <td className="border border-gray-300 p-2">
                  {car.PhoneNumber}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
