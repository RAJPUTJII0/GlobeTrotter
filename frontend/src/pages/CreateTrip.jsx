import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import '../styles/trip-form.css';
import { createTrip } from '../services/tripService.js';

const currencies = { INR: '₹ INR', USD: '$ USD', EUR: '€ EUR', GBP: '£ GBP', JPY: '¥ JPY', AED: 'د.إ AED', AUD: 'A$ AUD' };
const travelStyles = ['Culture', 'Food', 'Adventure', 'Nature', 'Nightlife', 'Shopping', 'Relaxation', 'Photography'];
const initialForm = { title: '', startDate: '', endDate: '', description: '', budgetLimit: '', currency: 'INR', travelStyles: [] };

export default function CreateTrip() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function toggleStyle(style) {
    setForm((current) => ({ ...current, travelStyles: current.travelStyles.includes(style) ? current.travelStyles.filter((item) => item !== style) : [...current.travelStyles, style] }));
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

    if (form.budgetLimit !== '' && (!Number.isFinite(Number(form.budgetLimit)) || Number(form.budgetLimit) < 0)) {
      setError('Budget limit must be a non-negative number.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    try {
      await createTrip({ title, description: form.description.trim(), startDate: form.startDate, endDate: form.endDate, budgetLimit: form.budgetLimit === '' ? null : Number(form.budgetLimit), currency: form.currency, travelStyles: form.travelStyles });
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
            <label htmlFor="budgetLimit">Budget limit <small>(optional)</small></label>
            <input id="budgetLimit" name="budgetLimit" type="number" min="0" step="0.01" value={form.budgetLimit} onChange={updateField} placeholder="e.g. 50000" />
            <label htmlFor="currency">Currency</label>
            <select id="currency" name="currency" value={form.currency} onChange={updateField}>{Object.entries(currencies).map(([code, label]) => <option key={code} value={code}>{label}</option>)}</select>
            <fieldset><legend>Travel style (optional)</legend><div className="style-chips">{travelStyles.map((style) => <button className={form.travelStyles.includes(style) ? 'style-chip selected' : 'style-chip'} key={style} onClick={() => toggleStyle(style)} type="button" aria-pressed={form.travelStyles.includes(style)}>{form.travelStyles.includes(style) ? '✓ ' : ''}{style}</button>)}</div></fieldset>
            {error && <p className="form-error" role="alert">{error}</p>}
            <div className="form-actions"><button className="cancel-button" disabled={isSubmitting} onClick={() => navigate('/dashboard')} type="button">Cancel</button><button className="primary-button" disabled={isSubmitting} type="submit">{isSubmitting ? 'Creating trip...' : 'Create trip →'}</button></div>
          </form>
        </section>
      </main>
    </div>
  );
}
