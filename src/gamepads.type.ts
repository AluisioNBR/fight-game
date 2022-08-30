type GamepadKey = 'a' | 'b' | 'x' | 'y' | 'rb' | 'lb' | 'rt' | 'lt' | 'rs' | 'ls' | 'start' | 'select' | 'dup' | 'ddown' | 'dleft' | 'dright' | 'leftstick_x' | 'leftstick_y' | 'rightstick_x' | 'rightstick_y'

type GamepadTypeEvent = 'press' | 'change'

type GamepadEventListenerCallback = (event?: GamepadEventListenerParams) => void

interface GamepadEventListenerParams {
  event: GamepadTypeEvent,
  key: GamepadKey
} 

interface GamepadEventListener extends GamepadEventListenerParams {
  callback: GamepadEventListenerCallback
}

export type {
  GamepadKey,
  GamepadTypeEvent,
  GamepadEventListenerCallback,
  GamepadEventListener
}