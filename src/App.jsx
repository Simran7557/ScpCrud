import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import './App.css';

function App() {
  const [records, setRecords] = useState([]);
  const [view, setView] = useState('home');
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [form, setForm] = useState({ Title: '', Class: '', Image: '', Containment: '', Description: '' });

  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    fetchRecords();
  }, []);

  async function fetchRecords() {
    const { data, error } = await supabase.from('ScpData').select();
    if (!error) {
      const sortedData = data.sort((a, b) => a.id - b.id);
      setRecords(sortedData);
    }
  }

  function handleInputChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit() {
    await supabase.from('ScpData').insert([form]);
    fetchRecords();
    setForm({ Title: '', Class: '', Image: '', Containment: '', Description: '' });
  }

  async function handleDelete(id) {
    await supabase.from('ScpData').delete().eq('id', id);
    fetchRecords();
  }

  async function handleEdit(id) {
    await supabase.from('ScpData').update(form).eq('id', id);
    fetchRecords();
    setForm({ Title: '', Class: '', Image: '', Containment: '', Description: '' });
  }

  return (
    <div className="app">
      <nav>
        <h2>SCP Foundation</h2>
        <button onClick={toggleMenu}>
          {isOpen ? 'Close Menu' : 'Open Menu'}
        </button>
        {isOpen && (
          <ul className={isOpen ? 'menu open' : 'menu closed'}>
            {records.map((rec, idx) => (
              <li key={rec.id} onClick={() => { setSelectedIndex(idx); setView('detail'); setIsOpen(false); }}>
                {rec.Title}
              </li>
            ))}
            <li onClick={() => { setView('admin'); setIsOpen(false); }}>Admin</li>
          </ul>
        )}
      </nav>

      {/* Detail View */}
      {
        view === 'detail' && selectedIndex !== null && (
          <div className="detail">
            <h2>{records[selectedIndex].Title}</h2>
            <h4>{records[selectedIndex].Class}</h4>
            <img src={records[selectedIndex].Image} alt={records[selectedIndex].Title} />
            <p>{records[selectedIndex].Containment}</p>
            <p>{records[selectedIndex].Description}</p>

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

      {/* Admin View */}
      {
        view === 'admin' && (
          <div className="admin">
            <h2>Admin Panel</h2>
            <table>
              <thead>
                <tr>
                  <th>Title</th><th>Class</th><th>Containment</th><th>Description</th><th>Image</th><th>Actions</th>
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
                      <button onClick={() => setForm(rec)}>Edit</button>
                      <button onClick={() => handleDelete(rec.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="form">
              <input name="Title" value={form.Title} onChange={handleInputChange} placeholder="Title" />
              <input name="Class" value={form.Class} onChange={handleInputChange} placeholder="Class" />
              <input name="Containment" value={form.Containment} onChange={handleInputChange} placeholder="Containment" />
              <input name="Description" value={form.Description} onChange={handleInputChange} placeholder="Description" />
              <input name="Image" value={form.Image} onChange={handleInputChange} placeholder="Image URL" />
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
