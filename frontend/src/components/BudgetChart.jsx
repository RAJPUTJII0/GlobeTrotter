export default function BudgetChart({ categories = [] }) {
	if (categories.length === 0) {
		return <p>No budget data available yet.</p>;
	}

	const maximum = Math.max(...categories.map((item) => Number(item.total) || 0), 1);

	return (
		<section aria-label="Budget breakdown">
			{categories.map((item) => {
				const total = Number(item.total) || 0;
				return (
					<div key={item.category} style={{ marginTop: '12px' }}>
						<div style={{ display: 'flex', justifyContent: 'space-between' }}>
							<strong>{item.category}</strong>
							<span>{total.toFixed(2)}</span>
						</div>
						<div style={{ background: '#eef1f5', height: '8px', marginTop: '6px' }}>
							<div style={{ background: '#315c8c', height: '100%', width: `${(total / maximum) * 100}%` }} />
						</div>
					</div>
				);
			})}
		</section>
	);
}
