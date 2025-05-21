import { useState, useEffect } from "react";
import axios from "axios";

export default function ServicePackage() {
  const [serviceRecords, setServiceRecords] = useState([]);
  const [cars, setCars] = useState([]);
  const [packages, setPackages] = useState([]);
  const [form, setForm] = useState({
    RecordNumber: "",
    ServiceDate: "",
    PlateNumber: "",
    PackageNumber: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchCars();
    fetchPackages();
    fetchServiceRecords();
  }, []);

  const fetchCars = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/car", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCars(res.data);
    } catch {
      setError("Failed to fetch cars");
    }
  };

  const fetchPackages = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/package", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPackages(res.data);
    } catch {
      setError("Failed to fetch packages");
    }
  };

  const fetchServiceRecords = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/servicepackage", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setServiceRecords(res.data);
    } catch {
      setError("Failed to fetch service records");
    }
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.RecordNumber) {
      setError("Record Number is required");
      return;
    }

    if (!form.ServiceDate) {
      setError("Service Date is required");
      return;
    }

    if (!form.PlateNumber) {
      setError("Please select a car");
      return;
    }

    if (!form.PackageNumber) {
      setError("Please select a package");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/servicepackage", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Service record added successfully!");
      setForm({
        RecordNumber: "",
        ServiceDate: "",
        PlateNumber: "",
        PackageNumber: "",
      });
      fetchServiceRecords();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add service record");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-3xl mb-6">Manage Service Packages</h1>

      <form
        onSubmit={handleSubmit}
        className="mb-8 bg-white p-6 rounded shadow"
      >
        {error && <p className="text-red-600 mb-3">{error}</p>}
        {success && <p className="text-green-600 mb-3">{success}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            name="RecordNumber"
            placeholder="Record Number"
            value={form.RecordNumber}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />

          <input
            type="date"
            name="ServiceDate"
            value={form.ServiceDate}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />

          <select
            name="PlateNumber"
            value={form.PlateNumber}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          >
            <option value="">Select Car (Plate Number)</option>
            {cars.map((car) => (
              <option key={car.PlateNumber} value={car.PlateNumber}>
                {car.PlateNumber} - {car.DriverName}
              </option>
            ))}
          </select>

          <select
            name="PackageNumber"
            value={form.PackageNumber}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          >
            <option value="">Select Package</option>
            {packages.map((pkg) => (
              <option key={pkg.PackageNumber} value={pkg.PackageNumber}>
                {pkg.PackageName} - {pkg.PackagePrice} RWF
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Add Service Record
        </button>
      </form>

      <h2 className="text-2xl mb-4">Existing Service Records</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 p-2">Record Number</th>
            <th className="border border-gray-300 p-2">Service Date</th>
            <th className="border border-gray-300 p-2">Plate Number</th>
            <th className="border border-gray-300 p-2">Package Number</th>
          </tr>
        </thead>
        <tbody>
          {serviceRecords.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center p-4">
                No service records found.
              </td>
            </tr>
          ) : (
            serviceRecords.map((sr) => (
              <tr key={sr.RecordNumber} className="hover:bg-gray-100">
                <td className="border border-gray-300 p-2">
                  {sr.RecordNumber}
                </td>
                <td className="border border-gray-300 p-2">
                  {new Date(sr.ServiceDate).toLocaleDateString()}
                </td>
                <td className="border border-gray-300 p-2">{sr.PlateNumber}</td>
                <td className="border border-gray-300 p-2">
                  {sr.PackageNumber}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
