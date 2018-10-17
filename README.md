# on-screen-keyboard
A vanilla JavaScript on screen keyboard

# Install
```
npm install on-screen-js-keyboard
```
or
```
<script src="node_modules/on-screen-js-keyboard/dist/osk.min.js"></script>
```

# Usage
```
import OSK from 'on-screen-js-keyboard';

let keyboard = new OSK('input', 'keyboard-container'); // input field id, container id 
keyboard.on('change', (keyword) => {
	//do somehting
});
```

## Add new layout
```
keyboard.addLayout('no', {
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

## Change layout
```
keyboard.changeLayout('no');
```

## Change input field
```
keyboard.setOutput('other-input'); // ID of input field
```

or

```
let otherInput = document.getElementById('other-input');
keyboard.setOutput(otherInput); // Input field reference
```
