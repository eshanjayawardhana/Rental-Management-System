import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import "./RentalDetails.css";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useNavigate } from 'react-router-dom';

const RentalDetails = () => {
  // State management
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "asc",
  });
  const [editingRental, setEditingRental] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [viewingRental, setViewingRental] = useState(null); // State for viewing details
  const [showViewModal, setShowViewModal] = useState(false); // State to control view modal visibility

  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/rentalform');
  };
  // Fetch rental details
  useEffect(() => {
    const fetchRentalDetails = async () => {
      try {
        const response = await axios.get("http://localhost:8082/orders/getAll");
        setRentals(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchRentalDetails();
  }, []);

  // Handle search
  const filteredRentals = rentals.filter(
    (rental) =>
      rental.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rental.nicNo.includes(searchTerm)
  );

  // Handle sorting
  const sortedRentals = filteredRentals.sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  // Handle pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRentals = sortedRentals.slice(indexOfFirstItem, indexOfLastItem);

  // Handle row selection
  const handleRowSelect = (id) => {
    const newSelection = new Set(selectedRows);
    newSelection.has(id) ? newSelection.delete(id) : newSelection.add(id);
    setSelectedRows(newSelection);
  };

  // Handle delete selected rows
  const handleDeleteSelected = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await Promise.all(
          Array.from(selectedRows).map((id) =>
            axios.delete(`http://localhost:8082/orders/deleteById/${id}`)
          )
        );
        // Refresh rental list
        const response = await axios.get("http://localhost:8082/orders/getAll");
        setRentals(response.data);
        Swal.fire("Deleted!", "The employee has been deleted.", "success");
        setSelectedRows(new Set());
      } catch (err) {
        setError(err.message);
      }
    }
  };

  // Handle sorting configuration
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Pagination
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle edit button click
  const handleEditClick = (rental) => {
    setEditingRental(rental);
    setShowEditModal(true);
  };

  // Handle update rental order
  const handleUpdateRental = async (updatedRental) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#A5D56E",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, update it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.put(
          `http://localhost:8082/orders/updateById/${updatedRental.id}`,
          updatedRental
        );
        const response = await axios.get("http://localhost:8082/orders/getAll");
        setRentals(response.data);
        Swal.fire("Updated!", "The Order has been updated.", "success");
        setShowEditModal(false);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  // Handle show details button click
  const handleRentalOrderById = (rental) => {
    setViewingRental(rental);
    setShowViewModal(true);
  };

  const updateOrderItemQuantity = (orderItems, orderItemId, newQuantity) => {
    return orderItems.map((item) =>
      item.orderItemId === orderItemId
        ? { ...item, quantity: parseInt(newQuantity, 10) } // Ensure quantity is a number
        : item
    );
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="alert alert-danger">Error: {error}</div>;

  /////////////////////////  Generate PDF  ////////////////////////////////

  const generatePDF = (rental) => {
    const doc = new jsPDF();
    let yPosition = 20;

    // Format the date
    const date = new Date(rental.date);
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    };
    const formattedDate = date.toLocaleString("en-US", options);

    // Add the "th" suffix to the day
    const day = date.getDate();
    const suffix =
      day === 1 || day === 21 || day === 31
        ? "st"
        : day === 2 || day === 22
        ? "nd"
        : day === 3 || day === 23
        ? "rd"
        : "th";
    const readableDate = formattedDate.replace(/\d+/, `${day}${suffix}`);

    doc.setFontSize(18);
    doc.text("Rental Bill", 85, yPosition);
    yPosition += 15;

    doc.setFontSize(12);
    const details = [
      ["Date:", readableDate],
      ["Customer Name:", rental.customerName],
      ["Address:", rental.address],
      ["Contact:", rental.phoneNumber],
      ["Rental Period:", `${rental.rentalPeriod} days`],
    ];

    // Add labels with bold and blue color
    details.forEach(([label, value]) => {
      // Set font to bold and color to blue for the label
      doc.setFont("helvetica", "bold");
      doc.setTextColor(105, 105, 105);
      doc.text(label, 20, yPosition);

      // Calculate the position for the value
      const labelWidth = doc.getTextWidth(label);
      const valueX = 17 + labelWidth + 5; // Add some padding

      // Set font to normal and color to black for the value
      doc.setFont("helvetica", "normal");
      doc.setTextColor(128, 128, 128); // Black color
      doc.text(value, valueX, yPosition);

      yPosition += 7; // Move to the next line
    });

    // Add table header
    yPosition += 10;
    doc.autoTable({
      startY: yPosition,
      head: [["Product Name", "Quantity", "Price/Unit", "Line Total"]],
      body: rental.orderItems.map((item) => [
        item.product.item_name,
        item.quantity,
        `LKR ${item.unit_price_per_day.toFixed(2)}`,
        `LKR ${(item.unit_price_per_day * item.quantity).toFixed(2)}`,
      ]),
      theme: "grid",
    });

    // Total
    yPosition = doc.autoTable.previous.finalY + 10;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(105, 105, 105);
    doc.text(
      `Total Amount: LKR ${rental.totalPrice.toFixed(2)}`,
      20,
      yPosition
    );

    // Add terms and conditions
    yPosition += 25;
    doc.setFontSize(10);
    doc.text("Terms and Conditions:", 20, yPosition);
    yPosition += 5;
    doc.text("• Products must be returned in good condition.", 25, yPosition);
    yPosition += 5;
    doc.text("• Late returns will incur additional charges.", 25, yPosition);

    yPosition += 15;

    // **Add Company Seal & Customer Signature Section**
    const lineStartX = 15;
    const lineEndX = 100;
    const sectionY = yPosition + 20;

    doc.setLineWidth(0.5);
    doc.setLineDash([3, 2]); // Dotted line

    // **Company Seal**
    doc.line(lineStartX, sectionY, lineEndX, sectionY);
    doc.text("Company Signature", lineStartX, sectionY + 7);

    // **Customer Signature**
    doc.line(lineStartX + 100, sectionY, lineEndX + 100, sectionY);
    doc.text("Customer Signature", lineStartX + 100, sectionY + 7);

    doc.setLineDash([]); // Reset line style

    yPosition += 50;
    doc.setFontSize(10);
    doc.text("Thank you for your business!", 80, yPosition);
    yPosition += 5;
    doc.setFontSize(6);
    doc.text("Jayawardana Lighting & Sounds", 89, yPosition);

    yPosition += 75;
    doc.setFontSize(10);
    doc.text("DevoPlus solutions | eshan jayawardana", 70, yPosition);

    // Save the PDF
    doc.save("rental-bill.pdf");
  };

  return (
    <div className="container-fluid mt-4">
      <h2 className="text-center mb-4">Rental Details</h2>
      {/* Search and Delete Selected */}
      <div className="d-flex justify-content-between mb-3">
        <input
          type="text"
          className="form-control w-25"
          placeholder="Search by Name or National ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleClick}>Add Order</button>

        {selectedRows.size > 0 && (
          <button className="btn btn-danger" onClick={handleDeleteSelected}>
            Delete Selected ({selectedRows.size})
          </button>
        )}
      </div>

      {/* Rental Details Table */}
      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th></th>
            <th onClick={() => requestSort("date")}>
              Order Date{" "}
              {sortConfig.key === "date"
                ? sortConfig.direction === "asc"
                  ? "↑"
                  : "↓"
                : ""}
            </th>
            <th>Customer Name</th>
            <th>Address</th>
            <th>National ID</th>
            <th>Email</th>
            <th>Rental Period</th>
            <th>Total Price</th>
            <th>Actions</th>
            <th>Invoice</th>
          </tr>
        </thead>
        <tbody>
          {currentRentals.map((rental) => (
            <tr key={rental.id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedRows.has(rental.id)}
                  onChange={() => handleRowSelect(rental.id)}
                />
              </td>
              <td>{format(new Date(rental.date), "yyyy-MM-dd, h:mm a")}</td>
              <td>{rental.customerName}</td>
              <td>{rental.address}</td>
              <td>{rental.nicNo}</td>
              <td>{rental.email}</td>
              <td>{rental.rentalPeriod} days</td>
              <td>LKR {rental.totalPrice.toFixed(2)}</td>
              <td>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => handleEditClick(rental)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-info"
                  onClick={() => handleRentalOrderById(rental)}
                >
                  Show Details
                </button>
              </td>
              <td>
                <button
                  type="button"
                  className="btn btn-sm btn-success"
                  onClick={() => generatePDF(rental)}
                >
                  View Invoice
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <nav>
        <ul className="pagination">
          {Array.from({
            length: Math.ceil(filteredRentals.length / itemsPerPage),
          }).map((_, index) => (
            <li key={index} className="page-item">
              <button
                className={`page-link ${
                  currentPage === index + 1 ? "active" : ""
                }`}
                onClick={() => paginate(index + 1)}
              >
                {index + 1}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Edit Rental Order</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdateRental(editingRental);
              }}
            >
              <div className="form-group">
                <label>Customer Name:</label>
                <input
                  type="text"
                  value={editingRental.customerName}
                  onChange={(e) =>
                    setEditingRental({
                      ...editingRental,
                      customerName: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label>Address:</label>
                <input
                  type="text"
                  value={editingRental.address}
                  onChange={(e) =>
                    setEditingRental({
                      ...editingRental,
                      address: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label>National ID:</label>
                <input
                  type="text"
                  value={editingRental.nicNo}
                  onChange={(e) =>
                    setEditingRental({
                      ...editingRental,
                      nicNo: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  value={editingRental.email}
                  onChange={(e) =>
                    setEditingRental({
                      ...editingRental,
                      email: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label>Rental Period (days):</label>
                <input
                  type="number"
                  value={editingRental.rentalPeriod}
                  onChange={(e) =>
                    setEditingRental({
                      ...editingRental,
                      rentalPeriod: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label>Phone Number:</label>
                <input
                  type="text"
                  value={editingRental.phoneNumber}
                  onChange={(e) =>
                    setEditingRental({
                      ...editingRental,
                      phoneNumber: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label>Total Price:</label>
                <input
                  type="number"
                  value={editingRental.totalPrice}
                  onChange={(e) =>
                    setEditingRental({
                      ...editingRental,
                      totalPrice: e.target.value,
                    })
                  }
                  readOnly
                />
              </div>
              <h3>Rented Items</h3>
              <div className="rented-items">
                {editingRental.orderItems.map((item) => (
                  <div key={item.orderItemId} className="rented-item">
                    <p>
                      <strong>Item Name:</strong> {item.product.item_name}
                    </p>
                    <p>
                      <strong>Quantity: </strong>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => {
                          const updatedOrderItems = updateOrderItemQuantity(
                            editingRental.orderItems,
                            item.orderItemId,
                            e.target.value
                          );
                          setEditingRental({
                            ...editingRental,
                            orderItems: updatedOrderItems,
                          });
                        }}
                      />
                    </p>
                    <p>
                      <strong>Unit Price per Day:</strong> LKR{" "}
                      {item.unit_price_per_day.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="modal-actions">
                <button type="submit" className="btn btn-primary">
                  Save
                </button>
                <button
                  type="button"
                  className="btn btn-secondary ms-2"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {showViewModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Rental Order Details</h2>
            <div className="form-group">
              <label>
                <strong>Customer Name:</strong>
              </label>
              <p>{viewingRental.customerName}</p>
            </div>
            <div className="form-group">
              <label>
                <strong>Address:</strong>
              </label>
              <p>{viewingRental.address}</p>
            </div>
            <div className="form-group">
              <label>
                <strong>National ID:</strong>
              </label>
              <p>{viewingRental.nicNo}</p>
            </div>
            <div className="form-group">
              <label>
                <strong>Email:</strong>
              </label>
              <p>{viewingRental.email}</p>
            </div>
            <div className="form-group">
              <label>
                <strong>Rental Period (days):</strong>
              </label>
              <p>{viewingRental.rentalPeriod}</p>
            </div>
            <div className="form-group">
              <label>
                <strong>Total Price:</strong>
              </label>
              <p>LKR {viewingRental.totalPrice.toFixed(2)}</p>
            </div>
            <div className="form-group">
              <label>
                <strong>Phone Number:</strong>
              </label>
              <p>{viewingRental.phoneNumber}</p>
            </div>
            <h3>Rented Items</h3>
            <div className="rented-items">
              {viewingRental.orderItems.map((item) => (
                <div key={item.orderItemId} className="rented-item">
                  <p>
                    <strong>Item Name:</strong> {item.product.item_name}
                  </p>
                  <p>
                    <strong>Quantity:</strong> {item.quantity}
                  </p>
                  <p>
                    <strong>Price per Day:</strong> LKR{" "}
                    {item.unit_price_per_day.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowViewModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RentalDetails;
