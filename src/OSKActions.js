export default class OSKActions {
	constructor (keyboard) {
		this.keyboard = keyboard;
		this.actions = {
			"backspace": function(key, keyboard) {
				if (keyboard.selectionStart > 0 && keyboard.selectionStart == keyboard.selectionEnd) {
					keyboard.selectionStart--;
					keyboard.changeValue("");
				} else {
					keyboard.changeValue("");
				}
			},
			"change_keyset": function(key, keyboard) {
				if (key.action[1] !== undefined) {
					keyboard.keyset = key.action[1];
					keyboard.clear();
					keyboard.construct();
				}
			},
			"change_layout": function(key, keyboard) {
				if (key.action[1] !== undefined) {
					keyboard.layoutName = key.action[1];
					keyboard.clear();
					keyboard.construct();
				}
			},
			"submit": function(key, keyboard) {
				if (key.action[1] !== undefined) {
					keyboard.pushtoOutput();
					keyboard.clear();
				}
			}
		};
	}

	activate (key) {
		if (typeof this.actions[key.action[0]] === "function") {
			this.actions[key.action[0]](key, this.keyboard);
		}
	}

	addAction (key, callback) {
		this.actions[key] = callback;
	}
};

// export { OSKActions };