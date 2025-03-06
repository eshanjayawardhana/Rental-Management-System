import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Employee.css"; // Custom CSS for styling
import Swal from "sweetalert2";


const Employee = () => {
  // State management
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  // const [selectedEmployees, setSelectedEmployees] = useState(new Set());
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    address: "",
    id_number: "",
    phone_no: "",
    email: "",
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Fetch employees
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get("http://localhost:8082/employee/get");
        setEmployees(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  // Search and Pagination logic
  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.id_number.toString().includes(searchTerm)||
      emp.phone_no.toString().includes(searchTerm) ||
      emp.address.toLowerCase().includes(searchTerm.toLowerCase())

  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEmployees = filteredEmployees.slice(indexOfFirstItem, indexOfLastItem);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission (Add/Edit Employee)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await Swal.fire({
          title: "Are you sure?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#A5D56E",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "Yes!",
        });
    if (result.isConfirmed) {
      try {
        if (isEditMode) {
          await axios.put(`http://localhost:8082/employee/updateById/${formData.id}`, formData);
        } else {
          await axios.post("http://localhost:8082/employee/add", formData);
        }
        // Refresh employee list
        const response = await axios.get("http://localhost:8082/employee/get");
        setEmployees(response.data);
        Swal.fire("Success!", "Employee has been saved successfully.", "success");
        setShowModal(false); // Close modal
        resetForm();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  // Handle edit employee
  const handleEdit = (employee) => {
    setFormData(employee);
    setIsEditMode(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
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
        await axios.delete(`http://localhost:8082/employee/deleteById/${id}`);
        // Refresh employee list
        const response = await axios.get("http://localhost:8082/employee/get");
        setEmployees(response.data);
  
        Swal.fire("Deleted!", "The employee has been deleted.", "success");
      } catch (err) {
        setError(err.message);
      }
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      id: "",
      name: "",
      address: "",
      id_number: "",
      phone_no: "",
      email: "",
    });
    setIsEditMode(false);
  };

  // Pagination
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="alert alert-danger">Error: {error}</div>;

  return (
    <div className="container mt-4">
       {/* <h1 className="text-center mb-4">Jayawardana Lighting & Sounds</h1> */}
      <h2 className="text-center mb-4">Employee Management</h2>

      {/* Search and Add Employee Button */}
      <div className="d-flex justify-content-between mb-3">
        <input
          type="text"
          className="form-control w-25"
          placeholder="Search by Name or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className="btn btn-primary"
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
        >
          Add Employee
        </button>
      </div>

      {/* Employee Table */}
      <table className="table table-striped table-hover">
        <thead className="table-dark">
          <tr>
            <th>Name</th>
            <th>Address</th>
            <th>ID Number</th>
            <th>Phone Number</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentEmployees.map((emp) => (
            <tr key={emp.id}>
              <td>{emp.name}</td>
              <td>{emp.address}</td>
              <td>{emp.id_number}</td>
              <td>{emp.phone_no}</td>
              <td>{emp.email}</td>
              <td>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => handleEdit(emp)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(emp.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <nav>
        <ul className="pagination">
          {Array.from({ length: Math.ceil(filteredEmployees.length / itemsPerPage) }).map(
            (_, index) => (
              <li key={index} className="page-item">
                <button
                  className={`page-link ${currentPage === index + 1 ? "active" : ""}`}
                  onClick={() => paginate(index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            )
          )}
        </ul>
      </nav>

      {/* Add/Edit Employee Modal */}
      {showModal && (
        <div className="modal" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {isEditMode ? "Edit Employee" : "Add Employee"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Address</label>
                    <input
                      type="text"
                      className="form-control"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">ID Number</label>
                    <input
                      type="text"
                      className="form-control"
                      name="id_number"
                      value={formData.id_number}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="text"
                      className="form-control"
                      name="phone_no"
                      value={formData.phone_no}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="d-flex justify-content-end">
                    <button
                      type="button"
                      className="btn btn-secondary me-2"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      {isEditMode ? "Save Changes" : "Add Employee"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employee;