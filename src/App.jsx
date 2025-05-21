import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import './App.css';

function App() {
  const [records, setRecords] = useState([]);
  const [view, setView] = useState('home');
  const [selectedTitle, setSelectedTitle] = useState(null);
  const [form, setForm] = useState({ Title: '', Class: '', Image: '', Containment: '', Description: '' });

  // 🔧 Fix: Add isOpen state
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
      {/* Nav section. Loop through each record and render a button using the model name */}
      <nav>
        <h2>SCP Foundation</h2>
        <button onClick={toggleMenu}>
          {isOpen ? 'Close Menu' : 'Open Menu'}
        </button>
        {/* Only show menu when isOpen is true */}
        {isOpen && (
          <ul className={isOpen ? 'menu open' : 'menu closed'}>
            {records.map((rec) => (
              <li key={rec.id} onClick={() => { setSelectedTitle(rec); setView('detail'); setIsOpen(false); }}>
                {rec.Title}
              </li>
            ))}
            <li onClick={() => { setView('admin'); setIsOpen(false); }}>Admin</li>
          </ul>
        )}
      </nav>



      {/* Display record section (detail view mode)*/}
      {
        view === 'detail' && selectedTitle && (
          <div className="detail">
            <h2>{selectedTitle.Title}</h2>
            <h4>{selectedTitle.Class}</h4>
            <img src={selectedTitle.Image} alt={selectedTitle.Title} />
            <p>{selectedTitle.Containment}</p>
            <p>{selectedTitle.Description}</p>
          </div>
        )
      }

      {/* Admin section CRUD functions* (admin view mode)*/}
      {
        view === 'admin' && (
          <div className="admin">
            <h2>Admin Panel</h2>
            <table>
              <thead>
                <tr>
                  <th>Title</th><th>Class</th><th>Image</th><th>Containment</th><th>Description</th><th>Actions</th>
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
  )
}

export default App
