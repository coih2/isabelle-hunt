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

export default function BubbleField() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d', { alpha: false })
    const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 }
    let raf = 0
    let width = 0
    let height = 0
    let dpr = 1

    const bubbles = Array.from({ length: 9 }, (_, i) => {
      const pal = PALETTE[i % PALETTE.length]
      return {
        x: 0.08 + Math.random() * 0.84,
        y: 0.08 + Math.random() * 0.84,
        z: 0.35 + Math.random() * 0.9,
        r: 0.16 + (i % 4) * 0.05 + Math.random() * 0.08,
        vx: (Math.random() - 0.5) * 0.00028,
        vy: (Math.random() - 0.5) * 0.00028,
        phase: Math.random() * Math.PI * 2,
        pal,
      }
    })

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const onPointer = (event) => {
      mouse.tx = event.clientX / width
      mouse.ty = event.clientY / height
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onPointer)

    const drawBubble = (b) => {
      const parallaxX = (mouse.x - 0.5) * 110 * b.z
      const parallaxY = (mouse.y - 0.5) * 70 * b.z
      const cx = b.x * width + parallaxX
      const cy = b.y * height + parallaxY
      const radius = Math.min(width, height) * b.r * (0.72 + b.z * 0.38)
      const [r, g, bl] = b.pal.fill
      const [gr, gg, gb] = b.pal.glow

      const halo = ctx.createRadialGradient(cx, cy, radius * 0.15, cx, cy, radius * 1.42)
      halo.addColorStop(0, `rgba(${r},${g},${bl},0.48)`)
      halo.addColorStop(0.5, `rgba(${r},${g},${bl},0.18)`)
      halo.addColorStop(1, `rgba(${r},${g},${bl},0)`)
      ctx.fillStyle = halo
      ctx.beginPath()
      ctx.arc(cx, cy, radius * 1.42, 0, Math.PI * 2)
      ctx.fill()

      const hx = cx - radius * 0.3
      const hy = cy - radius * 0.34
      const body = ctx.createRadialGradient(hx, hy, radius * 0.04, cx + radius * 0.12, cy + radius * 0.18, radius)
      body.addColorStop(0, 'rgba(255,255,255,0.92)')
      body.addColorStop(0.16, `rgba(${gr},${gg},${gb},0.78)`)
      body.addColorStop(0.42, `rgba(${r},${g},${bl},0.5)`)
      body.addColorStop(0.78, `rgba(${Math.max(r - 50, 0)},${Math.max(g - 45, 0)},${Math.max(bl - 20, 0)},0.38)`)
      body.addColorStop(1, `rgba(${r},${g},${bl},0.05)`)
      ctx.fillStyle = body
      ctx.beginPath()
      ctx.arc(cx, cy, radius, 0, Math.PI * 2)
      ctx.fill()

      ctx.strokeStyle = 'rgba(255,255,255,0.42)'
      ctx.lineWidth = Math.max(1.4, radius * 0.012)
      ctx.beginPath()
      ctx.arc(cx, cy, radius * 0.985, 0, Math.PI * 2)
      ctx.stroke()

      ctx.fillStyle = 'rgba(255,255,255,0.58)'
      ctx.beginPath()
      ctx.ellipse(cx - radius * 0.3, cy - radius * 0.34, radius * 0.2, radius * 0.11, -0.55, 0, Math.PI * 2)
      ctx.fill()

      ctx.strokeStyle = 'rgba(255,255,255,0.28)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.arc(cx, cy, radius * 0.78, 0.15, 1.35)
      ctx.stroke()
    }

    const tick = () => {
      mouse.x += (mouse.tx - mouse.x) * 0.055
      mouse.y += (mouse.ty - mouse.y) * 0.055

      const hue = 330 + mouse.x * 28
      const wash = ctx.createLinearGradient(0, 0, width, height)
      wash.addColorStop(0, `hsl(${hue}, 48%, ${93 + mouse.y * 2}%)`)
      wash.addColorStop(0.45, `hsl(${210 + mouse.x * 18}, 42%, 95%)`)
      wash.addColorStop(1, `hsl(${280 - mouse.y * 22}, 38%, 93%)`)
      ctx.fillStyle = wash
      ctx.fillRect(0, 0, width, height)

      const mx = mouse.x * width
      const my = mouse.y * height

      for (const b of bubbles) {
        b.phase += 0.0038
        b.x += b.vx + Math.sin(b.phase) * 0.00007
        b.y += b.vy + Math.cos(b.phase * 0.85) * 0.00007

        const px = b.x * width
        const py = b.y * height
        const dx = mx - px
        const dy = my - py
        const dist = Math.hypot(dx, dy) || 1
        const force = Math.min(140 / dist, 0.4) * 0.00012 * b.z
        b.vx += dx * force
        b.vy += dy * force
        b.vx *= 0.985
        b.vy *= 0.985

        if (b.x < -0.18) b.x = 1.16
        if (b.x > 1.18) b.x = -0.16
        if (b.y < -0.18) b.y = 1.16
        if (b.y > 1.18) b.y = -0.16
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
