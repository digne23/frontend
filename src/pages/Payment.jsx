import { useState, useEffect } from "react";
import axios from "axios";

export default function Payment() {
  const [payments, setPayments] = useState([]);
  const [serviceRecords, setServiceRecords] = useState([]);
  const [form, setForm] = useState({
    PaymentNumber: "",
    AmountPaid: "",
    PaymentDate: "",
    RecordNumber: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchServiceRecords();
    fetchPayments();
  }, []);

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

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/payment", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPayments(res.data);
    } catch {
      setError("Failed to fetch payments");
    }
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.PaymentNumber) {
      setError("Payment Number is required");
      return;
    }
    if (!form.AmountPaid || isNaN(form.AmountPaid)) {
      setError("Amount Paid must be a number");
      return;
    }
    if (!form.PaymentDate) {
      setError("Payment Date is required");
      return;
    }
    if (!form.RecordNumber) {
      setError("Please select a Service Record");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/payment", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Payment added successfully!");
      setForm({
        PaymentNumber: "",
        AmountPaid: "",
        PaymentDate: "",
        RecordNumber: "",
      });
      fetchPayments();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add payment");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-3xl mb-6">Manage Payments</h1>

      <form
        onSubmit={handleSubmit}
        className="mb-8 bg-white p-6 rounded shadow"
      >
        {error && <p className="text-red-600 mb-3">{error}</p>}
        {success && <p className="text-green-600 mb-3">{success}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            name="PaymentNumber"
            placeholder="Payment Number"
            value={form.PaymentNumber}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="AmountPaid"
            placeholder="Amount Paid"
            value={form.AmountPaid}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />
          <input
            type="date"
            name="PaymentDate"
            value={form.PaymentDate}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />
          <select
            name="RecordNumber"
            value={form.RecordNumber}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          >
            <option value="">Select Service Record</option>
            {serviceRecords.map((sr) => (
              <option key={sr.RecordNumber} value={sr.RecordNumber}>
                {sr.RecordNumber} - {sr.PlateNumber} - {sr.PackageNumber}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Add Payment
        </button>
      </form>

      <h2 className="text-2xl mb-4">Existing Payments</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 p-2">Payment Number</th>
            <th className="border border-gray-300 p-2">Amount Paid (RWF)</th>
            <th className="border border-gray-300 p-2">Payment Date</th>
            <th className="border border-gray-300 p-2">
              Service Record Number
            </th>
          </tr>
        </thead>
        <tbody>
          {payments.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center p-4">
                No payments found.
              </td>
            </tr>
          ) : (
            payments.map((pay) => (
              <tr key={pay.PaymentNumber} className="hover:bg-gray-100">
                <td className="border border-gray-300 p-2">
                  {pay.PaymentNumber}
                </td>
                <td className="border border-gray-300 p-2">{pay.AmountPaid}</td>
                <td className="border border-gray-300 p-2">
                  {new Date(pay.PaymentDate).toLocaleDateString()}
                </td>
                <td className="border border-gray-300 p-2">
                  {pay.RecordNumber}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
