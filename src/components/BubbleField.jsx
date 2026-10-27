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

const COUNT = 18

function pickRadius(index, minDim) {
  const roll = (index * 0.17 + Math.random() * 0.4) % 1
  if (roll < 0.38) return minDim * (0.035 + Math.random() * 0.05)
  if (roll < 0.72) return minDim * (0.09 + Math.random() * 0.08)
  return minDim * (0.18 + Math.random() * 0.16)
}

function spawn(width, height, fromEdge) {
  const minDim = Math.min(width, height)
  const radius = pickRadius(Math.random() * COUNT, minDim)
  const pal = PALETTE[Math.floor(Math.random() * PALETTE.length)]
  const speed = 0.18 + Math.random() * 0.45
  const angle = Math.random() * Math.PI * 2
  let x = Math.random() * width
  let y = Math.random() * height
  let driftX = Math.cos(angle) * speed
  let driftY = Math.sin(angle) * speed * 0.72

  if (fromEdge) {
    const edge = Math.floor(Math.random() * 4)
    const inset = radius + 8
    if (edge === 0) {
      x = -inset
      y = Math.random() * height
      driftX = Math.abs(driftX) + 0.12
    } else if (edge === 1) {
      x = width + inset
      y = Math.random() * height
      driftX = -Math.abs(driftX) - 0.12
    } else if (edge === 2) {
      x = Math.random() * width
      y = -inset
      driftY = Math.abs(driftY) + 0.1
    } else {
      x = Math.random() * width
      y = height + inset
      driftY = -Math.abs(driftY) - 0.1
    }
  }

  return {
    x,
    y,
    radius,
    z: 0.25 + Math.random() * 1.1,
    driftX,
    driftY,
    vx: 0,
    vy: 0,
    phase: Math.random() * Math.PI * 2,
    wobble: 0.35 + Math.random() * 0.8,
    pal,
  }
}

