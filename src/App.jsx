import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import './App.css';

function App() {
 
  // Component State 
  const [records, setRecords] = useState([]);
  const [view, setView] = useState('home');
  const [selectedModel, setSelectedModel] = useState(null);
  const [form, setForm] = useState({ model: '', tagline: '', content: '', image: '' });

  // Fetch all records on application load
  useEffect(() => {
    fetchRecords();
  }, []);

  async function fetchRecords() {
    const { data, error } = await supabase.from('truck').select();
    if (!error) setRecords(data);
  }

  // generic input handler for form elements
  function handleInputChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Send request to Supabase to insert new record
  // Refresh list of records (fetchRecords) after new record submitted
  // Resets the form to empty
  async function handleSubmit() {
    await supabase.from('truck').insert([form]);
    fetchRecords();
    setForm({ model: '', tagline: '', content: '', image: '' });
  }

  // Delete record from Supabase then refresh records after deletion
  async function handleDelete(id) {
    await supabase.from('truck').delete().eq('id', id);
    fetchRecords();
  }

  // Send request to Supabase to update row / record in table
  // Then refetch all records from table (fetchRecords)
  async function handleEdit(id) {
    await supabase.from('truck').update(form).eq('id', id);
    fetchRecords();
    setForm({ model: '', tagline: '', content: '', image: '' });
  }

  return (
    <div className="app">
      {/* Nav section. Loop through each record and render a button using the model name */}
      <nav>
        <h2>Truck Models</h2>
        {
          records.map(
            (rec)=>(
              <button key={rec.id} onClick={()=>{setSelectedModel(rec); setView('detail')}}>{rec.model}</button>
            )
          )
        }
        {/* Admin button */}
        <button onClick={()=>setView('admin')}>Admin</button>
      </nav>

        {/* Display record section (detail view mode)*/}
        {
          view === 'detail' && selectedModel && (
            <div className="detail">
              <h2>{selectedModel.model}</h2>
              <h4>{selectedModel.tagline}</h4>
              <img src={selectedModel.image} alt={selectedModel.model} />
              <p>{selectedModel.content}</p>
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
                  <th>Model</th><th>Tagline</th><th>Content</th><th>Image</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {records.map((rec) => (
                  <tr key={rec.id}>
                    <td>{rec.model}</td>
                    <td>{rec.tagline}</td>
                    <td>{rec.content}</td>
                    <td><img src={rec.image} alt="" width="50" /></td>
                    <td>
                      <button onClick={() => setForm(rec)}>Edit</button>
                      <button onClick={() => handleDelete(rec.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="form">
              <input name="model" value={form.model} onChange={handleInputChange} placeholder="Model" />
              <input name="tagline" value={form.tagline} onChange={handleInputChange} placeholder="Tagline" />
              <input name="content" value={form.content} onChange={handleInputChange} placeholder="Content" />
              <input name="image" value={form.image} onChange={handleInputChange} placeholder="Image URL" />
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
