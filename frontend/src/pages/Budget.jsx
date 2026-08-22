import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BudgetChart from '../components/BudgetChart.jsx';
import { createExpense, deleteExpense, getBudget, getExpenses } from '../services/tripService.js';
const categories=['transport','stay','food','other'];
export default function Budget() {
  const { tripId }=useParams(); const [budget,setBudget]=useState(null); const [expenses,setExpenses]=useState([]); const [form,setForm]=useState({category:'transport',amount:'',note:''}); const [error,setError]=useState('');
  const load=()=>Promise.all([getBudget(tripId),getExpenses(tripId)]).then(([b,e])=>{setBudget(b);setExpenses(e.expenses);}).catch(e=>setError(e.message)); useEffect(()=>{load();},[tripId]);
  async function add(e){e.preventDefault();try{await createExpense(tripId,{...form,amount:Number(form.amount)});setForm({category:'transport',amount:'',note:''});load();}catch(err){setError(err.message);}}
  async function remove(id){try{await deleteExpense(tripId,id);load();}catch(err){setError(err.message);}}
  if(!budget)return <main><p>{error||'Loading budget...'}</p></main>; const categoriesData=Object.entries(budget.breakdown).map(([category,total])=>({category,total}));
  return <main style={{maxWidth:760,margin:'0 auto',padding:32}}><h1>Budget</h1>{error&&<p role="alert">{error}</p>}<BudgetChart categories={categoriesData}/><p>Total: ₹{budget.total.toFixed(2)} · Average/day: ₹{budget.averagePerDay.toFixed(2)}</p><p>Budget limit: {budget.budgetLimit===null?'Not set':`₹${budget.budgetLimit.toFixed(2)}`} · Remaining: {budget.remaining===null?'--':`₹${budget.remaining.toFixed(2)}`}</p><h2>Add expense</h2><form onSubmit={add}><select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>{categories.map(c=><option key={c}>{c}</option>)}</select><input required type="number" min="0" step="0.01" placeholder="Amount" value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})}/><input placeholder="Note" value={form.note} onChange={e=>setForm({...form,note:e.target.value})}/><button>Add</button></form><ul>{expenses.map(e=><li key={e.id}>{e.category}: ₹{e.amount} {e.note}<button onClick={()=>remove(e.id)}>Delete</button></li>)}</ul></main>;
}
