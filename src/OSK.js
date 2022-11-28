import OSKActions from './OSKActions.js';

export default class OSK {
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
		if (!output) {
			console.warn('Input field not given', output);
			return;
		} 
		let field;

		if (typeof output === "string") {
			field = document.getElementById(output);
			this.output = field;
			if(!this.output) {
				console.warn('Input field not found', output);
				return;
			}
		} else {
			field = output;
			this.output = output;
			
		}

		if (this.getFieldType(this.output) !== "input") {
			this.outputIsInputField = false;
		}

		let newVal = this.getFieldValue(field);
		this.value = newVal;
		this.selectionEnd = newVal.length;

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

	getFieldValue (field) {
		if (!field) return "";
		var type = this.getFieldType(field);
		switch(type) {
			case "input":
				return field.value;
			break;
			case "textarea":
				return field.innerText;
			break;
			default:
				return "";
		}
	}

	updateFromOutput () {
		this.value = this.getFieldValue(this.output);
		this.getCaretPosition();
		
	}

	clear () {
		if (this.container) {
			while (this.container.firstChild) {
				this.container.removeChild(this.container.firstChild);
			}
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
		if (!this.container) {
			return;
		}

		let keyboard_height = 0;
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

	getFieldType (field) {
		return field && field.tagName ? field.tagName.toLowerCase() : "nan";
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