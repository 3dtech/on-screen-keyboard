var OSK =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./src/OSKActions.js
class OSKActions {
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
// CONCATENATED MODULE: ./src/OSK.js


class OSK_OSK {
	constructor (output, container, defaultLayout) {
		this.layouts = {};
		this.layoutName = (defaultLayout === undefined ? "en" : defaultLayout);
		this.keyset = "default";
		this.container = false;
		this.containerListenerAdded = false;

		this.setContainer(container);

		this.selectionStart = 0;
		this.selectionEnd = 0;
		this.output = false;
		this.outputIsInputField = true;
		this.value = "";

		this.events = {
			'change': [],
			'layout': [],
			'ready': []
		};

		this.actions = new OSKActions(this);
		this.cbOnChange = false;

		this.setOutput(output)
		this.setDefaultLayout();
		this.construct();
	}

	on (type, callback) {
		if (typeof this.events[type] !== 'object') {
			this.events[type] = [];
		}

		this.events[type].push(callback);
	}

	trigger () {
		let args = Array.prototype.slice.call(arguments);
		if (args.length > 0) {
			let type = args[0];
			args.shift();

			if (this.events[type]) {
				let fun;
				for (let i = 0, len = this.events[type].length; i < len; i++){
					fun = this.events[type][i];
					if (typeof fun === 'function') {
						fun.apply(this, args);
					}
				}
			} 
		}
	}

	addLayout (name, layout) {
		this.layouts[name] = layout;
	}

	changeLayout (name, keyset) {
		this.layoutName = name;
		if (keyset) {
			this.keyset = keyset;
		} else {
			this.keyset = "default";
		}

		this.clear();
		this.construct();
		this.trigger('layout', this.layoutName, this.keyset);
	}

	setContainer (container) {
		switch (typeof container) {
			case "undefined":
				this.container = document.createElement("div");
				this.container.classList.add('keyboard');
				document.body.appendChild(this.container);
			break;
			case "string":
				this.container = document.getElementById(container);
			break;
			default:
				this.container = container;

		}
	}

	setOutput (output) {
		if (typeof output === "string") {
			this.output = document.getElementById(output);
			if(!this.output) {
				console.warn('Input field not found', output);
				return;
			} 
			if (this.output.tagName.toLowerCase() !== "input") {
				this.outputIsInputField = false;
			}
		} else {
			this.output = output;
		}

		if (this.output) {
			this.output.addEventListener("focus", () => {
				this.updateFromOutput();
			});

			this.output.addEventListener("keyup", () => {
				this.updateFromOutput();
				this.trigger('change', this.value);
			});

			this.output.addEventListener("mouseup", () => {
				this.updateFromOutput();
			});

			this.output.addEventListener("input", () => {
				this.updateFromOutput();
			});
		}
	}

	updateFromOutput () {
		if (this.outputIsInputField) {
			this.value = this.output.value;
		} else {
			this.value = this.output.innerText;
		}

		this.getCaretPosition();
		
	}

	clear () {
		while (this.container.firstChild) {
			this.container.removeChild(this.container.firstChild);
		}
	}

	clearValue () {
		this.value = "";
		this.selectionStart = 0;
		this.selectionEnd = 0;
	}

	getCurrentKeyset () {
		try {
			return this.layouts[this.layoutName]["keys"][this.keyset];
		} catch (err) {
			console.warn("Error! Probably no keyboard layout added!");
			return this.layouts["en"]["keys"]["default"];
		}
	}

	construct () {
		this.clear();
		let html = "";
		let keyset = this.getCurrentKeyset();

		for (let r in keyset) {
			html += "<div class='keyboard-row keyboard-row-" + r + "'>";
			for (let k in keyset[r]) {

				let key = keyset[r][k];
				switch (typeof key) {
					case "string":
						html += "<div class='keyboard-key " + key + "' row='" + r + "' index='" + k + "'>" + key + "</div>";
						break;
					case "object":
						let key_class = "";
						if (key.cls)
							key_class = key.cls;
						html += "<div class='keyboard-key keyboard-" + key_class + " " + key.key + "' object='' row='" + r + "' index='" + k + "'>" + key.key + "</div>";
						break;
				}

			}
			html += "</div>";
		}

		this.container.insertAdjacentHTML("beforeend", html);

		if (!this.containerListenerAdded) {
			this.container.addEventListener("mousedown", (event) => {
				this.getCaretPosition();
				this.keyPressed(event.target);
				event.stopPropagation();
				event.preventDefault();
				
			});

			this.container.addEventListener("mouseup", (event) => {
				this.keyReleased(event.target);
				event.stopPropagation();
			});

			this.containerListenerAdded = true;

			this.container.onselectstart = function() {return false;}; // ie
			this.container.onmousedown = function() {return false;}; // mozilla (this disables the search box)
		}

		this.rescale();
	}