export default function BubbleField() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d', { alpha: false })
    const mouse = {
      x: 0,
      y: 0,
      px: 0,
      py: 0,
      vx: 0,
      vy: 0,
      inside: false,
    }
    let raf = 0
    let width = 0
    let height = 0
    let dpr = 1
    let bubbles = []

    const seed = () => {
      bubbles = Array.from({ length: COUNT }, (_, i) => {
        const b = spawn(width, height, i > 9)
        if (i <= 9) {
          b.x = Math.random() * width
          b.y = Math.random() * height
        }
        return b
      })
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
      if (!mouse.inside) {
        mouse.x = width / 2
        mouse.y = height / 2
        mouse.px = mouse.x
        mouse.py = mouse.y
        mouse.vx = 0
        mouse.vy = 0
      }
      if (!bubbles.length) seed()
    }

    const onPointer = (event) => {
      mouse.x = event.clientX
      mouse.y = event.clientY
      mouse.inside = true
    }

    const onLeave = () => {
      mouse.inside = false
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onPointer)
    window.addEventListener('pointerleave', onLeave)
    document.addEventListener('mouseleave', onLeave)

    const drawBubble = (b) => {
      const cx = b.x
      const cy = b.y
      const radius = b.radius
      const [r, g, bl] = b.pal.fill
      const [gr, gg, gb] = b.pal.glow
      const depth = 0.55 + b.z * 0.28

      const halo = ctx.createRadialGradient(cx, cy, radius * 0.15, cx, cy, radius * 1.45)
      halo.addColorStop(0, `rgba(${r},${g},${bl},${0.42 * depth})`)
      halo.addColorStop(0.5, `rgba(${r},${g},${bl},${0.16 * depth})`)
      halo.addColorStop(1, `rgba(${r},${g},${bl},0)`)
      ctx.fillStyle = halo
      ctx.beginPath()
      ctx.arc(cx, cy, radius * 1.45, 0, Math.PI * 2)
      ctx.fill()

      const hx = cx - radius * 0.3
      const hy = cy - radius * 0.34
      const body = ctx.createRadialGradient(hx, hy, radius * 0.04, cx + radius * 0.12, cy + radius * 0.18, radius)
      body.addColorStop(0, `rgba(255,255,255,${0.88 * depth})`)
      body.addColorStop(0.16, `rgba(${gr},${gg},${gb},${0.74 * depth})`)
      body.addColorStop(0.42, `rgba(${r},${g},${bl},${0.48 * depth})`)
      body.addColorStop(0.78, `rgba(${Math.max(r - 50, 0)},${Math.max(g - 45, 0)},${Math.max(bl - 20, 0)},${0.34 * depth})`)
      body.addColorStop(1, `rgba(${r},${g},${bl},0.04)`)
      ctx.fillStyle = body
      ctx.beginPath()
      ctx.arc(cx, cy, radius, 0, Math.PI * 2)
      ctx.fill()

      ctx.strokeStyle = `rgba(255,255,255,${0.4 * depth})`
      ctx.lineWidth = Math.max(1.2, radius * 0.012)
      ctx.beginPath()
      ctx.arc(cx, cy, radius * 0.985, 0, Math.PI * 2)
      ctx.stroke()

      ctx.fillStyle = `rgba(255,255,255,${0.55 * depth})`
      ctx.beginPath()
      ctx.ellipse(cx - radius * 0.3, cy - radius * 0.34, radius * 0.2, radius * 0.11, -0.55, 0, Math.PI * 2)
      ctx.fill()

      ctx.strokeStyle = `rgba(255,255,255,${0.24 * depth})`
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.arc(cx, cy, radius * 0.78, 0.15, 1.35)
      ctx.stroke()
    }

    const tick = () => {
      const rawVx = mouse.x - mouse.px
      const rawVy = mouse.y - mouse.py
      mouse.vx += (rawVx - mouse.vx) * 0.35
      mouse.vy += (rawVy - mouse.vy) * 0.35
      mouse.px = mouse.x
      mouse.py = mouse.y

      const hue = 330 + (mouse.x / Math.max(width, 1)) * 14
      const wash = ctx.createLinearGradient(0, 0, width, height)
      wash.addColorStop(0, `hsl(${hue}, 42%, 94%)`)
      wash.addColorStop(0.45, 'hsl(210, 38%, 95%)')
      wash.addColorStop(1, 'hsl(280, 34%, 93%)')
      ctx.fillStyle = wash
      ctx.fillRect(0, 0, width, height)

      const speed = Math.hypot(mouse.vx, mouse.vy)
      const swirl = mouse.inside && speed > 0.15

      for (let i = 0; i < bubbles.length; i += 1) {
        const b = bubbles[i]
        b.phase += 0.008 * b.wobble

        if (swirl) {
          const dx = b.x - mouse.x
          const dy = b.y - mouse.y
          const dist = Math.hypot(dx, dy) || 1
          const reach = 88 + b.radius * 0.85
          const falloff = Math.exp(-(dist * dist) / (2 * reach * reach))
          const lightness = 0.8 / (0.5 + (b.radius / Math.min(width, height)) * 5.5)
          const impulse = falloff * Math.min(speed, 22) * lightness * 0.015
          b.vx += mouse.vx * impulse
          b.vy += mouse.vy * impulse
          b.vx += -mouse.vy * impulse * 0.32
          b.vy += mouse.vx * impulse * 0.32
        }

        b.vx *= 0.91
        b.vy *= 0.91
        b.vx = Math.max(-5.5, Math.min(5.5, b.vx))
        b.vy = Math.max(-5.5, Math.min(5.5, b.vy))

        b.x += b.driftX + b.vx + Math.sin(b.phase) * 0.12 * b.wobble
        b.y += b.driftY + b.vy + Math.cos(b.phase * 0.85) * 0.1 * b.wobble

        const margin = b.radius * 1.35 + 24
        const gone =
          b.x < -margin || b.x > width + margin || b.y < -margin || b.y > height + margin
        if (gone) bubbles[i] = spawn(width, height, true)
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
      window.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return <canvas className="bubble-field" ref={canvasRef} aria-hidden="true" />
}
