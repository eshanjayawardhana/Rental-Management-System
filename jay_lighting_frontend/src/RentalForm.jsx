import React, { useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
// import "./index.css";
import "./RentalForm.css";
import Swal from "sweetalert2";

const RentalForm = () => {
  const initialFormState = {
    date: "",
    name: "",
    address: "",
    nicNo: "",
    email: "",
    phoneNo: "",
    rentalPeriod: "",
    items: [
      {
        id: "",
        barCode: "",
        itemName: "",
        unitPrice: "",
        quantity: "",
      },
    ],
  };

  const [formData, setFormData] = useState(initialFormState);

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const updatedItems = [...formData.items];

    if (name.startsWith("items")) {
      const fieldName = name.split(".")[1];
      updatedItems[index][fieldName] = value;

      if (fieldName === "barCode") {
        if (value.length > 0) {
          fetchProductDetails(value, index);
        } else {
          updatedItems[index] = {
            ...updatedItems[index],
            id: "",
            itemName: "",
            unitPrice: "",
            quantity: "",
          };
        }
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    setFormData((prev) => ({ ...prev, items: updatedItems }));
  };

  const fetchProductDetails = async (barcode, index) => {
    try {
      const response = await axios.get(
        `http://localhost:8082/products/getByBarCode/${barcode}`
      );
      const product = response.data;
      const updatedItems = [...formData.items];

      updatedItems[index] = {
        ...updatedItems[index],
        id: product.id,
        itemName: product.item_name,
        unitPrice: product.unit_price_per_day,
      };

      setFormData((prev) => ({ ...prev, items: updatedItems }));
    } catch (error) {
      console.error("Error fetching product details: ", error);
      // alert("Product not found!");
    }
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: "",
          barCode: "",
          itemName: "",
          unitPrice: "",
          quantity: "",
        },
      ],
    }));
  };

  const resetForm = () => {
    setFormData(initialFormState);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await Swal.fire({
      title: "Are you sure place order?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#A5D56E",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, place it!",
    });

    // Validate all required fields
    const isFormValid =
      formData.date &&
      formData.name &&
      formData.address &&
      formData.nicNo &&
      formData.email &&
      formData.phoneNo &&
      formData.rentalPeriod &&
      formData.items.every(
        (item) => item.id && item.barCode && item.quantity && item.unitPrice
      );

    if (!isFormValid) {
      alert("Please fill in all required fields");
      return;
    }

    // Prepare order data
    const orderData = {
      date: formData.date,
      customerName: formData.name,
      address: formData.address,
      nicNo: formData.nicNo,
      email: formData.email,
      phoneNumber: formData.phoneNo,
      rentalPeriod: parseInt(formData.rentalPeriod),
      orderItems: formData.items.map((item) => ({
        quantity: parseInt(item.quantity),
        product: {
          id: item.id,
          productBarcode: item.barCode,
          productName: item.itemName,
          unitPrice: parseFloat(item.unitPrice),
        },
      })),
    };

    // Submit to backend
    if (result.isConfirmed) {
      axios
        .post("http://localhost:8082/orders/add", orderData)
        .then(() => {
          Swal.fire("Order placed successfully!", "come again");
          // alert("Order placed successfully!");
          resetForm();
        })
        .catch((error) => {
          console.error("Error submitting order:", error);
          alert("Failed to place order. Please try again.");
        });
    }
  };

  // Add this function after the addItem function
const removeItem = (indexToRemove) => {
  if (formData.items.length > 1) {  // Keep at least one item row
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, index) => index !== indexToRemove),
    }));
  }
};

  /////////////////////////  Generate PDF  ////////////////////////////////

  const generatePDF = () => {
    const doc = new jsPDF();
    let yPosition = 20;
    // Format the date
    const date = new Date(formData.date);
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
      ["Customer Name:", formData.name],
      ["Address:", formData.address],
      ["Contact:", formData.phoneNo],
      ["Rental Period:", formData.rentalPeriod + " days"],
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
      head: [
        ["Product Name", "Quantity", "Price/Unit", "Line Total (per day)"],
      ],
      body: formData.items.map((item) => [
        item.itemName,
        item.quantity,
        `LKR ${item.unitPrice}`,
        `LKR ${(item.unitPrice * item.quantity).toFixed(2)}`,
      ]),
      theme: "grid",
    });

    // Calculate totals
    const subtotal = formData.items.reduce(
      (sum, item) =>
        sum + item.unitPrice * item.quantity * formData.rentalPeriod, // Multiply by rental period
      0
    );

    yPosition = doc.autoTable.previous.finalY + 10;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(105, 105, 105);
    doc.text(`Total Amount: LKR ${subtotal.toFixed(2)}`, 20, yPosition);
    // yPosition += 7;
    // doc.text(`Taxes: $${tax.toFixed(2)}`, 20, yPosition);
    // yPosition += 7;
    // doc.text(`Total Amount: $${total.toFixed(2)}`, 20, yPosition);

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
    yPosition += 85;
    doc.setFontSize(10);
    doc.text("DevoPlus solutions | eshan jayawardana", 70, yPosition);

    // Save the PDF
    doc.save("rental-bill.pdf");
  };

  return (
    <div className="container">
      <form className="rental-form" onSubmit={handleSubmit}>
        <h2 className="form-title">Product Rental Form</h2>

        <div className="form-grid">
          {/* Personal Information Fields */}
          {[
            { label: "Rent Date:", name: "date", type: "datetime-local" },
            { label: "Customer Name:", name: "name", type: "text" },
            { label: "Address:", name: "address", type: "text" },
            { label: "National ID:", name: "nicNo", type: "text" },
            { label: "Email:", name: "email", type: "email" },
            { label: "Phone Number:", name: "phoneNo", type: "text" },
            {
              label: "Rental Period (days):",
              name: "rentalPeriod",
              type: "number",
            },
          ].map((field, idx) => (
            <div className="form-group" key={idx}>
              <label>{field.label}</label>
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name]}
                onChange={(e) => handleChange(e, -1)}
                required
                min={field.type === "number" ? "1" : undefined}
                placeholder={field.label}
              />
            </div>
          ))}
        </div>

        <div className="items-section">
          <h3>Rental Items</h3>
          <table className="rental-table">
            <thead>
              <tr>
                <th>Bar Code</th>
                <th>Item Name</th>
                <th>Unit Price</th>
                <th>Quantity</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {formData.items.map((item, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="number"
                      name="items.barCode"
                      value={item.barCode}
                      onChange={(e) => handleChange(e, index)}
                      required
                      placeholder="Scan Barcode"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="items.itemName"
                      value={item.itemName}
                      readOnly
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="items.unitPrice"
                      value={item.unitPrice}
                      readOnly
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="items.quantity"
                      value={item.quantity}
                      min="1"
                      onChange={(e) => handleChange(e, index)}
                      required
                      placeholder="Qty"
                    />
                  </td>
                  <td>
                    {formData.items.length > 1 && (
                      <button
                        type="button"
                        className="btn-remove"
                        onClick={() => removeItem(index)}
                      >
                        ✖
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button type="button" className="add-item-btn" onClick={addItem}>
            + Add Another Item
          </button>
        </div>

        <div className="form-actions">
          <button type="button" className="btn secondary" onClick={resetForm}>
            Reset Form
          </button>
          <button type="submit" className="btn primary">
            Place Order
          </button>
          <button type="button" className="btn secondary" onClick={generatePDF}>
            Download PDF
          </button>
        </div>
      </form>
    </div>
  );
};

export default RentalForm;