	rescale () {
		let keyboard_height = 0;
		let keyboard_width = 0;
		let row;
		let key;

		for(let i = 0; i < this.container.children.length; i++){
			row = this.container.children[i];

			let key_height = row.offsetHeight - row.clientHeight;
			let row_width = row.offsetWidth - row.clientWidth;

			for(let j = 0; j < row.children.length; j++){
				key = row.children[j];
				let width = 0;
				//this is a hack for the
				if (key.offsetWidth < this.container.offsetWidth)
					width = key.offsetWidth;
				else
					width = this.container.offsetWidth;

				row_width += width + 1;
				key_height = Math.max(key_height, this.container.offsetHeight);
			}

			///setting row dimensions
			row.width = row_width;
			row.height = key_height;

			///setting keyboard dimensions
			keyboard_height += key_height;
		}
			
		this.container.height = keyboard_height;
		//$(this.container).width(keyboard_width);

		this.trigger('ready');
	}

	keyPressed (key) {
		key.classList.add("keyboard-key-pressed");
		let layout = this.getCurrentKeyset();
		let row = layout[key.getAttribute("row")];

		if (!row) return;

		let lkey = row[key.getAttribute("index")];
		switch (typeof lkey) {
			case "string":
				this.changeValue(lkey);
				break;
			case "object":
				if (lkey.action === undefined) {
					this.changeValue(lkey.key);
				} else {
					this.actions.activate(lkey);
				}
				break;
		}
		this.pushtoOutput();
	}

	changeValue (char) {
		let start = this.value.substring(0, this.selectionStart);
		let end = this.value.substring(this.selectionEnd, this.value.length);
		this.value = "" + start + char + end;
		this.selectionStart += char.length;
		this.selectionEnd = this.selectionStart;
	}

	pushtoOutput () {
		if (this.output) {
			if (this.outputIsInputField) {
				this.output.value = this.value;
				this.output.selectionStart = this.selectionStart;
				this.output.selectionEnd = this.selectionEnd;
			} else {
				this.output.innerHTML = this.value;
			}

			//let the output know that value as changed
			let changeEvent = new Event('change');
			let keyupEvent = new Event('keyup');

			this.output.dispatchEvent(changeEvent);
			this.output.dispatchEvent(keyupEvent);

			this.trigger('change', this.value);
		}
	}

	getCaretPosition () {
		if (this.output) {
			if (this.outputIsInputField) {
				this.selectionStart = this.output.selectionStart;
				this.selectionEnd = this.output.selectionEnd;
			}
		}
	}

	keyReleased (key) {
		key.classList.remove("keyboard-key-pressed");
	}

	width () {
		// return $(this.container).outerWidth();
		return -1;
	}

	height () {
		// return $(this.container).outerHeight();
		return -1;
	}

	setDefaultLayout () {
		this.layouts["en"] = {
			'name': "English",
			'keyboard': "US International",
			'local_name': "English",
			'lang': "en",
			'keys': {
				"default": [
					["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", { 'key': "&#171; Bksp", 'action': ["backspace"], 'cls': "key2x" }],
					["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "\\"],
					["a", "s", "d", "f", "g", "h", "j", "k", "l", { 'key': "Enter", 'action': ["submit"], 'cls': "key3x" }],
					[{ 'key': "Shift", 'action': ["change_keyset", "shift"], 'cls': "key2x" }, "z", "x", "c", "v", "b", "n", "m"],
					[{ "key": " ", "cls": "key_spacebar" }]
				],
				"shift": [
					["~", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", { 'key': "&#171; Bksp", 'action': "backspace", 'cls': "key2x" }],
					["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "{", "}"],
					["A", "S", "D", "F", "G", "H", "J", "K", "L", { 'key': "Enter", 'action': ["submit"], 'cls': "key3x" }],
					[{ 'key': "Shift", 'action': ["change_keyset", "default"], 'cls': "key2x active" }, "Z", "X", "C", "V", "B", "N", "M", "<", ">", "?"],
					[{ "key": " ", "cls": "key_spacebar" }]
				],
			}
		};
	}
};

// export { OSK };
// CONCATENATED MODULE: ./index.js
/* concated harmony reexport OSK */__webpack_require__.d(__webpack_exports__, "OSK", function() { return OSK_OSK; });
/* concated harmony reexport OSKActions */__webpack_require__.d(__webpack_exports__, "OSKActions", function() { return OSKActions; });





/***/ })
/******/ ]);