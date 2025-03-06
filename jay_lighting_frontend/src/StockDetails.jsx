import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Employee.css"; // Custom CSS for styling
import Swal from "sweetalert2";

const StockDetails = () => {
  // State management
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  // const [selectedEmployees, setSelectedEmployees] = useState(new Set());
  const [formData, setFormData] = useState({
    id: "",
    item_code: "",
    item_name: "",
    quantity: "",
    rest_quantity: "",
    unit_price_per_day: "",
    bar_code: "",
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8082/products/get");
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Search and Pagination logic
  const filteredProducts = products.filter(
    (product) =>
      product.item_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.bar_code.toString().includes(searchTerm) ||
      product.quantity.toString().includes(searchTerm) ||
      product.rest_quantity.toString().includes(searchTerm) ||
      product.unit_price_per_day.toString().includes(searchTerm)
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission (Add/Edit Product)
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
          await axios.put(
            `http://localhost:8082/products/updateById/${formData.id}`,
            formData
          );
        } else {
          await axios.post("http://localhost:8082/products/add", formData);
        }
        // Refresh product list
        const response = await axios.get("http://localhost:8082/products/get");
        setProducts(response.data);
        Swal.fire(
          "Success!",
          "Product has been saved successfully.",
          "success"
        );
        setShowModal(false); // Close modal
        resetForm();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  // Handle edit product
  const handleEdit = (product) => {
    setFormData(product);
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
        await axios.delete(`http://localhost:8082/products/deleteById/${id}`);
        // Refresh product list
        const response = await axios.get("http://localhost:8082/products/get");
        setProducts(response.data);

        Swal.fire("Deleted!", "The product has been deleted.", "success");
      } catch (err) {
        setError(err.message);
      }
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      id: "",
      item_code: "",
      item_name: "",
      quantity: "",
      rest_quantity: "",
      unit_price_per_day: "",
      bar_code: "",
    });
    setIsEditMode(false);
  };

  // Pagination
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="alert alert-danger">Error: {error}</div>;

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Stock Management</h2>
    
      {/* Search and Add Product Button */}
      <div className="d-flex justify-content-between mb-3">      
        <input
          type="text"
          className="form-control w-25"
          placeholder="Search by Name or Bar C..."
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
          Add Product
        </button>
      </div>

      {/* Product Table */}
      <table className="table table-striped table-hover">
        <thead className="table-dark">
          <tr>
            <th>Item Code</th>
            <th>Item Name</th>
            <th>Quantity</th>
            <th>Rest Quantity</th>
            <th>Unit Price Per Day</th>
            <th>Bar Code</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentProducts.map((product) => (
            <tr key={product.id}>
              <td>{product.item_code}</td>
              <td>{product.item_name}</td>
              <td>{product.quantity}</td>
              <td>{product.rest_quantity}</td>
              <td>{product.unit_price_per_day}</td>
              <td>{product.bar_code}</td>
              <td>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => handleEdit(product)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(product.id)}
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
          {Array.from({
            length: Math.ceil(filteredProducts.length / itemsPerPage),
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

      {/* Add/Edit Product Modal */}
      {showModal && (
        <div
          className="modal"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {isEditMode ? "Edit Product" : "Add Product"}
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
                    <label className="form-label">Item Code</label>
                    <input
                      type="text"
                      className="form-control"
                      name="item_code"
                      value={formData.item_code}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Item Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="item_name"
                      value={formData.item_name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Quantity</label>
                    <input
                      type="number"
                      className="form-control"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Rest Quantity</label>
                    <input
                      type="number"
                      className="form-control"
                      name="rest_quantity"
                      value={formData.rest_quantity}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Unit Price</label>
                    <input
                      type="number"
                      className="form-control"
                      name="unit_price_per_day"
                      value={formData.unit_price_per_day}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Bar Code</label>
                    <input
                      type="number"
                      className="form-control"
                      name="bar_code"
                      value={formData.bar_code}
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
                      {isEditMode ? "Save Changes" : "Add Product"}
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

export default StockDetails;
