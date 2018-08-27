(() => {
  spawnCol = () => {
    let checks = i = 0
    let occupied = false
    do{
      occupied = false
      i = R() * cols.length | 0
      for(j = 0; !occupied && j < cols[i].length; ++j) {
        if(cols[i][j].id !== null || cols[i][j].fixed) occupied = true
      }
      checks++
    } while (occupied && checks < 20);
    if (!occupied) {
      cols[i][0] = {id: R() * 4 | 0, alpha: 1.15, life: 0, fixed: 0}
    }
  }

  Draw = () => {
    x.fillStyle = '#000'
    x.fillRect(0, 0, c.width, c.height)
    if(R() < .25) spawnCol()
    let sym = ''
    x.font = size * 1.5 + 'px courier'
    for(let i = 0; i < cols.length; ++i) {
      let bottomChar = -1
      for( let j = cols[i].length - 1; j--; ) {
        if (cols[i][j].id !== null) {
          let X = cx + i * size * spacing - size / 2 - size * spacing * cols.length / 2
          let Y = j * size * spacing - size / 2
          x.fillStyle = `hsl(116, 80%, ${Math.pow(cols[i][j].alpha-.2, 3)*100}%)`
          if(cols[i][j].id === 0) {
            x.globalAlpha = cols[i][j].alpha
            x.drawImage(logo[cols[i][j].id].img, X, Y, size, size)
            x.globalAlpha = 1
            x.globalCompositeOperation = "multiply";
            x.fillRect(X, Y, size, size)
            x.globalCompositeOperation = "source-over";
          } else {
            switch (cols[i][j].id) {
              case 1: sym = 'I'; break;
              case 2: sym = 'R'; break;
              case 3: sym = 'C'; break;
            }
            x.globalAlpha = 1
            x.fillText(sym, X, Y + size)
          }
          if (bottomChar === -1 && j < cols[i].length - 1 && !cols[i][j].fixed) {
            bottomChar = j
            cols[i][j].life++
            if(cols[i][j].life > speed) {
              let midY = (rowNo / 2 | 0) - 2
              let midX = colNo / 2 | 0
              if(i === midX - 2 && j == midY) {
                cols[i][j + 1].id = 0
                cols[i][j + 1].alpha = 3.2
                cols[i][j + 1].life = 0
                cols[i][j + 1].fixed = 1
                newRun = false
              } else if(i === midX - 1 && j == midY) {
                cols[i][j + 1].id = 1
                cols[i][j + 1].alpha = 3.2
                cols[i][j + 1].life = 0
                cols[i][j + 1].fixed = 1
                newRun = false
              } else if(i === midX && j == midY) {
                cols[i][j + 1].id = 2
                cols[i][j + 1].alpha = 3.2
                cols[i][j + 1].life = 0
                cols[i][j + 1].fixed = 1
                newRun = false
              } else if(i === midX + 1 && j == midY) {
                cols[i][j + 1].id = 3
                cols[i][j + 1].alpha = 3.2
                cols[i][j + 1].life = 0
                cols[i][j + 1].fixed = 1
                newRun = false
              } else {
                cols[i][j + 1].id = (cols[i][j].id + 1) % 4
                cols[i][j + 1].alpha = 1.15
                cols[i][j + 1].life = 0
              }
            }
          }
          if (cols[i][j].alpha < .6) {
            cols[i][j].id = null
            cols[i][j].alpha = 0
            cols[i][j].life = 0
            if(cols[i][j].fixed) lastChars++
          } else {
            cols[i][j].alpha -= .01
          }
        }
      }
      if(lastChars === 4) cols = loadCols()
    }
  
    t+=1/60
    requestAnimationFrame(Draw);
  }
  loadCols = () => {
    newRun = true
    lastChars = 0
    return new Array(colNo).fill().map(e=>e=new Array(rowNo).fill().map(e=>e={id: null, alpha: 0, life: 0, fixed: 0}))
  }
  let R = Math.random
  let c=document.getElementById("canvas")
  let x=c.getContext("2d")
  c.width = c.clientWidth
  c.height = c.clientHeight
  let S = Math.sin
  let C = Math.cos
  let t = 0
  let oldG = gg = 0
  let cx = c.width / 2
  let cy = c.height / 2
  let circles = []
  let speed = 2
  let size = 18
  let spacing = 1.25
  let rowNo = c.height * 1.1 / (size * spacing) | 0
  let colNo = c.width / (size * spacing) / 2 | 0
  let newRun = false
  let lastChars = 0
  let cols = loadCols()
  window.addEventListener('resize', e => {
    c.width = c.clientWidth
    c.height = c.clientHeight
    cx = c.width / 2
    cy = c.height / 2
    rowNo = c.height * 1.1 / (size * spacing) | 0
    cols = loadCols()
  })
  let bg = new Image()
  bg.onload = e => {
    bg.loaded = true
    launch()
  }
  let logo = []
  for(let i=0; i<1; ++i){
    logo.push({loaded: false, img: new Image()})
    logo[i].img.onload = e => {
      logo[i].loaded = true
      launch()
    }
  }
  launch = () => { if (logo[0].loaded && bg.loaded) Draw() }
  bg.src = 'bg.jpg'
  logo[0].img.src = 'logo.png'
})()