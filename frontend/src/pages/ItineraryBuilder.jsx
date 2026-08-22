import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ActivityCard from '../components/ActivityCard.jsx';
import { addActivity, deleteActivity, getActivities } from '../services/activityService.js';
import {
	createTripStop,
	deleteTripStop,
	getCities,
	getItinerary,
	getTripStops,
	getTrips,
} from '../services/tripService.js';

const sectionStyle = {
	border: '1px solid #d9dee7',
	borderRadius: '6px',
	marginTop: '24px',
	padding: '20px',
};

export default function ItineraryBuilder() {
	const { tripId } = useParams();
	const [trips, setTrips] = useState([]);
	const [cities, setCities] = useState([]);
	const [stops, setStops] = useState([]);
	const [form, setForm] = useState({ cityId: '', startDate: '', endDate: '' });
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [removingStopId, setRemovingStopId] = useState('');
	const [error, setError] = useState('');
	const [selectedStopId, setSelectedStopId] = useState('');
	const [activities, setActivities] = useState([]);
	const [addedActivities, setAddedActivities] = useState({});
	const [activitiesLoading, setActivitiesLoading] = useState(false);
	const [activitySaving, setActivitySaving] = useState(false);
	const [removingActivityId, setRemovingActivityId] = useState('');
	const [activityError, setActivityError] = useState('');
	const [activityForm, setActivityForm] = useState({ scheduledDate: '', scheduledTime: '', customCost: '' });

	useEffect(() => {
		async function loadTrips() {
			try {
				const availableTrips = await getTrips();
				setTrips(availableTrips);
			} catch (requestError) {
				setError(requestError.message || 'Unable to load trips.');
			} finally {
				setLoading(false);
			}
		}

		loadTrips();
	}, []);

	useEffect(() => {
		if (!tripId) return undefined;

		async function loadItineraryData() {
			setLoading(true);
			setError('');
			try {
				const [availableCities, tripStops, itinerary] = await Promise.all([
					getCities(),
					getTripStops(tripId),
					getItinerary(tripId),
				]);
				setCities(availableCities);
				setStops(tripStops);
				const savedActivities = {};
				(itinerary.stops || []).forEach((stop) => (stop.activities || []).forEach((item) => {
					savedActivities[item.id] = {
						id: item.id,
						trip_stop_id: stop.id,
						activity_id: item.activityId,
						custom_cost: item.cost,
						activity: { id: item.activityId, name: item.name, category: item.category, duration_hours: item.durationHours, estimated_cost: item.cost },
					};
				}));
				setAddedActivities(savedActivities);
			} catch (requestError) {
				setError(requestError.message || 'Unable to load itinerary data.');
			} finally {
				setLoading(false);
			}
		}

		loadItineraryData();
		return undefined;
	}, [tripId]);

	function updateForm(event) {
		setForm({ ...form, [event.target.name]: event.target.value });
	}

	async function selectStop(stop) {
		const cityId = stop.cityId || stop.city_id || stop.city?.id;
		setSelectedStopId(stop.id);
		setActivityError('');
		if (!cityId) {
			setActivities([]);
			setActivityError('Cannot load activities because this stop does not include a cityId.');
			return;
		}
		setActivitiesLoading(true);
		setActivities([]);
		try {
			const response = await getActivities(cityId);
			setActivities(response.activities || []);
			setActivityForm({ scheduledDate: stop.startDate || stop.start_date || '', scheduledTime: '', customCost: '' });
		} catch (requestError) {
			setActivityError(requestError.message || 'Unable to load activities.');
		} finally {
			setActivitiesLoading(false);
		}
	}

	function updateActivityForm(event) {
		setActivityForm({ ...activityForm, [event.target.name]: event.target.value });
	}

	async function handleAddActivity(activity) {
		const selectedStop = stops.find((stop) => stop.id === selectedStopId);
		if (!selectedStop) return;
		setActivitySaving(true);
		setActivityError('');
		try {
			const response = await addActivity(selectedStop.id, {
				activityId: activity.id,
				scheduledDate: activityForm.scheduledDate,
				scheduledTime: activityForm.scheduledTime,
				customCost: activityForm.customCost === '' ? Number(activity.estimated_cost || 0) : Number(activityForm.customCost),
			});
			const stopActivity = response.stopActivity;
			setAddedActivities({ ...addedActivities, [stopActivity.id]: { ...stopActivity, activity } });
		} catch (requestError) {
			setActivityError(requestError.message || 'Unable to add activity.');
		} finally {
			setActivitySaving(false);
		}
	}

	async function handleRemoveActivity(stopActivityId) {
		setRemovingActivityId(stopActivityId);
		setActivityError('');
		try {
			await deleteActivity(stopActivityId);
			const nextAddedActivities = { ...addedActivities };
			delete nextAddedActivities[stopActivityId];
			setAddedActivities(nextAddedActivities);
		} catch (requestError) {
			setActivityError(requestError.message || 'Unable to remove activity.');
		} finally {
			setRemovingActivityId('');
		}
	}

	const selectedStop = stops.find((stop) => stop.id === selectedStopId);
	const selectedStopActivities = Object.values(addedActivities).filter((item) => item.trip_stop_id === selectedStopId);

	async function handleAddStop(event) {
		event.preventDefault();
		setSaving(true);
		setError('');
		try {
			const newStop = await createTripStop(tripId, {
				...form,
				stopOrder: stops.length + 1,
			});
			const city = cities.find((item) => item.id === newStop.cityId);
			setStops([...stops, { ...newStop, city }]);
			setForm({ cityId: '', startDate: '', endDate: '' });
		} catch (requestError) {
			setError(requestError.message || 'Unable to add city.');
		} finally {
			setSaving(false);
		}
	}

	async function handleRemoveStop(stopId) {
		setRemovingStopId(stopId);
		setError('');
		try {
			await deleteTripStop(tripId, stopId);
			setStops(stops.filter((stop) => stop.id !== stopId));
		} catch (requestError) {
			setError(requestError.message || 'Unable to remove city.');
		} finally {
			setRemovingStopId('');
		}
	}

	const selectedTrip = trips.find((trip) => trip.id === tripId);

	return (
		<main style={{ maxWidth: '760px', margin: '0 auto', padding: '32px 20px' }}>
			<h1>Itinerary Builder</h1>
			<p>{selectedTrip ? `Plan stops for ${selectedTrip.title}` : 'Build your trip one city at a time.'}</p>

			{error && <p role="alert" style={{ color: '#b42318' }}>{error}</p>}

			<section style={sectionStyle}>
				<label htmlFor="trip-select"><strong>Trip</strong></label>
				<select
					id="trip-select"
					value={tripId}
					disabled
					style={{ display: 'block', marginTop: '8px', minWidth: '240px', padding: '8px' }}
				>
					<option value="">Select a trip</option>
					{trips.map((trip) => <option key={trip.id} value={trip.id}>{trip.title}</option>)}
				</select>
			</section>

			<section style={sectionStyle}>
				<h2>City stops</h2>
				{loading && <p>Loading itinerary...</p>}
				{!loading && tripId && stops.length === 0 && <p>No cities added yet.</p>}
				{!loading && !tripId && <p>Select a trip to view its stops.</p>}
				{!loading && stops.length > 0 && (
					<ol>
						{stops.map((stop) => (
							<li key={stop.id} style={{ marginBottom: '14px' }}>
								<strong>{stop.city?.name || 'Unknown city'}</strong>
								{stop.city?.country && `, ${stop.city.country}`}
								<span> ({stop.startDate} to {stop.endDate})</span>
								<button
									type="button"
									onClick={() => handleRemoveStop(stop.id)}
									disabled={removingStopId === stop.id}
									style={{ marginLeft: '12px' }}
								>
									{removingStopId === stop.id ? 'Removing...' : 'Remove'}
								</button>
								<button type="button" onClick={() => selectStop(stop)} style={{ marginLeft: '12px' }}>
									{selectedStopId === stop.id ? 'Selected' : 'Add Activity'}
								</button>
							</li>
						))}
					</ol>
				)}
			</section>

			{selectedStop && (
				<section style={sectionStyle}>
					<h2>Activities for {selectedStop.city?.name || 'selected city'}</h2>
					{activityError && <p role="alert" style={{ color: '#b42318' }}>{activityError}</p>}
					{activitiesLoading && <p>Loading activities...</p>}
					{!activitiesLoading && activities.length === 0 && !activityError && <p>No activities available for this city.</p>}
					{activities.length > 0 && (
						<>
							<label htmlFor="activity-date">Scheduled date</label>
							<input id="activity-date" name="scheduledDate" type="date" value={activityForm.scheduledDate} onChange={updateActivityForm} />
							<label htmlFor="activity-time">Scheduled time</label>
							<input id="activity-time" name="scheduledTime" type="time" value={activityForm.scheduledTime} onChange={updateActivityForm} />
							<label htmlFor="activity-cost">Custom cost</label>
							<input id="activity-cost" name="customCost" type="number" min="0" step="0.01" value={activityForm.customCost} onChange={updateActivityForm} placeholder="Uses estimated cost" />
							{activities.map((activity) => {
								const addedActivity = Object.values(addedActivities).find((item) => item.activity_id === activity.id && item.trip_stop_id === selectedStopId);
								return (
									<ActivityCard
										key={activity.id}
										activity={activity}
										addedActivity={addedActivity}
										onAdd={handleAddActivity}
										onRemove={handleRemoveActivity}
										adding={activitySaving}
										removing={removingActivityId === addedActivity?.id}
									/>
								);
							})}
							{selectedStopActivities.length > 0 && <p>{selectedStopActivities.length} activity added to this stop.</p>}
						</>
					)}
				</section>
			)}

			<section style={sectionStyle}>
				<h2>Add a city</h2>
				<form onSubmit={handleAddStop}>
					<label htmlFor="city-select">City</label>
					<select id="city-select" name="cityId" value={form.cityId} onChange={updateForm} required disabled={!tripId || loading}>
						<option value="">Select a city</option>
						{cities.map((city) => <option key={city.id} value={city.id}>{city.name}, {city.country}</option>)}
					</select>
					<label htmlFor="start-date">Start date</label>
					<input id="start-date" name="startDate" type="date" value={form.startDate} onChange={updateForm} required disabled={!tripId || loading} />
					<label htmlFor="end-date">End date</label>
					<input id="end-date" name="endDate" type="date" value={form.endDate} onChange={updateForm} required disabled={!tripId || loading} />
					<button type="submit" disabled={!tripId || loading || saving}>
						{saving ? 'Adding...' : 'Add city'}
					</button>
				</form>
			</section>
		</main>
	);
}
