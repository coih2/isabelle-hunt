import { useEffect, useRef } from 'react'

const PALETTE = [
  { fill: [255, 176, 198], glow: [255, 214, 226] },
  { fill: [186, 168, 255], glow: [222, 214, 255] },
  { fill: [156, 232, 214], glow: [198, 245, 232] },
  { fill: [255, 210, 150], glow: [255, 232, 196] },
  { fill: [154, 206, 255], glow: [198, 228, 255] },
  { fill: [255, 186, 170], glow: [255, 220, 208] },
  { fill: [210, 186, 255], glow: [232, 218, 255] },
  { fill: [180, 236, 190], glow: [214, 248, 220] },
]

const KINDS = [
  ...Array.from({ length: 6 }, () => 'medium'),
  ...Array.from({ length: 5 }, () => 'large'),
  ...Array.from({ length: 3 }, () => 'huge'),
]

function radiusFor(kind, minDim) {
  if (kind === 'medium') return minDim * (0.48 + Math.random() * 0.22)
  if (kind === 'large') return minDim * (0.78 + Math.random() * 0.28)
  return minDim * (1.12 + Math.random() * 0.38)
}

function speedFor(kind) {
  if (kind === 'medium') return 0.55 + Math.random() * 0.85
  if (kind === 'large') return 0.32 + Math.random() * 0.45
  return 0.18 + Math.random() * 0.28
}

function spawn(width, height, kind, fromEdge) {
  const minDim = Math.min(width, height)
  const radius = radiusFor(kind, minDim)
  const pal = PALETTE[Math.floor(Math.random() * PALETTE.length)]
  const speed = speedFor(kind)
  const angle = Math.random() * Math.PI * 2
  let x = Math.random() * width
  let y = Math.random() * height
  let driftX = Math.cos(angle) * speed
  let driftY = Math.sin(angle) * speed * 0.78

  if (fromEdge) {
    const edge = Math.floor(Math.random() * 4)
    const inset = radius + 6
    if (edge === 0) {
      x = -inset
      y = Math.random() * height
      driftX = Math.abs(driftX)
    } else if (edge === 1) {
      x = width + inset
      y = Math.random() * height
      driftX = -Math.abs(driftX)
    } else if (edge === 2) {
      x = Math.random() * width
      y = -inset
      driftY = Math.abs(driftY)
    } else {
      x = Math.random() * width
      y = height + inset
      driftY = -Math.abs(driftY)
    }
  }

  return {
    x,
    y,
    radius,
    kind,
    z:
      kind === 'huge'
        ? 0.08 + Math.random() * 0.18
        : kind === 'large'
          ? 0.28 + Math.random() * 0.28
          : 0.58 + Math.random() * 0.4,
    driftX,
    driftY,
    vx: 0,
    vy: 0,
    phase: Math.random() * Math.PI * 2,
    wobble: 0.4 + Math.random() * 1.1,
    pal,
  }
}

