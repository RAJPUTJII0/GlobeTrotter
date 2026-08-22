const FALLBACK = 'linear-gradient(135deg, #123b4a 0%, #167d87 52%, #f2b880 100%)';

export default function TravelImage({ src, alt = '', className = '', style, ...props }) {
  function handleError(event) {
    event.currentTarget.style.display = 'none';
    event.currentTarget.parentElement?.classList.add('image-fallback');
  }

  return <div className={`travel-image ${className}`} style={{ backgroundImage: FALLBACK, ...style }} {...props}>
    {src && <img src={src} alt={alt} onError={handleError} loading="lazy" />}
  </div>;
}
