import { useParams } from 'react-router-dom';

export default function ItineraryView() {
	const { tripId } = useParams();

	return (
		<main style={{ maxWidth: '760px', margin: '0 auto', padding: '32px 20px' }}>
			<h1>Itinerary</h1>
			<p>Trip: {tripId}</p>
			<section style={{ border: '1px solid #d9dee7', borderRadius: '6px', marginTop: '24px', padding: '20px' }}>
				<h2>Day-wise itinerary</h2>
				<p>Itinerary data will be available when the itinerary API is ready.</p>
			</section>
		</main>
	);
}
