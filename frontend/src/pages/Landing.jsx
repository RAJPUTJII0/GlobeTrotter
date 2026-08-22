import { Link } from 'react-router-dom';
import TravelImage from '../components/TravelImage.jsx';

const destinations = [
  { name: 'Jaipur', country: 'India', image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=900&q=85' },
  { name: 'Amalfi Coast', country: 'Italy', image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=900&q=85' },
  { name: 'Kyoto', country: 'Japan', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=900&q=85' },
];

export default function Landing() {
  return <main className="landing-page">
    <header className="landing-nav"><Link className="nav-brand" to="/"><span>✦</span> GlobeTrotter</Link><nav><Link to="/login">Log in</Link><Link className="button button-small" to="/signup">Get started <span>↗</span></Link></nav></header>
    <section className="landing-hero">
      <div className="hero-copy"><p className="eyebrow light">YOUR NEXT CHAPTER</p><h1>Plan journeys<br /><em>you'll never forget.</em></h1><p className="hero-lede">Create personalized itineraries, discover experiences, manage your budget, and share your journey — all in one beautiful place.</p><div className="hero-actions"><Link className="button" to="/signup">Start planning <span>↗</span></Link><Link className="text-link light-link" to="/login">Explore the demo <span>→</span></Link></div><div className="hero-proof"><span className="avatar-stack"><i>A</i><i>R</i><i>M</i></span><span><strong>Loved by curious travellers</strong><small>Make room for more adventure.</small></span></div></div>
      <div className="hero-preview"><TravelImage className="hero-photo" alt="A traveller looking over a mountain valley" src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1400&q=90" /><div className="preview-card"><span className="status-dot">● LIVE ITINERARY</span><h3>Summer in the Dolomites</h3><p>5 days · 3 cities · 12 experiences</p><div className="preview-progress"><span style={{ width: '68%' }} /></div><small>68% planned</small></div></div>
    </section>
    <section className="landing-section feature-section"><div className="section-intro"><p className="eyebrow">EVERYTHING IN ONE PLACE</p><h2>Your trip, thoughtfully put together.</h2><p>From the first spark of inspiration to the last sunset, GlobeTrotter keeps every detail feeling effortless.</p></div><div className="feature-grid"><article><span className="feature-icon">✦</span><h3>Smart itineraries</h3><p>Turn places you love into a day-by-day plan that feels like you.</p></article><article><span className="feature-icon orange">◌</span><h3>Know your budget</h3><p>See the full picture before you go, with calm, clear spending insights.</p></article><article><span className="feature-icon teal">↗</span><h3>Share the feeling</h3><p>Invite friends into the journey or publish a trip worth bookmarking.</p></article></div></section>
    <section className="landing-section destinations-section"><div className="section-heading"><div><p className="eyebrow">GO SOMEWHERE NEW</p><h2>Places worth a detour.</h2></div><Link className="text-link" to="/signup">See inspiration →</Link></div><div className="destination-showcase">{destinations.map((destination) => <article key={destination.name}><TravelImage src={destination.image} alt={`${destination.name}, ${destination.country}`} /><div><h3>{destination.name}</h3><p>{destination.country}</p></div></article>)}</div></section>
    <section className="landing-cta"><p className="eyebrow light">THE WORLD IS WAITING</p><h2>Ready to make a plan?</h2><p>Good trips begin with a little bit of wonder.</p><Link className="button button-light" to="/signup">Create your free trip <span>↗</span></Link></section>
    <footer className="landing-footer"><span>✦ GlobeTrotter</span><span>Made for the wonderfully curious.</span></footer>
  </main>;
}
