import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient'; // Importing Supabase client for database operations
import './App.css'; // Importing CSS for styling

function App() {
  // State to store SCP records from the database
  const [records, setRecords] = useState([]);

  // State to control the current view: 'home', 'detail', or 'admin'
  const [view, setView] = useState('home');

  // State to track the index of the selected SCP record for detail view
  const [selectedIndex, setSelectedIndex] = useState(null);

  // State for form data used in creating or editing records
  const [form, setForm] = useState({
    Title: '',
    Class: '',
    Image: '',
    Containment: '',
    Description: ''
  });

  // State for toggling the navigation menu
  const [isOpen, setIsOpen] = useState(false);

  // Toggles the menu open/closed
  const toggleMenu = () => setIsOpen(!isOpen);

  // Fetch records on initial render
  useEffect(() => {
    fetchRecords();
  }, []);

  // Fetch all records from Supabase, sort by ID, and store in state
  async function fetchRecords() {
    const { data, error } = await supabase.from('ScpData').select();
    if (!error) {
      const sortedData = data.sort((a, b) => a.id - b.id);
      setRecords(sortedData);
    }
  }

  // Handle changes in input fields
  function handleInputChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Submit a new record to Supabase and reset the form
  async function handleSubmit() {
    await supabase.from('ScpData').insert([form]);
    fetchRecords(); // Refresh the list
    setForm({ Title: '', Class: '', Image: '', Containment: '', Description: '' }); // Reset form
  }

  // Delete a record by ID
  async function handleDelete(id) {
    await supabase.from('ScpData').delete().eq('id', id);
    fetchRecords(); // Refresh list after deletion
  }

  // Update an existing record
  async function handleEdit(id) {
    await supabase.from('ScpData').update(form).eq('id', id);
    fetchRecords(); // Refresh list after update
    setForm({ Title: '', Class: '', Image: '', Containment: '', Description: '' }); // Reset form
  }

  return (
    <div className="app">
      {/* Navigation Menu */}
      <nav>
        <h2>SCP Foundation</h2>
        <button onClick={toggleMenu}>
          {isOpen ? 'Close Menu' : 'Open Menu'}
        </button>

        {/* Dropdown menu */}
        {isOpen && (
          <ul className={isOpen ? 'menu open' : 'menu closed'}>
            {/* Show a list of SCP titles */}
            {records.map((rec, idx) => (
              <li
                key={rec.id}
                onClick={() => {
                  setSelectedIndex(idx);
                  setView('detail');
                  setIsOpen(false);
                }}
              >
                {rec.Title}
              </li>
            ))}
            {/* Admin Panel entry */}
            <li onClick={() => {
              setView('admin');
              setIsOpen(false);
            }}>Admin</li>
          </ul>
        )}
      </nav>

      {/* Detail View: Shows selected SCP record */}
      {
        view === 'detail' && selectedIndex !== null && (
          <div className="detail">
            <h2>{records[selectedIndex].Title}</h2>
            <h4>{records[selectedIndex].Class}</h4>
            <img src={records[selectedIndex].Image} alt={records[selectedIndex].Title} />
            <p>{records[selectedIndex].Containment}</p>
            <p>{records[selectedIndex].Description}</p>

            {/* Navigation buttons for next/previous records */}
            <div className="navigation-buttons">
              <button
                onClick={() => setSelectedIndex((prev) => prev - 1)}
                disabled={selectedIndex === 0}
              >
                Back
              </button>
              <button
                onClick={() => setSelectedIndex((prev) => prev + 1)}
                disabled={selectedIndex === records.length - 1}
              >
                Next
              </button>
            </div>
          </div>
        )
      }

      {/* Admin View: Add/Edit/Delete SCP Records */}
      {
        view === 'admin' && (
          <div className="admin">
            <h2>Admin Panel</h2>

            {/* Table of existing records */}
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Class</th>
                  <th>Containment</th>
                  <th>Description</th>
                  <th>Image</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {records.map((rec) => (
                  <tr key={rec.id}>
                    <td>{rec.Title}</td>
                    <td>{rec.Class}</td>
                    <td>{rec.Containment}</td>
                    <td>{rec.Description}</td>
                    <td><img src={rec.Image} alt="" width="50" /></td>
                    <td>
                      {/* Fill form with record data for editing */}
                      <button onClick={() => setForm(rec)}>Edit</button>
                      {/* Delete the record */}
                      <button onClick={() => handleDelete(rec.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Form for creating or updating a record */}
            <div className="form">
              <input name="Title" value={form.Title} onChange={handleInputChange} placeholder="Title" />
              <input name="Class" value={form.Class} onChange={handleInputChange} placeholder="Class" />
              <input name="Containment" value={form.Containment} onChange={handleInputChange} placeholder="Containment" />
              <input name="Description" value={form.Description} onChange={handleInputChange} placeholder="Description" />
              <input name="Image" value={form.Image} onChange={handleInputChange} placeholder="Image URL" />

              {/* Show Update button if editing, else show Create */}
              {form.id ? (
                <button onClick={() => handleEdit(form.id)}>Update</button>
              ) : (
                <button onClick={handleSubmit}>Create</button>
              )}
            </div>
          </div>
        )
      }
    </div>
  );
}

export default App;
