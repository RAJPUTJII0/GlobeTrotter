import BudgetChart from '../components/BudgetChart.jsx';

const budgetCategories = ['Transport', 'Stay', 'Food', 'Activities'];

export default function Budget() {
	return (
		<main style={{ maxWidth: '760px', margin: '0 auto', padding: '32px 20px' }}>
			<h1>Budget</h1>
			<p>Budget data will be available when the budget API is ready.</p>
			<section style={{ border: '1px solid #d9dee7', borderRadius: '6px', marginTop: '24px', padding: '20px' }}>
				<h2>Budget breakdown</h2>
				<BudgetChart categories={[]} />
				<ul>
					{budgetCategories.map((category) => <li key={category}>{category}: --</li>)}
					<li><strong>Total: --</strong></li>
					<li>Remaining budget: --</li>
				</ul>
			</section>
		</main>
	);
}
