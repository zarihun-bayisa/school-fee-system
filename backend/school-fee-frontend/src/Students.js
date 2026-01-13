import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as XLSX from 'xlsx';
import api from "./services/api"; // path must be correct
const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newStudent, setNewStudent] = useState({
    name: "",
    grade: "",
    section: "",
    student_code: "",
  });
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [gradeFilter, setGradeFilter] = useState("");
  const [sectionFilter, setSectionFilter] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const fetchStudents = () => {
    console.log("Fetching students..."); // Add this line
    api.get("/students/")
      .then((res) => {
        setStudents(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching students:", err);
        setStudents([]); // Ensure students is empty in case of error
        if (err.response) {
          console.error("Error data:", err.response.data);
          console.error("Error status:", err.response.status);
        }
        setMessage("Failed to load students. Please check if the backend is running.");
        setLoading(false);
      });
  };
  useEffect(() => {
    fetchStudents();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStudent({ ...newStudent, [name]: value });
  };

  const handleDeleteStudent = (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      api
        .delete(`/students/${id}`)
        .then(() => {
          fetchStudents(); // Refresh list
        })
        .catch((err) => {
          console.error("Error deleting student:", err);
          setMessage("Failed to delete student.");
          setTimeout(() => setMessage(""), 3000);
        });
    }
  };
  const handleAction = (action, student) => {
    if (action === "update") {
      setEditingStudent(student);
      setNewStudent({
        name: student.name,
        grade: student.grade,
        section: student.section,
        student_code: student.student_code,
      });
      setShowForm(true);
    } else if (action === "delete") {
      handleDeleteStudent(student.id);
    } else if (action === "generate") {
      alert(`Generate action for ${student.name}`);
    } else if (action === "sync") {
      alert(`Sync action for ${student.name}`);
    }
  };

  const handleAddStudent = () => {
    setMessage("");
    if (editingStudent) {
      console.log("Updating student..."); // Add this line
      // Update
      api.put(`/students/${editingStudent.id}`, newStudent)
        .then(() => {
          setNewStudent({ name: "", grade: "", section: "", student_code: "" });
          setMessage("Student updated successfully!");
          setShowForm(false);
          setEditingStudent(null);
          fetchStudents(); // Refresh list
          setTimeout(() => setMessage(""), 3000);
        })
        .catch((err) => {
          console.error("Error updating student:", err);
          setMessage("Failed to update student.");
          setTimeout(() => setMessage(""), 3000);
        });
    } else {
      // Add
      console.log("Adding student..."); // Add this line
      api.post("/students/", newStudent)
        .then(() => {
          setNewStudent({ name: "", grade: "", section: "", student_code: "" });
          setMessage("Student added successfully!");
          setShowForm(false);
          fetchStudents(); // Refresh list
          setTimeout(() => setMessage(""), 3000);
        })
        .catch((err) => {
          console.error("Error adding student:", err);
          setMessage("Failed to add student.");
          setTimeout(() => setMessage(""), 3000);
        });
    }
  };

  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(students);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
    XLSX.writeFile(workbook, "students.xlsx");
  };

  const handleBatchImport = () => {
    if (!selectedFile) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      // Skip header row and map to student objects
      const studentsData = jsonData.slice(1).map(row => ({
        name: (row[0] || '').toString().trim(),
        grade: (row[1] || '').toString().trim(),
        section: (row[2] || '').toString().trim(),
        student_code: (row[3] || '').toString().trim()
      })).filter(student =>
        student.name !== '' &&
        student.grade !== '' &&
        student.section !== '' &&
        student.student_code !== ''
      ); // Filter out rows with any empty required fields
      console.log('Parsed students data:', studentsData); // Debug log
      if (studentsData.length === 0) {
        setMessage("No valid student data found in the file. Please ensure all columns (Name, Grade, Section, Student Code) have values.");
        setTimeout(() => setMessage(""), 5000);
        return;
      }

      // Send batch to backend
      console.log('Sending data to backend:', studentsData); // Debug log
      api.post("/students/batch", studentsData)
        .then((response) => {
          console.log('Backend response:', response); // Debug log
          setMessage(`${studentsData.length} students added successfully!`);
          setSelectedFile(null);
          document.getElementById('batch-file-input').value = '';
          fetchStudents();
          setTimeout(() => setMessage(""), 3000);
        })
        .catch((err) => {
          console.error("Error adding batch students:", err);
          console.error("Error response:", err.response); // Debug log
          let errorMessage = "Failed to add batch students.";
          if (err.response?.data?.detail) {
            errorMessage = err.response.data.detail;
          } else if (!err.response) {
            errorMessage = "Cannot connect to server. Is the backend running?";
          }
          setMessage(errorMessage);
          setTimeout(() => setMessage(""), 5000);
        });
    };
    reader.readAsArrayBuffer(selectedFile);
  };

  if (showForm) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="card shadow p-4" style={{ width: '100%', maxWidth: '400px' }}>
          <div className="card-body">
          <h2 className="text-center mb-4">
            {editingStudent ? "Update Student" : "Add New Student"}
          </h2>
          {message && (
            <p style={{
              color: message.includes("successfully") ? "#28a745" : "#dc3545",
              fontWeight: "bold",
              textAlign: 'center',
              backgroundColor: message.includes("successfully") ? "#d4edda" : "#f8d7da",
              padding: '10px',
              borderRadius: '5px',
              marginBottom: '20px'
            }}>
              {message}
            </p>
          )}
          <div className="d-flex flex-column gap-3">
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Name"
              value={newStudent.name}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="grade"
              className="form-control"
              placeholder="Grade"
              value={newStudent.grade}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="section"
              className="form-control"
              placeholder="Section"
              value={newStudent.section}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="student_code"
              className="form-control"
              placeholder="Student Code"
              value={newStudent.student_code}
              onChange={handleInputChange}
              required
            />
            <div className="d-flex gap-2">
              <button
                onClick={handleAddStudent}
                className={`btn flex-grow-1 ${editingStudent ? 'btn-warning' : 'btn-success'}`}
              >
                {editingStudent ? "Update Student" : "Add Student"}
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingStudent(null);
                  setNewStudent({ name: "", grade: "", section: "", student_code: "" });
                }}
                className="btn btn-secondary flex-grow-1"
              >
                Cancel
              </button>
            </div>
          </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <nav
        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(0)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(-240px)'}
        className="bg-white shadow-sm d-flex flex-column p-3"
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          width: '250px',
          zIndex: 1000,
          transform: 'translateX(-240px)',
          transition: 'transform 0.3s ease',
      }}>
        <h3 className="text-center mb-4 text-dark">Menu</h3>
        <Link to="/dashboard" className="nav-link text-dark d-flex align-items-center p-2 mb-2">
          <span style={{ marginRight: '10px' }}>🏠</span> Dashboard
        </Link>
        <Link to="/manage-users" className="nav-link text-dark d-flex align-items-center p-2 mb-2">
        <span style={{ marginRight: '10px' }}>👤</span> Manage Users
        </Link>
      </nav>
      <div className="flex-grow-1 p-4">
      <h1 className="text-center mb-4">Student Management</h1>
      {message && (
        <p style={{
          color: message.includes("successfully") ? "#28a745" : "#dc3545",
          fontWeight: "bold",
          textAlign: 'center',
          backgroundColor: message.includes("successfully") ? "#d4edda" : "#f8d7da",
          padding: '10px',
          borderRadius: '5px',
          marginBottom: '20px'
        }}>
          {message}
        </p>
      )}

      {loading ? (
        <p style={{ textAlign: 'center', padding: '20px', fontSize: '18px' }}>Loading students...</p>
      ) : (
      <>
      <div className="d-flex justify-content-center gap-2 mb-4 flex-wrap">
        <input
          type="text"
          className="form-control w-auto"
          placeholder="Search by ID or Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="form-select w-auto"
          value={gradeFilter}
          onChange={(e) => setGradeFilter(e.target.value)}
        >
          <option value="">All Grades</option>
          {[...new Set(students.map(s => s.grade))].map(grade => (
            <option key={grade} value={grade}>{grade}</option>
          ))}
        </select>
        <select
          className="form-select w-auto"
          value={sectionFilter}
          onChange={(e) => setSectionFilter(e.target.value)}
        >
          <option value="">All Sections</option>
          {[...new Set(students.map(s => s.section))].map(section => (
            <option key={section} value={section}>{section}</option>
          ))}
        </select>
        <select
          className="form-select w-auto bg-success text-white"
          onChange={(e) => {
            if (e.target.value === 'single') {
              setShowForm(true);
            } else if (e.target.value === 'batch') {
              document.getElementById('batch-file-input').click();
            }
            e.target.value = ''; // Reset dropdown
          }}
        >
          <option value="">Add Students</option>
          <option value="single">Add Single Student</option>
          <option value="batch">Add Batch (Excel)</option>
        </select>
        <button
          onClick={handleExport}
          className="btn btn-primary"
        >
          Export
        </button>
        <input
          type="file"
          id="batch-file-input"
          accept=".xlsx,.xls"
          style={{ display: 'none' }}
          onChange={(e) => setSelectedFile(e.target.files[0])}
        />
        {selectedFile && (
          <div className="d-inline-flex align-items-center gap-2 ms-2">
            <span style={{ marginRight: '10px', color: '#333' }}>
              Selected: {selectedFile.name}
            </span>
            <button
              onClick={handleBatchImport}
              className="btn btn-success"
            >
              Import
            </button>
            <button
              onClick={() => {
                setSelectedFile(null);
                document.getElementById('batch-file-input').value = '';
              }}
              className="btn btn-danger"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="card shadow-sm">
        <div className="table-responsive">
        <table className="table table-striped table-hover mb-0">
          <thead>
            <tr className="bg-primary text-white">
              <th>ID</th>
              <th>Name</th>
              <th>Grade</th>
              <th>Section</th>
              <th>Student Code</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students
              .filter(student =>
                (student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    student.id?.toString().includes(searchTerm) ||
                    student.grade?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    student.section?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    student.student_code?.toLowerCase().includes(searchTerm.toLowerCase())) &&
                  (gradeFilter === "" || student.grade === gradeFilter) &&
                (sectionFilter === "" || student.section === sectionFilter)
              )
              .map((student, index) => (
              <tr key={student.id}>
                <td>{student.id}</td>
                <td>{student.name}</td>
                <td>{student.grade}</td>
                <td>{student.section}</td>
                <td>{student.student_code}</td>
                <td>
                  <select
                    className="form-select form-select-sm"
                    onChange={(e) => {
                      handleAction(e.target.value, student);
                      e.target.value = ""; // Reset select
                    }}
                  >
                    <option value="">Actions</option>
                    <option value="update">Update</option>
                    <option value="delete">Delete</option>
                    <option value="generate">Generate</option>
                    <option value="sync">Sync</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
      </>
      )}
      </div>
    </div>
  );
};
export default Students;