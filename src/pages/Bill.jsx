import React, { useState } from "react";
import axios from "axios";

const Bill = () => {
  const [recordNumber, setRecordNumber] = useState("");
  const [billData, setBillData] = useState(null);
  const [error, setError] = useState("");

  const fetchBill = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/bill/${recordNumber}`
      );
      setBillData(response.data);
      setError("");
    } catch (err) {
      setError("No billing information found for this record number.");
      setBillData(null);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Generate Bill</h2>

      <div className="mb-4">
        <label className="block mb-1">Record Number</label>
        <input
          type="text"
          value={recordNumber}
          onChange={(e) => setRecordNumber(e.target.value)}
          className="border p-2 w-full rounded"
          placeholder="Enter Record Number"
        />
      </div>

      <button
        onClick={fetchBill}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Generate Bill
      </button>

      {error && <p className="text-red-600 mt-4">{error}</p>}

      {billData && (
        <div className="mt-6 border p-4 rounded shadow bg-white">
          <h3 className="text-xl font-semibold mb-2">Car Wash Bill</h3>
          <p>
            <strong>Record Number:</strong> {billData.RecordNumber}
          </p>
          <p>
            <strong>Service Date:</strong>{" "}
            {new Date(billData.ServiceDate).toLocaleDateString()}
          </p>
          <p>
            <strong>Plate Number:</strong> {billData.PlateNumber}
          </p>
          <p>
            <strong>Driver Name:</strong> {billData.DriverName}
          </p>
          <p>
            <strong>Phone Number:</strong> {billData.PhoneNumber}
          </p>
          <p>
            <strong>Package Name:</strong> {billData.PackageName}
          </p>
          <p>
            <strong>Package Description:</strong> {billData.PackageDescription}
          </p>
          <p>
            <strong>Package Price:</strong> {billData.PackagePrice} RWF
          </p>
          <p>
            <strong>Amount Paid:</strong> {billData.AmountPaid} RWF
          </p>
          <p>
            <strong>Payment Date:</strong>{" "}
            {new Date(billData.PaymentDate).toLocaleDateString()}
          </p>
        </div>
      )}
    </div>
  );
};

export default Bill;
