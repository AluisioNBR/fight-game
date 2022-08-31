import type {
  GamepadKey,
  GamepadTypeEvent,
  GamepadEventListenerCallback,
  GamepadEventListener
} from './gamepads.type'

const GamepadButtonKeys = {
  'a': 0,
  'b': 0,
  'x': 0,
  'y': 0,
  'l1': 0,
  'r1': 0,
  'l2': 0,
  'r2': 0,
  'start': 0,
  'select': 0,
  'l3': 0,
  'r3': 0,
  'dup': 0,
  'ddown': 0,
  'dleft': 0,
  'dright': 0,
  'leftstick_x': 0,
  'leftstick_y': 0,
  'rightstick_x': 0,
  'rightstick_y': 0,
}

class Gamepad {
  private eventListeners: GamepadEventListener[] = []
  private buttons = GamepadButtonKeys
  public connected = false

  constructor() {
    window.addEventListener("gamepadconnected", this.connect.bind(this));
    window.addEventListener("gamepaddisconnected", this.disconnect.bind(this));
  }
  
  connect(event: GamepadEvent) {
    this.connected = true;
  }
  
  disconnect(event: GamepadEvent) {
    this.connected = false;
  }
  
  update() {
    let gamepad = navigator.getGamepads()[0];
    
    if (gamepad) {
      let buttonIndex = 0, axeIndex = 0
      for (const key in this.buttons) {
        if(buttonIndex < 16){
          this.buttons[key] = gamepad.buttons[buttonIndex].value
          buttonIndex++
        }
        else {
          this.buttons[key] = gamepad.axes[axeIndex]
          axeIndex++
        }
      }
    }

    for (const eventListener of this.eventListeners) {
      if(this.isGamepadEventDispatched(eventListener))
        eventListener.callback({ event: eventListener.event, key: eventListener.key })
    }
  }

  private isGamepadEventDispatched(eventListener: GamepadEventListener) {
    return this.isGamepadPressEvent(eventListener) || this.isGamepadChangeEvent(eventListener)
  }

  private isGamepadPressEvent(eventListener: GamepadEventListener){
    return eventListener.event == 'press' && this.buttons[eventListener.key] != 0
  }

  private isGamepadChangeEvent(eventListener: GamepadEventListener){
    return eventListener.event == 'change' && (this.buttons[eventListener.key] > 0 || this.buttons[eventListener.key] < 0)
  }
  
  getKey(key: GamepadKey): number {
    if (this.connected) {
      return this.buttons[key];
    }
    else {
      return 0;
    }
  }

  addListener(event: GamepadTypeEvent, key: GamepadKey, callback: GamepadEventListenerCallback){
    let exists = false
    for (const eventListener of this.eventListeners) {
      if(this.isEventKeyExists(eventListener, event, key))
        exists = true
    }

    if(!exists)
      this.eventListeners.push({
        event: event,
        key: key,
        callback: callback
      })
  }

  isEventKeyExists(eventListener: GamepadEventListener, event: GamepadTypeEvent, key: GamepadKey){
    return eventListener.event == event && eventListener.key == key
  }
}

export { Gamepad }