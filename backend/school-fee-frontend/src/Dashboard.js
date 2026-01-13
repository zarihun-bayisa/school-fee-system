import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Students from './Students';
import * as XLSX from 'xlsx';
import api from './services/api';

function ManageUsers({ users, setUsers }) {
  const [newUser, setNewUser] = useState({ name: '', fatherName: '', phoneNumber: '', email: '', role: 'Student' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);

  const handleSaveUser = (e) => {
    e.preventDefault();
    if (newUser.name && newUser.email) {
      if (editingUserId) {
        setUsers(users.map(user => user.id === editingUserId ? { ...user, ...newUser } : user));
        setEditingUserId(null);
      } else {
        // The default password for a newly created user is 'password'
        setUsers([...users, { ...newUser, id: Date.now(), status: 'Active', password: 'password' }]);
      }
      setNewUser({ name: '', fatherName: '', phoneNumber: '', email: '', role: 'Student' });
      setShowAddForm(false);
    }
  };

  const deleteUser = (userId) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  const toggleUserStatus = (userId) => {
    setUsers(users.map(user =>
      user.id === userId
        ? { ...user, status: user.status === 'Active' ? 'Deactive' : 'Active' }
        : user
    ));
  };

  const handleEdit = (user) => {
    setNewUser({ name: user.name, fatherName: user.fatherName, phoneNumber: user.phoneNumber, email: user.email, role: user.role });
    setEditingUserId(user.id);
    setShowAddForm(true);
  };

  const handleResetPassword = (userId) => {
    if (window.confirm("Are you sure you want to reset this user's password to 'password'?")) {
      setUsers(users.map(user =>
        user.id === userId ? { ...user, password: 'password' } : user
      ));
      alert(`Password for user ID: ${userId} has been reset to 'password'.`);
    }
  };

  return (
    <div>
      <h2>Manage Users</h2>
      {showAddForm ? (
        <div className="card shadow-sm p-4 mb-4">
          <h3 className="mb-3">{editingUserId ? 'Edit User' : 'Add New User'}</h3>
          <form onSubmit={handleSaveUser}>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Father Name"
                value={newUser.fatherName}
                onChange={(e) => setNewUser({ ...newUser, fatherName: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Phone Number"
                value={newUser.phoneNumber}
                onChange={(e) => setNewUser({ ...newUser, phoneNumber: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <select
                className="form-select"
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              >
                <option value="Student">Student</option>
                <option value="Teacher">Teacher</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-success">{editingUserId ? 'Update User' : 'Add User'}</button>
              <button type="button" className="btn btn-secondary" onClick={() => { setShowAddForm(false); setEditingUserId(null); setNewUser({ name: '', fatherName: '', phoneNumber: '', email: '', role: 'Student' }); }}>Cancel</button>
            </div>
          </form>
        </div>
      ) : (
        <div className="card shadow-sm p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3>User List</h3>
            <button className="btn btn-primary" onClick={() => { setShowAddForm(true); setEditingUserId(null); setNewUser({ name: '', fatherName: '', phoneNumber: '', email: '', role: 'Student' }); }}>Add New User</button>
          </div>
          <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>Name</th>
                <th>Father Name</th>
                <th>Phone Number</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.fatherName}</td>
                  <td>{user.phoneNumber}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <span className={`badge ${user.status === 'Active' ? 'bg-success' : 'bg-danger'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex gap-1">
                    <button className="btn btn-sm btn-info text-white" onClick={() => handleEdit(user)}>Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={() => deleteUser(user.id)}>Delete</button>
                    <button className="btn btn-sm btn-warning" onClick={() => toggleUserStatus(user.id)}>
                      {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                    </button>
                    <button className="btn btn-sm btn-secondary" onClick={() => handleResetPassword(user.id)}>Reset Pass</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}
    </div>
  );
}

function PaymentPeriods({ periods, setPeriods, academicYears, setAcademicYears }) {
  const [newPeriod, setNewPeriod] = useState({ startDate: '', endDate: '', shortName: '', description: '', academicYear: '' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPeriodId, setEditingPeriodId] = useState(null);
  const [newAcademicYear, setNewAcademicYear] = useState({ shortName: '', description: '' });
  const [showAddYearForm, setShowAddYearForm] = useState(false);
  const [editingYearId, setEditingYearId] = useState(null);

  const handleSaveAcademicYear = () => {
    if (newAcademicYear.shortName && newAcademicYear.description) {
      if (editingYearId) {
        setAcademicYears(academicYears.map(year => year.id === editingYearId ? { ...newAcademicYear, id: editingYearId } : year));
        setEditingYearId(null);
      } else {
        setAcademicYears([...academicYears, { ...newAcademicYear, id: Date.now() }]);
      }
      setNewAcademicYear({ shortName: '', description: '' });
      setShowAddYearForm(false);
    } else {
      alert('Please fill in all fields for Academic Year');
    }
  };

  const handleEditAcademicYear = (year) => {
    setNewAcademicYear({ shortName: year.shortName, description: year.description });
    setEditingYearId(year.id);
    setShowAddYearForm(true);
  };

  const deleteAcademicYear = (id) => {
    setAcademicYears(academicYears.filter(year => year.id !== id));
  };

  const handleSavePeriod = () => {
    if (newPeriod.startDate && newPeriod.endDate && newPeriod.shortName && newPeriod.description && newPeriod.academicYear) {
      if (editingPeriodId) {
        setPeriods(periods.map(period => period.id === editingPeriodId ? { ...newPeriod, id: editingPeriodId } : period));
        setEditingPeriodId(null);
      } else {
        setPeriods([...periods, { ...newPeriod, id: Date.now() }]);
      }
      setNewPeriod({ startDate: '', endDate: '', shortName: '', description: '', academicYear: '' });
      setShowAddForm(false);
    } else {
      alert('Please fill in all fields');
    }
  };

  const handleEditPeriod = (period) => {
    setNewPeriod({ startDate: period.startDate, endDate: period.endDate, shortName: period.shortName, description: period.description, academicYear: period.academicYear });
    setEditingPeriodId(period.id);
    setShowAddForm(true);
  };

  const deletePeriod = (id) => {
    setPeriods(periods.filter(period => period.id !== id));
  };

  return (
    <div>
      <h2>Payment Periods & Academic Years</h2>
      
      <div className="card shadow-sm p-4 mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3>Academic Years</h3>
          {!showAddYearForm && !editingYearId && (
            <button className="btn btn-primary" onClick={() => { setShowAddYearForm(true); setEditingYearId(null); setNewAcademicYear({ shortName: '', description: '' }); }}>Add Academic Year</button>
          )}
        </div>
        {showAddYearForm && (
          <div className="row g-2 mb-3 align-items-center">
            <div className="col-auto"><input type="text" className="form-control" placeholder="Short Name (e.g. 2016)" value={newAcademicYear.shortName} onChange={(e) => setNewAcademicYear({ ...newAcademicYear, shortName: e.target.value })} /></div>
            <div className="col"><input type="text" className="form-control" placeholder="Description (e.g. School year of 2016)" value={newAcademicYear.description} onChange={(e) => setNewAcademicYear({ ...newAcademicYear, description: e.target.value })} /></div>
            <div className="col-auto"><button className="btn btn-success" onClick={handleSaveAcademicYear}>{editingYearId ? 'Update' : 'Save'}</button></div>
            <div className="col-auto"><button className="btn btn-secondary" onClick={() => { setShowAddYearForm(false); setEditingYearId(null); setNewAcademicYear({ shortName: '', description: '' }); }}>Cancel</button></div>
          </div>
        )}
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Short Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {academicYears.map(year => (
              <tr key={year.id}>
                <td>{year.shortName}</td>
                <td>{year.description}</td>
                <td>
                  <div className="d-flex gap-2">
                  <button className="btn btn-sm btn-info text-white" onClick={() => handleEditAcademicYear(year)}>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => deleteAcademicYear(year.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {academicYears.length === 0 && !showAddYearForm && <tr><td colSpan="3" className="text-center">No academic years found.</td></tr>}
          </tbody>
        </table>
      </div>

      <div className="card shadow-sm p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3>Payment Periods List</h3>
          {!showAddForm && !editingPeriodId && (
            <button className="btn btn-primary" onClick={() => { setShowAddForm(true); setEditingPeriodId(null); setNewPeriod({ startDate: '', endDate: '', shortName: '', description: '', academicYear: '' }); }}>Add New Payment Period</button>
          )}
        </div>
        <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>Academic Year</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Short Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {showAddForm && (
              <tr className="table-active">
                <td>
                  <select
                    className="form-select form-select-sm"
                    value={newPeriod.academicYear}
                    onChange={(e) => setNewPeriod({ ...newPeriod, academicYear: e.target.value })}
                  >
                    <option value="" disabled>Select Academic Year</option>
                    {academicYears.map(year => (
                      <option key={year.id} value={year.shortName}>{year.shortName}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    type="date"
                    className="form-control form-control-sm"
                    value={newPeriod.startDate}
                    onChange={(e) => setNewPeriod({ ...newPeriod, startDate: e.target.value })}
                  />
                </td>
                <td>
                  <input
                    type="date"
                    className="form-control form-control-sm"
                    value={newPeriod.endDate}
                    onChange={(e) => setNewPeriod({ ...newPeriod, endDate: e.target.value })}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Short Name"
                    value={newPeriod.shortName}
                    onChange={(e) => setNewPeriod({ ...newPeriod, shortName: e.target.value })}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Description"
                    value={newPeriod.description}
                    onChange={(e) => setNewPeriod({ ...newPeriod, description: e.target.value })}
                  />
                </td>
                <td>
                  <div className="d-flex gap-1">
                  <button className="btn btn-sm btn-success" onClick={handleSavePeriod}>{editingPeriodId ? 'Update' : 'Save'}</button>
                  <button className="btn btn-sm btn-secondary" onClick={() => { setShowAddForm(false); setEditingPeriodId(null); setNewPeriod({ startDate: '', endDate: '', shortName: '', description: '', academicYear: '' }); }}>Cancel</button>
                  </div>
                </td>
              </tr>
            )}
            {periods.length > 0 ? (
              periods.map(period => (
                <tr key={period.id}>
                  <td>{period.academicYear || 'N/A'}</td>
                  <td>{new Date(period.startDate).toLocaleDateString()}</td>
                  <td>{new Date(period.endDate).toLocaleDateString()}</td>
                  <td>{period.shortName}</td>
                  <td>{period.description}</td>
                  <td>
                    <div className="d-flex gap-1">
                    <button className="btn btn-sm btn-info text-white" onClick={() => handleEditPeriod(period)}>Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={() => deletePeriod(period.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              !showAddForm && (
                <tr>
                  <td colSpan="6" className="text-center">No payment periods found.</td>
                </tr>
              )
            )}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}

function Attendance() {
  const [students, setStudents] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceData, setAttendanceData] = useState(() => {
    const saved = localStorage.getItem('attendanceData');
    return saved ? JSON.parse(saved) : {};
  });
  const [currentAttendance, setCurrentAttendance] = useState({});

  useEffect(() => {
    api.get('/students/')
      .then(res => setStudents(res.data))
      .catch(err => console.error("Error fetching students:", err));
  }, []);

  useEffect(() => {
    if (attendanceData[date]) {
      setCurrentAttendance(attendanceData[date]);
    } else {
      const initial = {};
      students.forEach(s => initial[s.id] = 'Present');
      setCurrentAttendance(initial);
    }
  }, [date, attendanceData, students]);

  const handleStatusChange = (studentId, status) => {
    setCurrentAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSave = () => {
    const updated = { ...attendanceData, [date]: currentAttendance };
    setAttendanceData(updated);
    localStorage.setItem('attendanceData', JSON.stringify(updated));
    alert('Attendance saved successfully!');
  };

  return (
    <div>
      <h2>Attendance Management</h2>
      <div className="card shadow-sm p-4">
        <div className="mb-4" style={{ maxWidth: '300px' }}>
          <label className="form-label fw-bold">Select Date</label>
          <input type="date" className="form-control" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Grade</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student.id}>
                  <td>{student.student_code}</td>
                  <td>{student.name}</td>
                  <td>{student.grade}</td>
                  <td>
                    <div className="btn-group" role="group">
                      <input type="radio" className="btn-check" name={`status-${student.id}`} id={`p-${student.id}`} autoComplete="off" checked={currentAttendance[student.id] === 'Present'} onChange={() => handleStatusChange(student.id, 'Present')} />
                      <label className="btn btn-outline-success btn-sm" htmlFor={`p-${student.id}`}>Present</label>
                      <input type="radio" className="btn-check" name={`status-${student.id}`} id={`a-${student.id}`} autoComplete="off" checked={currentAttendance[student.id] === 'Absent'} onChange={() => handleStatusChange(student.id, 'Absent')} />
                      <label className="btn btn-outline-danger btn-sm" htmlFor={`a-${student.id}`}>Absent</label>
                      <input type="radio" className="btn-check" name={`status-${student.id}`} id={`l-${student.id}`} autoComplete="off" checked={currentAttendance[student.id] === 'Late'} onChange={() => handleStatusChange(student.id, 'Late')} />
                      <label className="btn btn-outline-warning btn-sm" htmlFor={`l-${student.id}`}>Late</label>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3">
          <button className="btn btn-primary" onClick={handleSave}>Save Attendance</button>
        </div>
      </div>
    </div>
  );
}

function Transactions({ generatedFees }) {
  const [students, setStudents] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    status: '',
    grade: ''
  });

  useEffect(() => {
    api.get('/students/')
      .then(res => setStudents(res.data))
      .catch(err => console.error("Error fetching students for transactions:", err));
  }, []);

  const getStudentName = (code) => {
    const student = students.find(s => s.student_code === code);
    return student ? student.name : '';
  };
  
  const getStudentGrade = (code) => {
    const student = students.find(s => s.student_code === code);
    return student ? student.grade : '';
  };

  const uniqueGrades = [...new Set(students.map(s => s.grade).filter(Boolean))].sort();

  const filteredData = generatedFees.filter(fee => {
    const feeDate = new Date(fee.id);
    const start = filters.startDate ? new Date(filters.startDate) : null;
    const end = filters.endDate ? new Date(filters.endDate) : null;

    if (start && feeDate < start) return false;
    if (end) {
        const e = new Date(end);
        e.setHours(23, 59, 59, 999);
        if (feeDate > e) return false;
    }

    const grade = fee.grade || getStudentGrade(fee.studentCode);
    if (filters.grade && grade !== filters.grade) return false;

    if (filters.status) {
        if (filters.status === 'Paid' && fee.status !== 'Paid') return false;
        if (filters.status === 'Unpaid' && fee.status !== 'Generated') return false;
        if (filters.status === 'Paid with Penalty') {
            if (fee.status !== 'Paid' || !fee.penalty || fee.penalty <= 0) return false;
        }
        if (filters.status === 'Paid Manually') {
             if (fee.status !== 'Paid') return false;
        }
    }

    return true;
  });

  const totalAmount = filteredData.reduce((sum, fee) => sum + parseFloat(fee.amount || 0) + (fee.penalty || 0), 0);

  const handlePrintReceipt = () => {
    if (!selectedTransaction) return;
    const printWindow = window.open('', '_blank');
    const studentName = getStudentName(selectedTransaction.studentCode);
    const total = parseFloat(selectedTransaction.amount || 0) + (selectedTransaction.penalty || 0);
    const paidAmount = selectedTransaction.paidAmount || total; // Default to total if full payment
    const balance = selectedTransaction.balance || 0;

    printWindow.document.write(`
      <html>
        <head>
          <title>Receipt #${selectedTransaction.id}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
            .info { margin-bottom: 20px; }
            .table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            .table th, .table td { border: 1px solid #ddd; padding: 10px; text-align: left; }
            .total { font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>SCHOOL MANAGEMENT SYSTEM</h2>
            <h3>Payment Receipt</h3>
          </div>
          <div class="info">
            <p><strong>Receipt No:</strong> ${selectedTransaction.id}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
            <p><strong>Student:</strong> ${studentName} (${selectedTransaction.studentCode})</p>
            <p><strong>Grade:</strong> ${selectedTransaction.grade || getStudentGrade(selectedTransaction.studentCode)}</p>
          </div>
          <table class="table">
            <tr><th>Description</th><th>Amount</th></tr>
            <tr><td>School Fees (${selectedTransaction.paymentPeriod})</td><td>${parseFloat(selectedTransaction.amount).toFixed(2)}</td></tr>
            <tr><td>Penalty</td><td>${(selectedTransaction.penalty || 0).toFixed(2)}</td></tr>
            <tr class="total"><td>Total Due</td><td>${total.toFixed(2)}</td></tr>
            <tr><td>Amount Paid</td><td>${parseFloat(paidAmount).toFixed(2)}</td></tr>
            <tr><td>Balance</td><td>${parseFloat(balance).toFixed(2)}</td></tr>
          </table>
          <div style="margin-top: 50px; text-align: right;">
            <p>_________________________</p>
            <p>Authorized Signature</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div>
      <h2>Transactions Report</h2>
      {selectedTransaction && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', 
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1050
        }}>
          <div className="card shadow p-4" style={{ maxWidth: '500px', width: '90%' }}>
            <h3 className="mb-3">Transaction Details</h3>
            <div style={{ display: 'grid', gap: '10px' }}>
                <div><strong>Transaction ID:</strong> {selectedTransaction.id}</div>
                <div><strong>Date:</strong> {new Date(selectedTransaction.id).toLocaleString()}</div>
                <div><strong>Student Name:</strong> {getStudentName(selectedTransaction.studentCode)}</div>
                <div><strong>Student Code:</strong> {selectedTransaction.studentCode}</div>
                <div><strong>Grade:</strong> {selectedTransaction.grade || getStudentGrade(selectedTransaction.studentCode)}</div>
                <div><strong>Status:</strong> {selectedTransaction.status}</div>
                <div><strong>Payment Period:</strong> {selectedTransaction.paymentPeriod}</div>
                <hr style={{ margin: '10px 0', border: '0', borderTop: '1px solid #eee' }} />
                <div><strong>Amount:</strong> {selectedTransaction.amount}</div>
                <div><strong>Penalty:</strong> {selectedTransaction.penalty || 0}</div>
                <div><strong>Paid:</strong> {selectedTransaction.paidAmount || (parseFloat(selectedTransaction.amount || 0) + (selectedTransaction.penalty || 0))}</div>
                <div><strong>Balance:</strong> {selectedTransaction.balance || 0}</div>
                <div style={{ fontSize: '1.1em', fontWeight: 'bold' }}><strong>Total Due:</strong> {parseFloat(selectedTransaction.amount || 0) + (selectedTransaction.penalty || 0)}</div>
            </div>
            <div style={{ marginTop: '20px', textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button className="btn btn-primary" onClick={handlePrintReceipt}>Print Receipt</button>
                <button className="btn btn-secondary" onClick={() => setSelectedTransaction(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
      <div className="card shadow-sm p-3 mb-4">
        <div className="row g-3 align-items-end">
        <div className="col-md-2">
            <label className="form-label">Status</label>
            <select 
                className="form-select"
                value={filters.status} 
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
                <option value="">All Statuses</option>
                <option value="Paid">Paid</option>
                <option value="Unpaid">Unpaid</option>
                <option value="Paid with Penalty">Paid with Penalty</option>
                <option value="Paid Manually">Paid Manually</option>
            </select>
        </div>
        <div className="col-md-2">
            <label className="form-label">Grade</label>
            <select 
                className="form-select"
                value={filters.grade} 
                onChange={(e) => setFilters({ ...filters, grade: e.target.value })}
            >
                <option value="">All Grades</option>
                {uniqueGrades.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
        </div>
        <div className="col-md-3">
            <label className="form-label">Start Date</label>
            <input 
                type="date" 
                className="form-control"
                value={filters.startDate} 
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
            />
        </div>
        <div className="col-md-3">
            <label className="form-label">End Date</label>
            <input 
                type="date" 
                className="form-control"
                value={filters.endDate} 
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
            />
        </div>
        <div className="col-md-2">
            <button className="btn btn-secondary w-100" onClick={() => setFilters({ startDate: '', endDate: '', status: '', grade: '' })}>Clear</button>
        </div>
        </div>
      </div>

      <div className="card shadow-sm p-4">
        <div className="mb-3 fw-bold">Total Amount: {totalAmount.toFixed(2)}</div>
        <div className="table-responsive">
        <table className="table table-striped table-hover">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Student Name</th>
                    <th>Grade</th>
                    <th>Status</th>
                    <th>Amount</th>
                    <th>Penalty</th>
                    <th>Total</th>
                    <th>Details</th>
                </tr>
            </thead>
            <tbody>
                {filteredData.map(fee => (
                    <tr key={fee.id}>
                        <td>{new Date(fee.id).toLocaleDateString()}</td>
                        <td>{getStudentName(fee.studentCode)}</td>
                        <td>{fee.grade || getStudentGrade(fee.studentCode)}</td>
                        <td>
                            <span className={`badge ${fee.status === 'Paid' ? 'bg-success' : 'bg-warning text-dark'}`}>
                                {fee.status === 'Generated' ? 'Unpaid' : fee.status}
                            </span>
                        </td>
                        <td>{fee.amount}</td>
                        <td>{fee.penalty || 0}</td>
                        <td>{parseFloat(fee.amount) + (fee.penalty || 0)}</td>
                        <td>
                            <button className="btn btn-sm btn-info text-white" onClick={() => setSelectedTransaction(fee)}>Detail</button>
                        </td>
                    </tr>
                ))}
                {filteredData.length === 0 && <tr><td colSpan="8" className="text-center">No transactions found.</td></tr>}
            </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}

function SchoolFees({ periods, generatedFees, setGeneratedFees, feeHeads }) {
  const [feeData, setFeeData] = useState({ studentCode: '', amount: '', paymentPeriod: '', grade: '', feeHead: '' });
  const [filters, setFilters] = useState({ academicYear: '', grade: '', paymentPeriod: '', status: '', search: '' });
  const [students, setStudents] = useState([]);
  const [generationMode, setGenerationMode] = useState('none'); // 'none', 'single', 'bulk'
  const [bulkData, setBulkData] = useState([]);
  const [selectedBulkPeriods, setSelectedBulkPeriods] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');

  useEffect(() => {
    api.get('/students/')
      .then(res => setStudents(res.data))
      .catch(err => console.error("Error fetching students for fees:", err));
  }, []);

  const handleGenerateSingleFee = (e) => {
    e.preventDefault();
    if (feeData.studentCode && feeData.amount && feeData.paymentPeriod) {
      const selectedPeriod = periods.find(p => p.id.toString() === feeData.paymentPeriod);
      const newFee = {
        ...feeData,
        id: Date.now(),
        status: 'Generated',
        paymentPeriod: selectedPeriod ? selectedPeriod.shortName : 'N/A',
        penalty: 0,
        feeHead: feeData.feeHead || 'General'
      };
      setGeneratedFees([...generatedFees, newFee]);
      setFeeData({ studentCode: '', amount: '', paymentPeriod: '', grade: '', feeHead: '' });
      setGenerationMode('none');
      alert('Fee generated successfully!');
    }
  };

  const handleConfirmPayment = (e) => {
    e.preventDefault();
    if (!selectedFee || !paymentAmount) return;
    
    const amountToPay = parseFloat(paymentAmount);
    if (isNaN(amountToPay) || amountToPay <= 0) {
        alert("Invalid amount");
        return;
    }

    const totalFee = parseFloat(selectedFee.amount) + (selectedFee.penalty || 0);
    const previousPaid = selectedFee.paidAmount || 0;
    const newPaid = previousPaid + amountToPay;
    
    let newStatus = selectedFee.status;
    if (newPaid >= totalFee) {
        newStatus = 'Paid';
    } else {
        newStatus = 'Partial';
    }

    setGeneratedFees(generatedFees.map(fee => 
        fee.id === selectedFee.id ? { ...fee, status: newStatus, paidAmount: newPaid, balance: totalFee - newPaid } : fee
    ));
    
    setShowPaymentModal(false);
    setSelectedFee(null);
    setPaymentAmount('');
  };

  const handleReversePayment = (id) => {
    setGeneratedFees(generatedFees.map(fee => 
      fee.id === id ? { ...fee, status: 'Generated' } : fee
    ));
  };

  const handleAddPenalty = (id) => {
    const penaltyAmount = prompt("Enter penalty amount:", "50");
    if (penaltyAmount && !isNaN(penaltyAmount)) {
      setGeneratedFees(generatedFees.map(fee => 
        fee.id === id ? { ...fee, penalty: (fee.penalty || 0) + parseFloat(penaltyAmount) } : fee
      ));
    }
  };

  const handleRemovePenalty = (id) => {
    setGeneratedFees(generatedFees.map(fee => 
      fee.id === id ? { ...fee, penalty: 0 } : fee
    ));
  };

  const handleSyncPayment = (id) => {
    alert(`Syncing payment for fee ID: ${id}...`);
    // Simulate sync logic here
    setTimeout(() => {
        alert(`Payment synced for fee ID: ${id}`);
    }, 500);
  };

  const handleBulkFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      const parsedData = jsonData.map((row) => {
        // Flexible key matching for 'student code' and 'amount'
        const keys = Object.keys(row);
        const codeKey = keys.find(k => /student\s*code/i.test(k)) || keys.find(k => /code/i.test(k));
        const amountKey = keys.find(k => /amount/i.test(k)) || keys.find(k => /fee/i.test(k));
        const gradeKey = keys.find(k => /grade/i.test(k)) || keys.find(k => /class/i.test(k));

        if (codeKey && amountKey) {
          return {
            studentCode: row[codeKey],
            amount: row[amountKey],
            grade: gradeKey ? row[gradeKey] : ''
          };
        }
        return null;
      }).filter(f => f !== null);

      if (parsedData.length > 0) {
        setBulkData(parsedData);
      } else {
        alert("Could not find valid data. Please check column names (Student Code, Amount).");
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const toggleBulkPeriod = (periodId) => {
    setSelectedBulkPeriods(prev => 
      prev.includes(periodId) ? prev.filter(id => id !== periodId) : [...prev, periodId]
    );
  };

  const handleBulkGenerate = () => {
    if (bulkData.length === 0) {
      alert("No student data loaded.");
      return;
    }
    if (selectedBulkPeriods.length === 0) {
      alert("Please select at least one payment period.");
      return;
    }

    const newFees = [];
    let timestamp = Date.now();

    bulkData.forEach((data, index) => {
      selectedBulkPeriods.forEach(periodId => {
        const period = periods.find(p => p.id === periodId);
        if (period) {
          newFees.push({
            id: timestamp + index + Math.random(), // Ensure unique ID
            studentCode: data.studentCode,
            amount: data.amount,
            grade: data.grade || '',
            paymentPeriod: period.shortName,
            status: 'Generated',
            penalty: 0
          });
        }
      });
    });

    setGeneratedFees(prev => [...prev, ...newFees]);
    setGenerationMode('none');
    setBulkData([]);
    setSelectedBulkPeriods([]);
    alert(`${newFees.length} fees generated successfully!`);
  };

  const handleAction = (e, id) => {
    const action = e.target.value;
    if (action === 'pay') {
        const fee = generatedFees.find(f => f.id === id);
        setSelectedFee(fee);
        const total = parseFloat(fee.amount) + (fee.penalty || 0);
        const paid = fee.paidAmount || 0;
        setPaymentAmount(total - paid);
        setShowPaymentModal(true);
    }
    else if (action === 'reverse') handleReversePayment(id);
    else if (action === 'addPenalty') handleAddPenalty(id);
    else if (action === 'removePenalty') handleRemovePenalty(id);
    else if (action === 'sync') handleSyncPayment(id);
    e.target.value = "";
  };

  const getStudentGrade = (code) => {
    const student = students.find(s => s.student_code === code);
    return student ? student.grade : '';
  };

  const getStudentName = (code) => {
    const student = students.find(s => s.student_code === code);
    return student ? student.name : '';
  };

  const filteredFees = generatedFees.filter(fee => {
    const effectiveGrade = fee.grade || getStudentGrade(fee.studentCode);
    const studentName = getStudentName(fee.studentCode);
    const matchesGrade = filters.grade ? (effectiveGrade && effectiveGrade.toString().toLowerCase().includes(filters.grade.toLowerCase())) : true;
    const matchesStatus = filters.status ? fee.status === filters.status : true;
    const matchesPaymentPeriod = filters.paymentPeriod ? fee.paymentPeriod === filters.paymentPeriod : true;
    const matchesSearch = filters.search 
      ? (String(fee.studentCode).toLowerCase().includes(filters.search.toLowerCase()) || String(studentName).toLowerCase().includes(filters.search.toLowerCase()))
      : true;
    
    let matchesAcademicYear = true;
    if (filters.academicYear) {
        const period = periods.find(p => p.shortName === fee.paymentPeriod);
        matchesAcademicYear = period ? period.academicYear === filters.academicYear : false;
    }
    return matchesGrade && matchesStatus && matchesPaymentPeriod && matchesAcademicYear && matchesSearch;
  });

  const uniqueAcademicYears = [...new Set(periods.map(p => p.academicYear).filter(Boolean))];
  const uniqueGrades = [...new Set(students.map(s => s.grade).filter(Boolean))].sort();

  return (
    <div>
      <h2>School Fees</h2>
      {showPaymentModal && selectedFee && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1050 }}>
          <div className="card shadow p-4" style={{ maxWidth: '400px', width: '90%' }}>
            <h3>Record Payment</h3>
            <p><strong>Student:</strong> {getStudentName(selectedFee.studentCode)}</p>
            <p><strong>Total Due:</strong> {parseFloat(selectedFee.amount) + (selectedFee.penalty || 0)}</p>
            <p><strong>Already Paid:</strong> {selectedFee.paidAmount || 0}</p>
            <div className="mb-3">
              <label className="form-label">Amount to Pay</label>
              <input type="number" className="form-control" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} />
            </div>
            <button className="btn btn-success me-2" onClick={handleConfirmPayment}>Confirm Payment</button>
            <button className="btn btn-secondary" onClick={() => setShowPaymentModal(false)}>Cancel</button>
          </div>
        </div>
      )}
      {generationMode === 'single' ? (
        <div className="card shadow-sm p-4 mb-4">
          <h3>Generate Single Fee</h3>
          <form onSubmit={handleGenerateSingleFee} style={{ maxWidth: '400px' }}>
            <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Student Code"
              value={feeData.studentCode}
              onChange={(e) => setFeeData({ ...feeData, studentCode: e.target.value })}
              required
            />
            </div>
            <div className="mb-3">
            <select
              className="form-select"
              value={feeData.grade}
              onChange={(e) => setFeeData({ ...feeData, grade: e.target.value })}
            >
              <option value="">Select Grade</option>
              {uniqueGrades.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
            </div>
            <div className="mb-3">
            <select
              className="form-select"
              value={feeData.feeHead}
              onChange={(e) => {
                const head = feeHeads.find(h => h.name === e.target.value);
                setFeeData({ ...feeData, feeHead: e.target.value, amount: head ? head.defaultAmount : feeData.amount });
              }}
            >
              <option value="">Select Fee Head (Optional)</option>
              {feeHeads && feeHeads.map(h => <option key={h.id} value={h.name}>{h.name}</option>)}
            </select>
            </div>
            <div className="mb-3">
            <input
              type="number"
              className="form-control"
              placeholder="Amount to Pay"
              value={feeData.amount}
              onChange={(e) => setFeeData({ ...feeData, amount: e.target.value })}
              required
            />
            </div>
            <div className="mb-3">
            <select
              className="form-select"
              value={feeData.paymentPeriod}
              onChange={(e) => setFeeData({ ...feeData, paymentPeriod: e.target.value })}
              required
            >
              <option value="" disabled>Select a Payment Period</option>
              {periods.map(period => (
                <option key={period.id} value={period.id}>
                  {period.shortName} ({new Date(period.startDate).toLocaleDateString()} - {new Date(period.endDate).toLocaleDateString()})
                </option>
              ))}
            </select>
            </div>
            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-success">Generate</button>
              <button type="button" className="btn btn-secondary" onClick={() => setGenerationMode('none')}>Cancel</button>
            </div>
          </form>
        </div>
      ) : generationMode === 'bulk' ? (
        <div className="card shadow-sm p-4 mb-4">
          <h3>Generate Bulk Fees</h3>
          <div style={{ maxWidth: '600px' }}>
            <div className="mb-3">
              <label className="form-label fw-bold">1. Upload Excel File:</label>
              <input type="file" className="form-control" accept=".xlsx, .xls" onChange={handleBulkFileUpload} />
              <small className="text-muted d-block mt-1">Ensure columns: "Student Code", "Amount", and optionally "Grade"</small>
              {bulkData.length > 0 && <div className="text-success fw-bold mt-2">{bulkData.length} records loaded.</div>}
            </div>

            {bulkData.length > 0 && (
              <div className="mb-3">
                <label className="form-label fw-bold">2. Select Payment Periods:</label>
                <div className="mb-2 d-flex gap-2">
                  <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => setSelectedBulkPeriods(periods.map(p => p.id))}>Select All</button>
                  <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setSelectedBulkPeriods([])}>Unselect All</button>
                </div>
                <div className="border rounded p-2" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  {periods.map(period => (
                    <div key={period.id} style={{ marginBottom: '5px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input 
                          type="checkbox" 
                          checked={selectedBulkPeriods.includes(period.id)} 
                          onChange={() => toggleBulkPeriod(period.id)}
                        />
                        {period.shortName} ({new Date(period.startDate).toLocaleDateString()} - {new Date(period.endDate).toLocaleDateString()})
                      </label>
                    </div>
                  ))}
                  {periods.length === 0 && <p>No payment periods available.</p>}
                </div>
              </div>
            )}

            <div className="d-flex gap-2 mt-3">
              <button 
                className="btn btn-success"
                onClick={handleBulkGenerate} 
                disabled={bulkData.length === 0 || selectedBulkPeriods.length === 0}
              >
                Generate Fees
              </button>
              <button className="btn btn-secondary" onClick={() => { setGenerationMode('none'); setBulkData([]); setSelectedBulkPeriods([]); }}>Cancel</button>
            </div>
          </div>
        </div>
      ) : (
        <div className="card shadow-sm p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3>Generated Fees</h3>
            <select 
              className="form-select w-auto bg-primary text-white"
              onChange={(e) => {
                setGenerationMode(e.target.value);
                e.target.value = ""; // Reset to allow re-selecting same option if needed, though state change handles view
              }} 
              defaultValue="" 
            >
              <option value="" disabled style={{ color: 'black' }}>Generate New Fee</option>
              <option value="single" style={{ color: 'black' }}>Generate Single</option>
              <option value="bulk" style={{ color: 'black' }}>Generate Bulk</option>
            </select>
          </div>

          <div className="bg-light p-3 rounded mb-3 d-flex flex-wrap gap-2">
            <select 
              className="form-select w-auto"
              value={filters.academicYear} 
              onChange={(e) => setFilters({ ...filters, academicYear: e.target.value })}
            >
              <option value="">All Academic Years</option>
              {uniqueAcademicYears.map(year => <option key={year} value={year}>{year}</option>)}
            </select>
            <select 
              className="form-select w-auto"
              value={filters.grade} 
              onChange={(e) => setFilters({ ...filters, grade: e.target.value })}
            >
              <option value="">All Grades</option>
              {uniqueGrades.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
            <select 
              className="form-select w-auto"
              value={filters.paymentPeriod} 
              onChange={(e) => setFilters({ ...filters, paymentPeriod: e.target.value })}
            >
              <option value="">All Payment Periods</option>
              {periods.map(p => <option key={p.id} value={p.shortName}>{p.shortName}</option>)}
            </select>
            <select 
              className="form-select w-auto"
              value={filters.status} 
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="">All Statuses</option>
              <option value="Generated">Generated</option>
              <option value="Paid">Paid</option>
              <option value="Partial">Partial</option>
            </select>
            <input
              className="form-control w-auto"
              type="text"
              placeholder="Search by ID or Name"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
            <button className="btn btn-secondary" onClick={() => setFilters({ academicYear: '', grade: '', paymentPeriod: '', status: '', search: '' })}>Clear Filters</button>
          </div>

          <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>Student Code</th>
                <th>Student Name</th>
                <th>Grade</th>
                <th>Fee Head</th>
                <th>Amount</th>
                <th>Penalty</th>
                <th>Paid</th>
                <th>Balance</th>
                <th>Payment Period</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFees.map(fee => (
                <tr key={fee.id}>
                  <td>{fee.studentCode}</td>
                  <td>{getStudentName(fee.studentCode)}</td>
                  <td>{fee.grade || getStudentGrade(fee.studentCode) || '-'}</td>
                  <td>{fee.feeHead || 'General'}</td>
                  <td>{fee.amount}</td>
                  <td>{fee.penalty || 0}</td>
                  <td>{fee.paidAmount || 0}</td>
                  <td>{fee.balance !== undefined ? fee.balance : (parseFloat(fee.amount) + (fee.penalty || 0))}</td>
                  <td>{fee.paymentPeriod}</td>
                  <td><span className={`badge ${fee.status === 'Paid' ? 'bg-success' : fee.status === 'Partial' ? 'bg-warning text-dark' : 'bg-danger'}`}>{fee.status}</span></td>
                  <td>
                    <select className="form-select form-select-sm bg-info text-white border-0" onChange={(e) => handleAction(e, fee.id)} defaultValue="">
                      <option value="" disabled style={{ backgroundColor: 'white', color: 'black' }}>Actions</option>
                      <option value="pay" style={{ backgroundColor: 'white', color: 'black' }}>Pay Manually</option>
                      <option value="reverse" style={{ backgroundColor: 'white', color: 'black' }}>Reverse Payment</option>
                      <option value="addPenalty" style={{ backgroundColor: 'white', color: 'black' }}>Add Penalty</option>
                      <option value="removePenalty" style={{ backgroundColor: 'white', color: 'black' }}>Remove Penalty</option>
                      <option value="sync" style={{ backgroundColor: 'white', color: 'black' }}>Sync</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}
    </div>
  );
}

function PenaltySetup() {
  const [penaltyConfig, setPenaltyConfig] = useState(() => {
    const saved = localStorage.getItem('penaltyConfig');
    return saved ? JSON.parse(saved) : null;
  });
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    method: 'Incremental Amount',
    amount: '100',
    period: '5',
    notificationPeriod: 'Within 1 days',
    maxNotifications: '400',
    terminationMessage: 'you wont get our service',
    skipSundays: true
  });

  useEffect(() => {
    if (penaltyConfig) {
      setFormData(penaltyConfig);
    }
  }, [penaltyConfig]);

  const handleSave = (e) => {
    e.preventDefault();
    setPenaltyConfig(formData);
    localStorage.setItem('penaltyConfig', JSON.stringify(formData));
    setIsEditing(false);
    alert('Penalty configuration saved!');
  };

  return (
    <div>
      <h2>Penalty Setup</h2>
      {!isEditing && penaltyConfig ? (
        <div className="card shadow-sm p-4">
          <h3>Current Penalty Rules</h3>
          <div className="row mb-3">
            <div className="col-md-6 mb-2"><strong>Penalty Method:</strong> {penaltyConfig.method}</div>
            <div className="col-md-6 mb-2"><strong>Penalty Amount:</strong> {penaltyConfig.amount}</div>
            <div className="col-md-6 mb-2"><strong>Penalty Period (Days):</strong> {penaltyConfig.period}</div>
            <div className="col-md-6 mb-2"><strong>Notification Period:</strong> {penaltyConfig.notificationPeriod}</div>
            <div className="col-md-6 mb-2"><strong>Max Notifications:</strong> {penaltyConfig.maxNotifications}</div>
            <div className="col-md-6 mb-2"><strong>Skip Sundays:</strong> {penaltyConfig.skipSundays ? 'Yes' : 'No'}</div>
            <div className="col-12"><strong>Termination Message:</strong> {penaltyConfig.terminationMessage}</div>
          </div>
          <button className="btn btn-primary" onClick={() => setIsEditing(true)}>Edit Configuration</button>
        </div>
      ) : (
        <div className="card shadow-sm p-4">
            <h3>{penaltyConfig ? 'Edit Penalty Configuration' : 'Setup Penalty Configuration'}</h3>
            
            <form onSubmit={handleSave} style={{ maxWidth: '500px' }}>
                <div className="mb-3">
                    <label className="form-label fw-bold">Penalty Method</label>
                    <select 
                        className="form-select"
                        value={formData.method} 
                        onChange={(e) => setFormData({...formData, method: e.target.value})}
                    >
                        <option value="Incremental Amount">Incremental Amount</option>
                        <option value="Fixed Amount">Fixed Amount</option>
                        <option value="Percentage">Percentage</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label fw-bold">Penalty Amount</label>
                    <input type="number" className="form-control" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} required />
                </div>
                <div className="mb-3">
                    <label className="form-label fw-bold">Penalty Period (In days)</label>
                    <input type="number" className="form-control" value={formData.period} onChange={(e) => setFormData({...formData, period: e.target.value})} required />
                </div>
                <div className="mb-3">
                    <label className="form-label fw-bold">Penalty Notification Period</label>
                    <input type="text" className="form-control" placeholder="e.g. Within 1 days" value={formData.notificationPeriod} onChange={(e) => setFormData({...formData, notificationPeriod: e.target.value})} required />
                </div>
                <div className="mb-3">
                    <label className="form-label fw-bold">Maximum number of notification</label>
                    <input type="number" className="form-control" value={formData.maxNotifications} onChange={(e) => setFormData({...formData, maxNotifications: e.target.value})} required />
                </div>
                <div className="mb-3">
                    <label className="form-label fw-bold">Termination message after maximum penalty notification</label>
                    <textarea className="form-control" value={formData.terminationMessage} onChange={(e) => setFormData({...formData, terminationMessage: e.target.value})} style={{ minHeight: '80px' }} required />
                </div>
                <div className="mb-3">
                    <label className="form-check-label fw-bold d-flex align-items-center gap-2">
                        <input type="checkbox" className="form-check-input" checked={formData.skipSundays} onChange={(e) => setFormData({...formData, skipSundays: e.target.checked})} />
                        Skip Sundays
                    </label>
                </div>
                <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-success">Save</button>
                    {penaltyConfig && (
                        <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
                    )}
                </div>
            </form>
        </div>
      )}
    </div>
  );
}

function SMSPanel() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const handleSendSMS = (e) => {
    e.preventDefault();
    if (!phoneNumber || !message) {
      alert('Please enter phone number and message');
      return;
    }
    
    setStatus('Sending...');
    
    // Simulate API call
    setTimeout(() => {
        setStatus('Message delivered successfully!');
        setPhoneNumber('');
        setMessage('');
        setTimeout(() => setStatus(''), 3000);
    }, 1500);
  };

  return (
    <div>
      <h2>Send SMS</h2>
      <div className="card shadow-sm p-4" style={{ maxWidth: '500px' }}>
        <form onSubmit={handleSendSMS}>
            <div className="mb-3">
                <label className="form-label fw-bold">Family Phone Number</label>
                <input 
                    type="tel" 
                    className="form-control"
                    placeholder="Enter phone number" 
                    value={phoneNumber} 
                    onChange={(e) => setPhoneNumber(e.target.value)} 
                    required
                />
            </div>
            <div className="mb-3">
                <label className="form-label fw-bold">Message</label>
                <textarea 
                    className="form-control"
                    placeholder="Enter your message here..." 
                    value={message} 
                    onChange={(e) => setMessage(e.target.value)} 
                    required
                />
            </div>
            <button type="submit" className="btn btn-primary w-100">
                Send Free Text
            </button>
            {status && <p style={{ color: status.includes('success') ? 'green' : 'blue', marginTop: '10px', fontWeight: 'bold' }}>{status}</p>}
        </form>
      </div>
    </div>
  );
}

function Assignments() {
  const userRole = localStorage.getItem('userRole');
  const [studentSearchId, setStudentSearchId] = useState('');
  const [studentResult, setStudentResult] = useState(null);
  const [assessmentData, setAssessmentData] = useState(() => {
    const saved = localStorage.getItem('assessmentData');
    return saved ? JSON.parse(saved) : [];
  });
  const [subjects, setSubjects] = useState(() => {
    const saved = localStorage.getItem('assessmentSubjects');
    return saved ? JSON.parse(saved) : [];
  });
  const [students, setStudents] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    api.get('/students/')
      .then(res => setStudents(res.data))
      .catch(err => console.error("Error fetching students for assignments:", err));
  }, []);

  useEffect(() => {
    localStorage.setItem('assessmentData', JSON.stringify(assessmentData));
  }, [assessmentData]);

  useEffect(() => {
    localStorage.setItem('assessmentSubjects', JSON.stringify(subjects));
  }, [subjects]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleImport = () => {
    if (!selectedFile) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      if (jsonData.length < 2) {
        alert("File appears to be empty or missing header row.");
        return;
      }

      const headers = jsonData[0];
      const subjectHeaders = headers.slice(1);
      setSubjects(subjectHeaders);

      const rows = jsonData.slice(1);
      const processedData = rows.map(row => {
        const studentId = row[0];
        if (!studentId) return null;

        const student = students.find(s => s.student_code == studentId);
        const studentName = student ? student.name : 'Unknown';

        const grades = {};
        let total = 0;
        let count = 0;

        subjectHeaders.forEach((subject, index) => {
          const val = row[index + 1];
          const grade = parseFloat(val);
          if (!isNaN(grade)) {
            grades[subject] = grade;
            total += grade;
            count++;
          } else {
            grades[subject] = val || '-';
          }
        });

        const average = count > 0 ? (total / count).toFixed(2) : 0;

        return {
          studentId,
          studentName,
          grades,
          total: parseFloat(total.toFixed(2)),
          average: parseFloat(average)
        };
      }).filter(item => item !== null);

      processedData.sort((a, b) => b.average - a.average);

      let currentRank = 1;
      for (let i = 0; i < processedData.length; i++) {
        if (i > 0 && processedData[i].average < processedData[i - 1].average) {
          currentRank = i + 1;
        }
        processedData[i].rank = currentRank;
      }

      setAssessmentData(processedData);
      setSelectedFile(null);
      document.getElementById('assessment-file-input').value = '';
      alert("Assessment data imported successfully!");
    };
    reader.readAsArrayBuffer(selectedFile);
  };

  const handleCancel = () => {
    setSelectedFile(null);
    document.getElementById('assessment-file-input').value = '';
  };

  const handleAction = (action, student) => {
    alert(`${action} action clicked for ${student.studentName} (${student.studentId})`);
  };

  if (userRole === 'Student') {
    return (
      <div>
        <h2>My Assessment Results</h2>
        <div className="card shadow-sm p-4 mb-4">
          <h3>Check Your Rank</h3>
          <div className="input-group mb-3" style={{ maxWidth: '400px' }}>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Enter your Student ID" 
              value={studentSearchId} 
              onChange={e => setStudentSearchId(e.target.value)} 
            />
            <button className="btn btn-primary" onClick={() => {
              const result = assessmentData.find(d => String(d.studentId) === String(studentSearchId));
              setStudentResult(result || 'not_found');
            }}>Check</button>
          </div>
          
          {studentResult === 'not_found' && <div className="alert alert-danger">Student ID not found in assessment records.</div>}
          
          {studentResult && studentResult !== 'not_found' && (
            <div className="card border-primary">
              <div className="card-header bg-primary text-white">Results for {studentResult.studentName}</div>
              <div className="card-body">
                <h4 className="card-title">Rank: {studentResult.rank}</h4>
                <p className="card-text"><strong>Total Score:</strong> {studentResult.total}</p>
                <p className="card-text"><strong>Average:</strong> {studentResult.average}</p>
                <hr/>
                <h5>Subject Grades:</h5>
                <ul>
                  {subjects.map(sub => <li key={sub}><strong>{sub}:</strong> {studentResult.grades[sub]}</li>)}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2>Assignment / Assessment</h2>
      <div className="card shadow-sm p-4 mb-4">
        <h3>Import Assessment Grades</h3>
        <div className="mb-3">
          <input id="assessment-file-input" type="file" className="form-control" accept=".xlsx, .xls" onChange={handleFileChange} />
          {selectedFile && (
            <div className="mt-2 d-flex gap-2">
              <button className="btn btn-success" onClick={handleImport}>Import</button>
              <button className="btn btn-danger" onClick={handleCancel}>Cancel</button>
            </div>
          )}
        </div>
        <p className="text-muted small">
          <strong>Instructions:</strong> Upload an Excel file where the first column is <strong>Student ID</strong>, 
          followed by subject columns (e.g., Mathematics, English, Physics, General Science, Aptitude).
        </p>
      </div>

      {assessmentData.length > 0 && (
        <div className="card shadow-sm p-4">
          <h3>Results Overview</h3>
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Student Name</th>
                  {subjects.map((sub, idx) => (
                    <th key={idx}>{sub}</th>
                  ))}
                  <th>Total Score</th>
                  <th>Average</th>
                  <th>Rank</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {assessmentData.map((data, index) => (
                  <tr key={index}>
                    <td>{data.studentId}</td>
                    <td>{data.studentName}</td>
                    {subjects.map((sub, idx) => (
                      <td key={idx}>{data.grades[sub]}</td>
                    ))}
                    <td className="fw-bold">{data.total}</td>
                    <td className="fw-bold text-primary">{data.average}</td>
                    <td className="fw-bold">{data.rank}</td>
                    <td>
                      <div className="d-flex gap-1">
                      <button className="btn btn-sm btn-warning" onClick={() => handleAction('Edit', data)}>Edit</button>
                      <button className="btn btn-sm btn-info text-white" onClick={() => handleAction('View', data)}>View</button>
                      <button className="btn btn-sm btn-secondary" onClick={() => handleAction('Print', data)}>Print</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function Settings() {
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      alert("New passwords do not match!");
      return;
    }
    // Simulate API call
    alert("Password changed successfully!");
    setPasswords({ current: '', new: '', confirm: '' });
  };

  return (
    <div>
      <h2>Settings</h2>
      <div className="card shadow-sm p-4" style={{ maxWidth: '500px' }}>
        <h3>Change Password</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-bold">Current Password</label>
            <input type="password" name="current" className="form-control" value={passwords.current} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label fw-bold">New Password</label>
            <input type="password" name="new" className="form-control" value={passwords.new} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label fw-bold">Confirm Password</label>
            <input type="password" name="confirm" className="form-control" value={passwords.confirm} onChange={handleChange} required />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}

function FeeStructure({ feeHeads, setFeeHeads }) {
  const [newHead, setNewHead] = useState({ name: '', defaultAmount: '' });

  const handleSave = () => {
    if (newHead.name && newHead.defaultAmount) {
      setFeeHeads([...feeHeads, { ...newHead, id: Date.now() }]);
      setNewHead({ name: '', defaultAmount: '' });
    }
  };

  const handleDelete = (id) => {
    setFeeHeads(feeHeads.filter(h => h.id !== id));
  };

  return (
    <div>
      <h2>Fee Structure (Fee Heads)</h2>
      <div className="card shadow-sm p-4 mb-4">
        <h3>Add Fee Head</h3>
        <div className="row g-2 align-items-end">
          <div className="col-md-5">
            <label className="form-label">Fee Name (e.g. Tuition, Transport)</label>
            <input type="text" className="form-control" value={newHead.name} onChange={e => setNewHead({...newHead, name: e.target.value})} />
          </div>
          <div className="col-md-5">
            <label className="form-label">Default Amount</label>
            <input type="number" className="form-control" value={newHead.defaultAmount} onChange={e => setNewHead({...newHead, defaultAmount: e.target.value})} />
          </div>
          <div className="col-md-2">
            <button className="btn btn-success w-100" onClick={handleSave}>Add</button>
          </div>
        </div>
      </div>
      <div className="card shadow-sm p-4">
        <h3>Existing Fee Heads</h3>
        <table className="table table-striped">
          <thead><tr><th>Name</th><th>Default Amount</th><th>Action</th></tr></thead>
          <tbody>
            {feeHeads.map(head => (
              <tr key={head.id}>
                <td>{head.name}</td>
                <td>{head.defaultAmount}</td>
                <td><button className="btn btn-sm btn-danger" onClick={() => handleDelete(head.id)}>Delete</button></td>
              </tr>
            ))}
            {feeHeads.length === 0 && <tr><td colSpan="3" className="text-center">No fee heads defined.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Timetable() {
  const [schedule, setSchedule] = useState(() => JSON.parse(localStorage.getItem('timetable') || '[]'));
  const [entry, setEntry] = useState({ grade: '', day: 'Monday', time: '', subject: '', teacher: '' });

  useEffect(() => localStorage.setItem('timetable', JSON.stringify(schedule)), [schedule]);

  const handleAdd = () => {
    if (entry.grade && entry.time && entry.subject) {
      setSchedule([...schedule, { ...entry, id: Date.now() }]);
      setEntry({ ...entry, subject: '', teacher: '' }); // Keep grade/day/time for easier entry
    }
  };

  const handleDelete = (id) => setSchedule(schedule.filter(s => s.id !== id));

  return (
    <div>
      <h2>Class Timetable</h2>
      <div className="card shadow-sm p-4 mb-4">
        <h3>Add Schedule Entry</h3>
        <div className="row g-2">
          <div className="col-md-2"><input type="text" className="form-control" placeholder="Grade" value={entry.grade} onChange={e => setEntry({...entry, grade: e.target.value})} /></div>
          <div className="col-md-2">
            <select className="form-select" value={entry.day} onChange={e => setEntry({...entry, day: e.target.value})}>
              {['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'].map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div className="col-md-2"><input type="text" className="form-control" placeholder="Time (e.g. 9-10 AM)" value={entry.time} onChange={e => setEntry({...entry, time: e.target.value})} /></div>
          <div className="col-md-2"><input type="text" className="form-control" placeholder="Subject" value={entry.subject} onChange={e => setEntry({...entry, subject: e.target.value})} /></div>
          <div className="col-md-2"><input type="text" className="form-control" placeholder="Teacher" value={entry.teacher} onChange={e => setEntry({...entry, teacher: e.target.value})} /></div>
          <div className="col-md-2"><button className="btn btn-success w-100" onClick={handleAdd}>Add</button></div>
        </div>
      </div>
      <div className="card shadow-sm p-4">
        <table className="table table-striped">
          <thead><tr><th>Grade</th><th>Day</th><th>Time</th><th>Subject</th><th>Teacher</th><th>Action</th></tr></thead>
          <tbody>
            {schedule.sort((a,b) => a.grade.localeCompare(b.grade) || a.day.localeCompare(b.day)).map(s => (
              <tr key={s.id}>
                <td>{s.grade}</td><td>{s.day}</td><td>{s.time}</td><td>{s.subject}</td><td>{s.teacher}</td>
                <td><button className="btn btn-sm btn-danger" onClick={() => handleDelete(s.id)}>X</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Library() {
  const [books, setBooks] = useState(() => JSON.parse(localStorage.getItem('libraryBooks') || '[]'));
  const [issued, setIssued] = useState(() => JSON.parse(localStorage.getItem('libraryIssued') || '[]'));
  const [newBook, setNewBook] = useState({ title: '', author: '', isbn: '', qty: 1 });
  const [issueData, setIssueData] = useState({ studentCode: '', bookId: '' });

  useEffect(() => {
    localStorage.setItem('libraryBooks', JSON.stringify(books));
    localStorage.setItem('libraryIssued', JSON.stringify(issued));
  }, [books, issued]);

  const addBook = () => {
    if (newBook.title) {
      setBooks([...books, { ...newBook, id: Date.now(), available: parseInt(newBook.qty) }]);
      setNewBook({ title: '', author: '', isbn: '', qty: 1 });
    }
  };

  const issueBook = () => {
    const book = books.find(b => b.id === parseInt(issueData.bookId));
    if (book && book.available > 0 && issueData.studentCode) {
      setIssued([...issued, { ...issueData, id: Date.now(), date: new Date().toISOString().split('T')[0], status: 'Issued', title: book.title }]);
      setBooks(books.map(b => b.id === book.id ? { ...b, available: b.available - 1 } : b));
      setIssueData({ studentCode: '', bookId: '' });
    } else {
      alert('Book not available or invalid data');
    }
  };

  const returnBook = (id) => {
    const record = issued.find(i => i.id === id);
    if (record) {
      setIssued(issued.map(i => i.id === id ? { ...i, status: 'Returned', returnDate: new Date().toISOString().split('T')[0] } : i));
      const book = books.find(b => b.id === parseInt(record.bookId));
      if (book) {
        setBooks(books.map(b => b.id === book.id ? { ...b, available: b.available + 1 } : b));
      }
    }
  };

  return (
    <div className="row">
      <div className="col-md-6">
        <div className="card shadow-sm p-4 mb-4">
          <h3>Add Book</h3>
          <div className="mb-2"><input className="form-control" placeholder="Title" value={newBook.title} onChange={e => setNewBook({...newBook, title: e.target.value})} /></div>
          <div className="mb-2"><input className="form-control" placeholder="Author" value={newBook.author} onChange={e => setNewBook({...newBook, author: e.target.value})} /></div>
          <div className="mb-2"><input className="form-control" placeholder="ISBN" value={newBook.isbn} onChange={e => setNewBook({...newBook, isbn: e.target.value})} /></div>
          <div className="mb-2"><input type="number" className="form-control" placeholder="Quantity" value={newBook.qty} onChange={e => setNewBook({...newBook, qty: e.target.value})} /></div>
          <button className="btn btn-success" onClick={addBook}>Add Book</button>
        </div>
        <div className="card shadow-sm p-4">
          <h3>Issue Book</h3>
          <div className="mb-2"><input className="form-control" placeholder="Student Code" value={issueData.studentCode} onChange={e => setIssueData({...issueData, studentCode: e.target.value})} /></div>
          <div className="mb-2">
            <select className="form-select" value={issueData.bookId} onChange={e => setIssueData({...issueData, bookId: e.target.value})}>
              <option value="">Select Book</option>
              {books.filter(b => b.available > 0).map(b => <option key={b.id} value={b.id}>{b.title}</option>)}
            </select>
          </div>
          <button className="btn btn-primary" onClick={issueBook}>Issue</button>
        </div>
      </div>
      <div className="col-md-6">
        <div className="card shadow-sm p-4 h-100">
          <h3>Issued Books</h3>
          <table className="table table-sm">
            <thead><tr><th>Student</th><th>Book</th><th>Date</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {issued.filter(i => i.status === 'Issued').map(i => (
                <tr key={i.id}><td>{i.studentCode}</td><td>{i.title}</td><td>{i.date}</td><td>{i.status}</td>
                <td><button className="btn btn-sm btn-warning" onClick={() => returnBook(i.id)}>Return</button></td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function DashboardHome({ generatedFees }) {
  const userRole = localStorage.getItem('userRole');
  const [studentCount, setStudentCount] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewAll, setViewAll] = useState(false);
  const [attendanceSummary, setAttendanceSummary] = useState(null);

  useEffect(() => {
    api.get('/students/')
      .then(res => {
        setStudentCount(res.data.length);

        // Calculate attendance summary for today
        const attendanceData = JSON.parse(localStorage.getItem('attendanceData') || '{}');
        const today = new Date().toISOString().split('T')[0];
        const todaysAttendance = attendanceData[today];

        if (todaysAttendance) {
          const summary = { present: 0, absent: 0, late: 0 };
          Object.values(todaysAttendance).forEach(status => {
            if (status === 'Present') summary.present++;
            else if (status === 'Absent') summary.absent++;
            else if (status === 'Late') summary.late++;
          });
          setAttendanceSummary(summary);
        } else {
          // No attendance data for today
          setAttendanceSummary({ present: 0, absent: 0, late: 0 });
        }
      })
      .catch(err => {
        console.error("Error fetching students count:", err);
        setAttendanceSummary({ present: 0, absent: 0, late: 0 }); // Set default on error
      });
  }, []);

  const filteredFees = generatedFees.filter(fee => {
    if (viewAll) return true;
    const feeDate = new Date(fee.id);
    return feeDate.toDateString() === selectedDate.toDateString();
  });

  const totalAmount = filteredFees.reduce((sum, fee) => sum + parseFloat(fee.amount || 0) + (fee.penalty || 0), 0);
  
  // Analytics
  const totalCollected = generatedFees.reduce((sum, fee) => sum + (fee.paidAmount || 0), 0);
  const totalExpected = generatedFees.reduce((sum, fee) => sum + parseFloat(fee.amount || 0) + (fee.penalty || 0), 0);
  const defaulters = generatedFees.filter(f => f.status !== 'Paid' && (f.balance === undefined || f.balance > 0)).sort((a,b) => (b.balance || b.amount) - (a.balance || a.amount)).slice(0, 5);

  const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();
  const days = daysInMonth(month, year);
  const startDay = firstDayOfMonth(month, year);

  const calendarCells = [];
  for (let i = 0; i < startDay; i++) {
    calendarCells.push(<td key={`empty-${i}`}></td>);
  }
  for (let d = 1; d <= days; d++) {
    const date = new Date(year, month, d);
    const isSelected = !viewAll && date.toDateString() === selectedDate.toDateString();
    calendarCells.push(
      <td 
        key={d} 
        onClick={() => { setSelectedDate(date); setViewAll(false); }}
        className={`text-center p-0 cursor-pointer ${isSelected ? 'bg-primary text-white rounded' : ''}`}
        style={{ cursor: 'pointer', fontSize: '0.75rem', width: '25px', height: '25px', lineHeight: '25px' }}
      >
        {d}
      </td>
    );
  }

  const rows = [];
  let cells = [];
  calendarCells.forEach((cell, i) => {
    cells.push(cell);
    if ((i + 1) % 7 === 0) {
      rows.push(<tr key={i}>{cells}</tr>);
      cells = [];
    }
  });
  if (cells.length > 0) rows.push(<tr key="last">{cells}</tr>);

  return (
    <div className="row g-4 pt-5">
      <div className="col-md-6">
        {userRole !== 'Student' && (
        <div className="card shadow-sm p-4 mb-4 text-center bg-primary text-white">
          <h3>Total Students</h3>
          <p className="display-4 fw-bold m-0">{studentCount}</p>
        </div>
        )}
        
        {userRole === 'Admin' && (
        <div className="card shadow-sm p-4 mb-4">
          <h3>Financial Overview</h3>
          <div className="d-flex justify-content-between mb-2"><span>Total Expected:</span> <strong>{totalExpected.toFixed(2)}</strong></div>
          <div className="d-flex justify-content-between mb-2"><span>Total Collected:</span> <strong className="text-success">{totalCollected.toFixed(2)}</strong></div>
          <div className="d-flex justify-content-between"><span>Outstanding:</span> <strong className="text-danger">{(totalExpected - totalCollected).toFixed(2)}</strong></div>
          <div className="progress mt-3"><div className="progress-bar bg-success" style={{ width: `${totalExpected ? (totalCollected/totalExpected)*100 : 0}%` }}></div></div>
        </div>
        )}

        {userRole !== 'Student' && (
        <div className="card shadow-sm p-4 mb-4">
          <h3 className="mb-3">Today's Attendance Report</h3>
          {attendanceSummary ? (
            <div className="d-flex justify-content-around text-center">
                <div>
                    <p className="mb-0 fw-bold fs-4 text-success">{attendanceSummary.present}</p>
                    <small>Present</small>
                </div>
                <div>
                    <p className="mb-0 fw-bold fs-4 text-danger">{attendanceSummary.absent}</p>
                    <small>Absent</small>
                </div>
                <div>
                    <p className="mb-0 fw-bold fs-4 text-warning">{attendanceSummary.late}</p>
                    <small>Late</small>
                </div>
            </div>
          ) : (
            <p className="text-center text-muted">Loading attendance...</p>
          )}
        </div>
        )}

        {userRole === 'Admin' && (
        <div className="card shadow-sm p-4">
          <h3>Transaction Summary</h3>
          <div className="mb-3">
             <button 
               className={`btn btn-sm me-2 ${viewAll ? 'btn-primary' : 'btn-secondary'}`}
               onClick={() => setViewAll(true)}
             >
               All Reports
             </button>
             <span>{viewAll ? 'All Time' : selectedDate.toDateString()}</span>
          </div>
          <p><strong>Total Transactions:</strong> {filteredFees.length}</p>
          <p><strong>Total Amount:</strong> {totalAmount.toFixed(2)}</p>
        </div>
        )}

        {userRole === 'Admin' && (
        <div className="card shadow-sm p-4 mt-4">
          <h3>Top Defaulters</h3>
          <ul className="list-group list-group-flush">
            {defaulters.map(d => (
              <li key={d.id} className="list-group-item d-flex justify-content-between align-items-center">
                <span>{d.studentCode}</span> <span className="badge bg-danger rounded-pill">{d.balance || d.amount}</span>
              </li>
            ))}
            {defaulters.length === 0 && <li className="list-group-item">No defaulters found.</li>}
          </ul>
        </div>
        )}
      </div>
      <div className="col-md-6">
        <div className="card shadow-sm p-2 d-flex flex-column align-items-center justify-content-center" style={{ maxWidth: '280px', margin: '0 auto' }}>
        <h3 style={{ fontSize: '0.9rem' }} className="text-center mb-1">Calendar ({selectedDate.toLocaleString('default', { month: 'long' })} {year})</h3>
        <table className="table table-borderless table-sm mb-0 w-auto" style={{ fontSize: '0.75rem' }}>
          <thead>
            <tr>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <th key={d} className="text-center p-1">{d}</th>)}
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>        
        </div>
      </div>
    </div>
  );
}

function Dashboard() { 
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole') || 'Admin';
  const [currentView, setCurrentView] = useState('dashboard');
  const [periods, setPeriods] = useState(() => {
    const savedPeriods = localStorage.getItem('paymentPeriods');
    return savedPeriods ? JSON.parse(savedPeriods) : [];
  });
  const [academicYears, setAcademicYears] = useState(() => {
    const savedYears = localStorage.getItem('academicYears');
    return savedYears ? JSON.parse(savedYears) : [];
  });
  const [generatedFees, setGeneratedFees] = useState(() => {
    const savedFees = localStorage.getItem('generatedFees');
    return savedFees ? JSON.parse(savedFees) : [];
  });
  const [feeHeads, setFeeHeads] = useState(() => {
    const saved = localStorage.getItem('feeHeads');
    return saved ? JSON.parse(saved) : [];
  });
  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem('schoolUsers');
    if (savedUsers) {
      return JSON.parse(savedUsers);
    }
    // Fallback if localStorage is empty, though SignIn should create the first admin.
    return [{ id: 1, name: 'Admin User', email: 'admin', password: '123456', role: 'Admin', status: 'Active' }];
  });
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    localStorage.setItem('generatedFees', JSON.stringify(generatedFees));
  }, [generatedFees]);

  useEffect(() => {
    localStorage.setItem('paymentPeriods', JSON.stringify(periods));
  }, [periods]);

  useEffect(() => {
    localStorage.setItem('academicYears', JSON.stringify(academicYears));
  }, [academicYears]);

  useEffect(() => {
    localStorage.setItem('feeHeads', JSON.stringify(feeHeads));
  }, [feeHeads]);

  useEffect(() => {
    localStorage.setItem('schoolUsers', JSON.stringify(users));
  }, [users]);

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    navigate('/');
  };

  const renderView = () => {
    switch (currentView) {
      case 'students':
        return <Students />;
      case 'users':
        return <ManageUsers users={users} setUsers={setUsers} />;
      case 'attendance':
        return <Attendance />;
      case 'periods':
        return <PaymentPeriods periods={periods} setPeriods={setPeriods} academicYears={academicYears} setAcademicYears={setAcademicYears} />;
      case 'fees':
        return <SchoolFees periods={periods} generatedFees={generatedFees} setGeneratedFees={setGeneratedFees} feeHeads={feeHeads} />;
      case 'transactions':
        return <Transactions generatedFees={generatedFees} />;
      case 'penalty':
        return <PenaltySetup />;
      case 'sms':
        return <SMSPanel />;
      case 'assignments':
        return <Assignments />;
      case 'settings':
        return <Settings />;
      case 'feeStructure':
        return <FeeStructure feeHeads={feeHeads} setFeeHeads={setFeeHeads} />;
      case 'timetable':
        return <Timetable />;
      case 'library':
        return <Library />;
      default:
        return (
          <DashboardHome generatedFees={generatedFees} />
        );
    }
  };

  return (
    <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <div className="bg-dark text-white p-3 d-flex flex-column" style={{ width: '250px', minHeight: '100vh', position: 'fixed', left: 0, top: 0, overflowY: 'auto' }}>
        <h3 className="text-center mb-4">School System <br/><small className="fs-6 text-muted">({userRole})</small></h3>
        <ul className="nav flex-column gap-2">
          <li className="nav-item">
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`nav-link text-white w-100 text-start ${currentView === 'dashboard' ? 'active bg-primary' : ''}`}
            >
              Dashboard
            </button>
          </li>
          <li className="nav-item">
            <button
              onClick={() => setCurrentView('assignments')}
              className={`nav-link text-white w-100 text-start ${currentView === 'assignments' ? 'active bg-primary' : ''}`}
            >
              Assignment / Assessment
            </button>
          </li>
          {['Admin', 'Teacher'].includes(userRole) && (
          <li className="nav-item">
            <button
              onClick={() => setCurrentView('attendance')}
              className={`nav-link text-white w-100 text-start ${currentView === 'attendance' ? 'active bg-primary' : ''}`}
            >
              Attendance
            </button>
          </li>
          )}
          {userRole === 'Admin' && (
          <li className="nav-item">
            <button
              onClick={() => setCurrentView('students')}
              className={`nav-link text-white w-100 text-start ${currentView === 'students' ? 'active bg-primary' : ''}`}
            >
              Student Management
            </button>
          </li>
          )}
          {userRole === 'Admin' && (
          <li className="nav-item">
            <button
              onClick={() => setCurrentView('users')}
              className={`nav-link text-white w-100 text-start ${currentView === 'users' ? 'active bg-primary' : ''}`}
            >
              Manage Users
            </button>
          </li>
          )}
          {userRole === 'Admin' && (
          <li className="nav-item">
            <button
              onClick={() => setCurrentView('feeStructure')}
              className={`nav-link text-white w-100 text-start ${currentView === 'feeStructure' ? 'active bg-primary' : ''}`}
            >
              Fee Structure
            </button>
          </li>
          )}
          {['Admin', 'Teacher'].includes(userRole) && (
          <li className="nav-item">
            <button
              onClick={() => setCurrentView('timetable')}
              className={`nav-link text-white w-100 text-start ${currentView === 'timetable' ? 'active bg-primary' : ''}`}
            >
              Timetable
            </button>
          </li>
          )}
          {['Admin', 'Student'].includes(userRole) && (
          <li className="nav-item">
            <button
              onClick={() => setCurrentView('library')}
              className={`nav-link text-white w-100 text-start ${currentView === 'library' ? 'active bg-primary' : ''}`}
            >
              Library
            </button>
          </li>
          )}
          {userRole === 'Admin' && (
          <li className="nav-item">
            <button
              onClick={() => setCurrentView('periods')}
              className={`nav-link text-white w-100 text-start ${currentView === 'periods' ? 'active bg-primary' : ''}`}
            >
              Payment Periods
            </button>
          </li>
          )}
          {userRole === 'Admin' && (
          <li className="nav-item">
            <button
              onClick={() => setCurrentView('fees')}
              className={`nav-link text-white w-100 text-start ${currentView === 'fees' ? 'active bg-primary' : ''}`}
            >
              School Fees
            </button>
          </li>
          )}
          {userRole === 'Admin' && (
          <li className="nav-item">
            <button
              onClick={() => setCurrentView('transactions')}
              className={`nav-link text-white w-100 text-start ${currentView === 'transactions' ? 'active bg-primary' : ''}`}
            >
              Transactions
            </button>
          </li>
          )}
          {userRole === 'Admin' && (
          <li className="nav-item">
            <button
              onClick={() => setCurrentView('penalty')}
              className={`nav-link text-white w-100 text-start ${currentView === 'penalty' ? 'active bg-primary' : ''}`}
            >
              Penalty Setup
            </button>
          </li>
          )}
          {userRole === 'Admin' && (
          <li className="nav-item">
            <button
              onClick={() => setCurrentView('sms')}
              className={`nav-link text-white w-100 text-start ${currentView === 'sms' ? 'active bg-primary' : ''}`}
            >
              SMS
            </button>
          </li>
          )}
        </ul>
      </div>
      <div className="flex-grow-1 p-4" style={{ marginLeft: '250px', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)} 
            className="btn btn-dark d-flex align-items-center gap-2"
          >
            <span>Profile</span>
            <span style={{ fontSize: '12px' }}>▼</span>
          </button>
          {showProfileMenu && (
            <div className="dropdown-menu show" style={{ position: 'absolute', right: 0, top: '100%', marginTop: '5px' }}>
              <button 
                onClick={() => { setCurrentView('settings'); setShowProfileMenu(false); }}
                className="dropdown-item"
              >
                Settings
              </button>
              <button 
                onClick={handleLogout}
                className="dropdown-item text-danger"
              >
                Logout
              </button>
            </div>
          )}
        </div>
        {renderView()}
      </div>
    </div>
  );
}

export default Dashboard;