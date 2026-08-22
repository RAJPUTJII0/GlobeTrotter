import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import '../styles/trip-form.css';
import { createTrip } from '../services/tripService.js';

const initialForm = { title: '', startDate: '', endDate: '', description: '' };

export default function CreateTrip() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const title = form.title.trim();

    if (!title || !form.startDate || !form.endDate) {
      setError('Trip name, start date, and end date are required.');
      return;
    }

    if (form.endDate < form.startDate) {
      setError('End date cannot be earlier than the start date.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    try {
      await createTrip({ title, description: form.description.trim(), startDate: form.startDate, endDate: form.endDate });
      navigate('/my-trips');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="app-shell">
      <Navbar />
      <main className="trip-form-page">
        <section className="form-intro"><p className="eyebrow">START PLANNING</p><h1>Create a new trip</h1><p>Give your journey a name and choose your travel dates. You can add cities and activities next.</p></section>
        <section className="trip-form-card" aria-labelledby="trip-details-heading">
          <h2 id="trip-details-heading">Trip details</h2>
          <form onSubmit={handleSubmit} noValidate>
            <label htmlFor="title">Trip name <span>*</span></label>
            <input id="title" name="title" value={form.title} onChange={updateField} placeholder="e.g. Golden Triangle Escape" />
            <div className="date-fields">
              <div><label htmlFor="startDate">Start date <span>*</span></label><input id="startDate" name="startDate" type="date" value={form.startDate} onChange={updateField} /></div>
              <div><label htmlFor="endDate">End date <span>*</span></label><input id="endDate" name="endDate" type="date" min={form.startDate || undefined} value={form.endDate} onChange={updateField} /></div>
            </div>
            <label htmlFor="description">Description <small>(optional)</small></label>
            <textarea id="description" name="description" value={form.description} onChange={updateField} placeholder="What kind of adventure are you planning?" rows="5" />
            {error && <p className="form-error" role="alert">{error}</p>}
            <div className="form-actions"><button className="cancel-button" disabled={isSubmitting} onClick={() => navigate('/dashboard')} type="button">Cancel</button><button className="primary-button" disabled={isSubmitting} type="submit">{isSubmitting ? 'Creating trip...' : 'Create trip →'}</button></div>
          </form>
        </section>
      </main>
    </div>
  );
}
