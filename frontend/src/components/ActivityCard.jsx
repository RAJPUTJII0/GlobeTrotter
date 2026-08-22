const cardStyle = {
	border: '1px solid #d9dee7',
	borderRadius: '6px',
	padding: '14px',
	marginTop: '12px',
	display: 'grid',
	gap: '8px',
};

const imageStyle = {
	width: '100%',
	maxHeight: '140px',
	objectFit: 'cover',
	borderRadius: '4px',
};

function formatDuration(value) {
	const duration = Number(value);
	return Number.isFinite(duration) ? `${duration} hours` : 'Not specified';
}

function formatCost(value) {
	const cost = Number(value);
	return Number.isFinite(cost) ? cost.toFixed(2) : '0.00';
}

export default function ActivityCard({
	activity,
	addedActivity,
	onAdd,
	onRemove,
	adding = false,
	removing = false,
}) {
	const customCost = Number(addedActivity?.custom_cost);

	return (
		<article style={cardStyle}>
			{activity.image_url && (
				<img src={activity.image_url} alt="" style={imageStyle} />
			)}
			<h3 style={{ margin: 0 }}>{activity.name}</h3>
			<p style={{ margin: 0 }}>{activity.category || 'Uncategorized'}</p>
			<p style={{ margin: 0 }}>Duration: {formatDuration(activity.duration_hours)}</p>
			<p style={{ margin: 0 }}>Estimated cost: {formatCost(activity.estimated_cost)}</p>
			{addedActivity ? (
				<>
					<p style={{ margin: 0 }}>Added cost: {Number.isFinite(customCost) ? customCost.toFixed(2) : '0.00'}</p>
					<button type="button" onClick={() => onRemove(addedActivity.id)} disabled={removing}>
						{removing ? 'Removing...' : 'Remove activity'}
					</button>
				</>
			) : (
				<button type="button" onClick={() => onAdd(activity)} disabled={adding}>
					{adding ? 'Adding...' : 'Add activity'}
				</button>
			)}
		</article>
	);
}
