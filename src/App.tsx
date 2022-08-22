import React, { useRef, useEffect } from 'react'
import './App.css'

import { Game } from 'phaser'
import { generateGameConfig } from './gameCore'

function App() {
  return (
    <div className="App">
      <GameContainer />
    </div>
  )
}

function GameContainer(){
  type gameReference = React.MutableRefObject<null> | React.MutableRefObject<HTMLElement>
  let gameRef: gameReference = useRef(null)
  let componentUpdates = useRef(0)

  useEffect(() => {
    const gameRefIsNotNull = gameRef.current != null
    const componentIsMounting = componentUpdates.current == 0

    if(componentIsMounting)
      componentUpdates.current += 1
      
    else if(gameRefIsNotNull){
      const gameParent = gameRef.current as HTMLElement
      gameParent.innerHTML = ''
      
      const game = new Game(generateGameConfig(gameParent))
    }
  }, [gameRef, componentUpdates])

  return (
    <div ref={gameRef}></div>
  )
}

export default App
