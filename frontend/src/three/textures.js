import * as THREE from 'three'

export function makeRugTexture() {
  const size = 512
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = '#7c2433'
  ctx.fillRect(0, 0, size, size)

  ctx.strokeStyle = '#e2c17a'
  ctx.lineWidth = 22
  ctx.strokeRect(18, 18, size - 36, size - 36)
  ctx.strokeStyle = '#1b3a57'
  ctx.lineWidth = 8
  ctx.strokeRect(40, 40, size - 80, size - 80)

  ctx.save()
  ctx.translate(size / 2, size / 2)
  ctx.rotate(Math.PI / 4)
  ctx.fillStyle = '#16324d'
  ctx.fillRect(-78, -78, 156, 156)
  ctx.fillStyle = '#e2c17a'
  ctx.fillRect(-46, -46, 92, 92)
  ctx.fillStyle = '#7c2433'
  ctx.fillRect(-22, -22, 44, 44)
  ctx.restore()

  ;[[92, 92], [size - 92, 92], [92, size - 92], [size - 92, size - 92]].forEach(([x, y]) => {
    ctx.beginPath()
    ctx.fillStyle = '#e2c17a'
    ctx.arc(x, y, 18, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.fillStyle = '#16324d'
    ctx.arc(x, y, 7, 0, Math.PI * 2)
    ctx.fill()
  })

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 8
  return texture
}

export function makeWoodTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 256
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#6a4328'
  ctx.fillRect(0, 0, 256, 256)

  for (let y = 0; y < 256; y += 28) {
    ctx.fillStyle = y % 56 === 0 ? '#5a3820' : '#754a2d'
    ctx.fillRect(0, y, 256, 26)
    ctx.strokeStyle = 'rgba(40, 22, 10, 0.35)'
    ctx.beginPath()
    ctx.moveTo(0, y + 8)
    ctx.bezierCurveTo(80, y + 4, 160, y + 16, 256, y + 8)
    ctx.stroke()
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(3, 3)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}
