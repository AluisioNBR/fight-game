class Gamepad {
  private buttons = {
    'a': 0,
    'b': 0,
    'x': 0,
    'y': 0,
    'rb': 0,
    'lb': 0,
    'rt': 0,
    'lt': 0,
    'rs': 0,
    'ls': 0,
    'start': 0,
    'select': 0,
    'dup': 0,
    'ddown': 0,
    'dleft': 0,
    'dright': 0,
    'leftstick_x': 0,
    'leftstick_y': 0,
    'rightstick_x': 0,
    'rightstick_y': 0,
  }
  connected = false

  constructor() {
    window.addEventListener("gamepadconnected", this.connect.bind(this));
    window.addEventListener("gamepaddisconnected", this.disconnect.bind(this));
  }
  
  connect(event: GamepadEvent) {
    console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
    event.gamepad.index, event.gamepad.id,
    event.gamepad.buttons.length, event.gamepad.axes.length);
    
    this.connected = true;
  }
  
  disconnect(event: GamepadEvent) {
    console.log("Gamepad disconnected from index %d: %s",
    event.gamepad.index, event.gamepad.id);
    
    this.connected = false;
  }
  
  update() {
    let gamepad = navigator.getGamepads()[0];
    
    if (gamepad) {
      this.buttons['a'] = gamepad.buttons[0].value;
      this.buttons['b'] = gamepad.buttons[1].value;
      this.buttons['x'] = gamepad.buttons[2].value;
      this.buttons['y'] = gamepad.buttons[3].value;
      this.buttons['lb'] = gamepad.buttons[4].value;
      this.buttons['rb'] = gamepad.buttons[5].value;
      this.buttons['lt'] = gamepad.buttons[6].value;
      this.buttons['rt'] = gamepad.buttons[7].value;
      this.buttons['select'] = gamepad.buttons[8].value;
      this.buttons['start'] = gamepad.buttons[9].value;
      this.buttons['ls'] = gamepad.buttons[10].value;
      this.buttons['rs'] = gamepad.buttons[11].value;
      this.buttons['dup'] = gamepad.buttons[12].value;
      this.buttons['ddown'] = gamepad.buttons[13].value;
      this.buttons['dleft'] = gamepad.buttons[14].value;
      this.buttons['dright'] = gamepad.buttons[15].value;
      this.buttons['leftstick_x'] = gamepad.axes[0];
      this.buttons['leftstick_y'] = gamepad.axes[1];
      this.buttons['rightstick_x'] = gamepad.axes[2];
      this.buttons['rightstick_y'] = gamepad.axes[3];
    }
  }
  
  getKey(key: GamepadKeyButton): number {
    if (this.connected) {
      return this.buttons[key];
    }
    else {
      return 0;
    }
  }
}

type GamepadKeyButton = 'a' | 'b' | 'x' | 'y' | 'rb' | 'lb' | 'rt' | 'lt' | 'rs' | 'ls' | 'start' | 'select' | 'dup' | 'ddown' | 'dleft' | 'dright' | 'leftstick_x' | 'leftstick_y' | 'rightstick_x' | 'rightstick_y'

export { Gamepad }