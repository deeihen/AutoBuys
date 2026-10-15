import { useState } from 'react'

// Abstract transforming figure. Add the `robot` class to unfold it.
export function Fig({ robot = false, accent }) {
  return (
    <svg className={`fig${robot ? ' robot' : ''}`} viewBox="0 0 400 320" aria-hidden="true" focusable="false" style={accent ? { '--acc': accent } : undefined}>
      <rect className="p p-legL" x="150" y="192" width="44" height="96" style={{ '--d': '.05s' }} />
      <rect className="p p-legR" x="206" y="192" width="44" height="96" style={{ '--d': '.05s' }} />
      <rect className="p p-hips" x="150" y="158" width="100" height="30" style={{ '--d': '.1s' }} />
      <rect className="p p-torso" x="140" y="64" width="120" height="90" />
      <rect className="p p-armL" x="104" y="68" width="30" height="96" style={{ '--d': '.12s' }} />
      <rect className="p p-armR" x="266" y="68" width="30" height="96" style={{ '--d': '.12s' }} />
      <rect className="p p-head" x="178" y="20" width="44" height="38" style={{ '--d': '.18s' }} />
      <rect className="p p-eye" x="184" y="33" width="32" height="9" style={{ '--d': '.18s' }} />
      <circle className="p p-wheelL" cx="122" cy="70" r="18" style={{ '--d': '.2s' }} />
      <circle className="p p-wheelR" cx="278" cy="70" r="18" style={{ '--d': '.2s' }} />
    </svg>
  )
}

function Box() {
  return (
    <svg className="fig gear" viewBox="0 0 400 320" aria-hidden="true" focusable="false">
      <path d="M90 90 200 50 310 90 310 240 200 280 90 240Z" />
      <path className="edge" d="M90 90 200 130 310 90M200 130V280" />
      <path className="mark" d="M150 176l30 14-30 14M190 176l30 14-30 14" />
    </svg>
  )
}

// Product photo from image_url; falls back to the abstract art when empty or broken.
export default function Art({ product, robot }) {
  const [broken, setBroken] = useState(false)
  if (product.image_url && !broken)
    return <img className="photo" src={product.image_url} alt={product.name} loading="lazy" onError={() => setBroken(true)} />
  return product.category === 'Figure' ? <Fig robot={robot} /> : <Box />
}
