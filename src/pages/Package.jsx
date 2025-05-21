import { useState, useEffect } from "react";
import axios from "axios";

export default function Package() {
  const [packages, setPackages] = useState([]);
  const [form, setForm] = useState({
    PackageNumber: "",
    PackageName: "",
    PackageDescription: "",
    PackagePrice: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/package", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPackages(res.data);
    } catch (err) {
      setError("Failed to fetch packages");
    }
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate price is number
    if (isNaN(form.PackagePrice)) {
      setError("Package Price must be a number");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/package", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Package added successfully!");
      setForm({
        PackageNumber: "",
        PackageName: "",
        PackageDescription: "",
        PackagePrice: "",
      });
      fetchPackages();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add package");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl mb-6">Manage Packages</h1>

      <form
        onSubmit={handleSubmit}
        className="mb-8 bg-white p-6 rounded shadow"
      >
        {error && <p className="text-red-600 mb-3">{error}</p>}
        {success && <p className="text-green-600 mb-3">{success}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            name="PackageNumber"
            placeholder="Package Number"
            value={form.PackageNumber}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="PackageName"
            placeholder="Package Name"
            value={form.PackageName}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="PackageDescription"
            placeholder="Package Description"
            value={form.PackageDescription}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="PackagePrice"
            placeholder="Package Price (RWF)"
            value={form.PackagePrice}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Add Package
        </button>
      </form>

      <h2 className="text-2xl mb-4">Existing Packages</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 p-2">Package Number</th>
            <th className="border border-gray-300 p-2">Package Name</th>
            <th className="border border-gray-300 p-2">Description</th>
            <th className="border border-gray-300 p-2">Price (RWF)</th>
          </tr>
        </thead>
        <tbody>
          {packages.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center p-4">
                No packages found.
              </td>
            </tr>
          ) : (
            packages.map((pkg) => (
              <tr key={pkg.PackageNumber} className="hover:bg-gray-100">
                <td className="border border-gray-300 p-2">
                  {pkg.PackageNumber}
                </td>
                <td className="border border-gray-300 p-2">
                  {pkg.PackageName}
                </td>
                <td className="border border-gray-300 p-2">
                  {pkg.PackageDescription}
                </td>
                <td className="border border-gray-300 p-2">
                  {pkg.PackagePrice}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
