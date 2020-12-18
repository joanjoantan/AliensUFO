document.addEventListener('DOMContentLoaded', () => {
  const squares = document.querySelectorAll('.grid div')
  const resultDisplay = document.querySelector('#result')
  let width = 15
  let currentShooterIndex = 202
  let currentAlienIndex = 0
  let aliensTakenDown = []
  let result = 0
  let direction = 1
  let aliensId

  //define the aliens UFO
  const UFO = [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
      15,16,17,18,19,20,21,22,23,24,
      30,31,32,33,34,35,36,37,38,39
    ]

  //draw the aliens UFO 
  UFO.forEach( alien => squares[currentAlienIndex + alien].classList.add('alien'))

  //draw the shooter
  squares[currentShooterIndex].classList.add('shooter')

  //move the shooter along a line
  function moveShooter(e) {
    squares[currentShooterIndex].classList.remove('shooter')
    switch(e.keyCode) {
      case 37: // arrow left
        if(currentShooterIndex % width !== 0) currentShooterIndex -= 1
        // console.log('left: ' + currentShooterIndex);
        break
      case 39: // arrow right
        if(currentShooterIndex % width < width - 1) currentShooterIndex += 1
        // console.log('right: ' + currentShooterIndex);
        break
    }
    squares[currentShooterIndex].classList.add('shooter')
  }
  document.addEventListener('keydown', moveShooter)

  //move the alien
  function moveAliens() {
    const leftEdge = UFO[0] % width === 0
    const rightEdge = UFO[UFO.length - 1] % width === width - 1
   
      if((leftEdge && direction === -1) || (rightEdge && direction === 1)){
        direction = width
      } else if (direction === width) {
      if (leftEdge) direction = 1
      else direction = -1
      }
      for (let i = 0; i <= UFO.length - 1; i++) {
        squares[UFO[i]].classList.remove('alien')
      }
      for (let i = 0; i <= UFO.length - 1; i++) {
        UFO[i] += direction
      }
      for (let i = 0; i <= UFO.length - 1; i++) {
        if (!aliensTakenDown.includes(i)){
          squares[UFO[i]].classList.add('alien')
        }
      }

    // decision game over  
    if(squares[currentShooterIndex].classList.contains('alien', 'shooter')) {
      resultDisplay.textContent = 'Game Over'
      squares[currentShooterIndex].classList.add('boom')
      clearInterval(aliensId)
    }

    // if the alien at last row then will game over
    for (let i = 0; i <= UFO.length - 1; i++){
      if(UFO[i] > (squares.length - (width -1))){
        resultDisplay.textContent = 'Game Over'
        clearInterval(aliensId)
      }
    }

    // check if the number alien take down  are same number with alien invaders
    if(aliensTakenDown.length === UFO.length) {
      console.log(aliensTakenDown.length)
      console.log(UFO.length)
      resultDisplay.textContent = 'You Win'
      clearInterval(aliensId)
    }
  }
  aliensId = setInterval(moveAliens, 500)

  //shoot at aliens
  function shoot(e) {
    let laserId
    let currentLaserIndex = currentShooterIndex
    //move the laser from the shooter to the alien invader
    function moveLaser() {
      squares[currentLaserIndex].classList.remove('laser')
      currentLaserIndex -= width
      squares[currentLaserIndex].classList.add('laser')
      if(squares[currentLaserIndex].classList.contains('alien')) {
        squares[currentLaserIndex].classList.remove('laser')
        squares[currentLaserIndex].classList.remove('alien')
        squares[currentLaserIndex].classList.add('boom')

        setTimeout(() => squares[currentLaserIndex].classList.remove('boom'), 250)
        clearInterval(laserId)

        const alienTakenDown = UFO.indexOf(currentLaserIndex)
        aliensTakenDown.push(alienTakenDown)
        result++
        resultDisplay.textContent = result
      }

      if(currentLaserIndex < width) {
        clearInterval(laserId)
        setTimeout(() => squares[currentLaserIndex].classList.remove('laser'), 100)
      }
    }

    switch(e.keyCode) {
      case 32: //space
        laserId = setInterval(moveLaser, 100)
        break
    }
  }

  document.addEventListener('keyup', shoot)
})
