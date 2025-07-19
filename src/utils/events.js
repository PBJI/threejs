export function setupEvents() {
    window.__SCROLL__ = 0
    let startY = 0
  
    window.addEventListener('wheel', (e) => {
      e.preventDefault()
      window.__SCROLL__ += e.deltaY * 0.001
    //   window.__SCROLL__ = Math.max(0, Math.min(window.__SCROLL__, 1))
    }, { passive: false })
  
    window.addEventListener('touchstart', (e) => {
      startY = e.touches[0].clientY
    }, { passive: false })
  
    window.addEventListener('touchmove', (e) => {
      const deltaY = e.touches[0].clientY - startY
      window.__SCROLL__ -= deltaY * 0.003
    //   window.__SCROLL__ = Math.max(0, Math.min(window.__SCROLL__, 1))
      startY = e.touches[0].clientY
    }, { passive: false })
  
    window.addEventListener('click', () => {
      const sound = window.__CAR_SOUND__
      if (sound && !sound.isPlaying) sound.play()
    })
  }
  