export default function BubbleField() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d', { alpha: false })
    const mouse = { x: -9999, y: -9999, px: -9999, py: -9999, vx: 0, vy: 0 }
    let raf = 0
    let width = 0
    let height = 0
    let dpr = 1
    let bubbles = []

    const seed = () => {
      bubbles = KINDS.map((kind, i) => spawn(width, height, kind, i > 8))
    }

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      if (!bubbles.length) seed()
    }

    const onPointer = (event) => {
      mouse.x = event.clientX
      mouse.y = event.clientY
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onPointer)

    const drawBubble = (b) => {
      const { x: cx, y: cy, radius } = b
      const [r, g, bl] = b.pal.fill
      const [gr, gg, gb] = b.pal.glow
      const depth = b.kind === 'huge' ? 0.62 : b.kind === 'large' ? 0.78 : 0.92

      const halo = ctx.createRadialGradient(cx, cy, radius * 0.12, cx, cy, radius * 1.4)
      halo.addColorStop(0, `rgba(${r},${g},${bl},${0.4 * depth})`)
      halo.addColorStop(0.55, `rgba(${r},${g},${bl},${0.14 * depth})`)
      halo.addColorStop(1, `rgba(${r},${g},${bl},0)`)
      ctx.fillStyle = halo
      ctx.beginPath()
      ctx.arc(cx, cy, radius * 1.4, 0, Math.PI * 2)
      ctx.fill()

      const hx = cx - radius * 0.3
      const hy = cy - radius * 0.34
      const body = ctx.createRadialGradient(hx, hy, radius * 0.04, cx + radius * 0.12, cy + radius * 0.18, radius)
      body.addColorStop(0, `rgba(255,255,255,${0.9 * depth})`)
      body.addColorStop(0.16, `rgba(${gr},${gg},${gb},${0.76 * depth})`)
      body.addColorStop(0.42, `rgba(${r},${g},${bl},${0.5 * depth})`)
      body.addColorStop(0.8, `rgba(${Math.max(r - 50, 0)},${Math.max(g - 45, 0)},${Math.max(bl - 20, 0)},${0.32 * depth})`)
      body.addColorStop(1, `rgba(${r},${g},${bl},0.04)`)
      ctx.fillStyle = body
      ctx.beginPath()
      ctx.arc(cx, cy, radius, 0, Math.PI * 2)
      ctx.fill()

      ctx.strokeStyle = `rgba(255,255,255,${0.42 * depth})`
      ctx.lineWidth = Math.max(1.1, radius * 0.012)
      ctx.beginPath()
      ctx.arc(cx, cy, radius * 0.985, 0, Math.PI * 2)
      ctx.stroke()

      ctx.fillStyle = `rgba(255,255,255,${0.58 * depth})`
      ctx.beginPath()
      ctx.ellipse(cx - radius * 0.3, cy - radius * 0.34, radius * 0.2, radius * 0.11, -0.55, 0, Math.PI * 2)
      ctx.fill()
    }

    const tick = () => {
      mouse.vx += (mouse.x - mouse.px - mouse.vx) * 0.45
      mouse.vy += (mouse.y - mouse.py - mouse.vy) * 0.45
      mouse.px = mouse.x
      mouse.py = mouse.y

      const wash = ctx.createLinearGradient(0, 0, width, height)
      wash.addColorStop(0, 'hsl(330, 38%, 94%)')
      wash.addColorStop(0.5, 'hsl(210, 36%, 95%)')
      wash.addColorStop(1, 'hsl(280, 32%, 93%)')
      ctx.fillStyle = wash
      ctx.fillRect(0, 0, width, height)

      const speed = Math.hypot(mouse.vx, mouse.vy)
      const stirring = speed > 0.6
      const wake = 130

      for (let i = 0; i < bubbles.length; i += 1) {
        const b = bubbles[i]
        b.phase += 0.012 * b.wobble

        if (stirring) {
          const dx = b.x - mouse.x
          const dy = b.y - mouse.y
          const dist = Math.hypot(dx, dy) || 1
          const falloff = Math.exp(-(dist * dist) / (2 * wake * wake))
          if (falloff > 0.02) {
            const lightness = b.kind === 'medium' ? 0.9 : b.kind === 'large' ? 0.5 : 0.28
            const impulse = falloff * Math.min(speed, 28) * lightness * 0.055
            b.vx += mouse.vx * impulse
            b.vy += mouse.vy * impulse
            b.vx += (dx / dist) * impulse * 4.2
            b.vy += (dy / dist) * impulse * 4.2
          }
        }

        b.vx *= 0.88
        b.vy *= 0.88
        const cap = b.kind === 'medium' ? 4.8 : b.kind === 'large' ? 3.4 : 2.2
        b.vx = Math.max(-cap, Math.min(cap, b.vx))
        b.vy = Math.max(-cap, Math.min(cap, b.vy))

        b.x += b.driftX + b.vx + Math.sin(b.phase) * 0.28 * b.wobble
        b.y += b.driftY + b.vy + Math.cos(b.phase * 0.8) * 0.22 * b.wobble

        const margin = b.radius * 1.2 + 16
        if (b.x < -margin || b.x > width + margin || b.y < -margin || b.y > height + margin) {
          bubbles[i] = spawn(width, height, b.kind, true)
        }
      }

      bubbles
        .slice()
        .sort((a, c) => a.z - c.z)
        .forEach(drawBubble)

      raf = requestAnimationFrame(tick)
    }

    tick()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointer)
    }
  }, [])

  return <canvas className="bubble-field" ref={canvasRef} aria-hidden="true" />
}
