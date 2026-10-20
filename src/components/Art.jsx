import { useEffect, useState } from 'react'

const transformedImages = {
  'Optimus Prime': '/products/optimus-prime.png',
  'Megatron': '/products/megatron.png',
  'Bumblebee': '/products/bumblebee.png',
  'Starscream': '/products/starscream.png',
  'Grimlock': '/products/grimlock.png',
  'Ironhide': '/products/ironhide.png',
  'Soundwave': '/products/soundwave.png',
}

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
      <defs>
        <linearGradient id="box-top" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F36A61" />
          <stop offset="1" stopColor="#D94B45" />
        </linearGradient>
        <linearGradient id="box-left" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#E95A52" />
          <stop offset="1" stopColor="#C93D3A" />
        </linearGradient>
        <linearGradient id="box-right" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#D94A45" />
          <stop offset="1" stopColor="#B93435" />
        </linearGradient>
        <filter id="box-shadow" x="-20%" y="-20%" width="140%" height="160%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
      </defs>
      <ellipse className="gear-shadow" cx="200" cy="286" rx="112" ry="14" />
      <path className="gear-top" d="M200 42 316 88 200 134 84 88Z" />
      <path className="gear-left" d="M84 88 200 134v132L84 220Z" />
      <path className="gear-right" d="m200 134 116-46v132l-116 46Z" />
      <path className="gear-seam" d="M200 134v132M84 88l116 46 116-46" />
      <path className="gear-mark" d="m154 172 25 10-25 10M196 172l25 10-25 10" />
    </svg>
  )
}

// Product photo from image_url; falls back to the abstract art when empty or broken.
export default function Art({ product, robot }) {
  const [broken, setBroken] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [showTransformedImage, setShowTransformedImage] = useState(false)
  const transformed = robot || hovered
  const transformedImage = transformedImages[product.name]

  useEffect(() => {
    if (!transformed || !transformedImage) {
      setShowTransformedImage(false)
      return undefined
    }
    const timer = setTimeout(() => setShowTransformedImage(true), 850)
    return () => clearTimeout(timer)
  }, [transformed, transformedImage])

  if (product.image_url && !broken)
    return <img className="photo" src={product.image_url} alt={product.name} loading="lazy" onError={() => setBroken(true)} />
  if (product.category !== 'Figure') return <Box />

  return (
    <span className="figure-art" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <Fig robot={transformed} accent={`var(--${product.faction.toLowerCase()})`} />
      {transformedImage && !broken && (
        <img
          className={`photo figure-photo${showTransformedImage ? ' revealed' : ''}`}
          src={transformedImage}
          alt={`${product.name} transformed`}
          loading="lazy"
          onError={() => setBroken(true)}
        />
      )}
    </span>
  )
}
