# on-screen-keyboard
A vanilla JavaScript on screen keyboard

# Install
```
npm install on-screen-js-keyboard
```

# Usage
```
import OSK from 'on-screen-js-keyboard';

this.keyboard = new OSK('input', 'keyboard-container'); // input field id, container id 
this.keyboard.on('change', (keyword) => {
	//do somehting
});
```

# Add new layout
```
this.keyboard.addLayout('no', {
	"name": "Norwegian",
	"keyboard":"Norwegian",
	"local_name": "English",
	"lang": "no",
	"keys": {
		"default": [
			["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", {"key": "Slett", "action": ["backspace"], "cls": "key2x"}],
			["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "\u00E5"],
			["a", "s", "d", "f", "g", "h", "j", "k", "l", "\u00f8", "\u00e6"],
			["z", "x", "c", "v", "b", "n", "m", ",", "-"],
			[{"key": " ", "cls": "key_spacebar"}]
			]
		}
});
```