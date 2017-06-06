var Keyboard = function(output, defaultLayout) {
	console.log("init", output)
	this.setOutput(output)
	this.layouts = {};
	this.layoutName = (defaultLayout === undefined ? "en" : defaultLayout);
	this.keyset = "default";

	this.container = document.createElement("div");
	document.body.appendChild(this.container);

	this.selectionStart = 0;
	this.selectionEnd = 0;
	this.output = false;
	this.outputIsInputField = true;
	this.value = "";
	this.ready_function = false;
	this.actions = new KeyboardActions(this);
	this.cbOnChange = false;
	this.setDefaultLayout();
	this.construct();
};

Keyboard.prototype.addLayout = function(name, layout) {
	this.layouts[name] = layout;
}

Keyboard.prototype.changeLayout = function(name, keyset) {
	this.layoutName = name;
	if (keyset) {
		this.keyset = keyset;
	} else {
		this.keyset = "default";
	}

	this.clear();
	this.construct();
};

Keyboard.prototype.setOutput = function(output) {

	if (typeof output === "string") {
		this.output = document.getElementById(output);
		if (this.output.tagName !== "input") {
			this.outputIsInputField = false;
		}
	} else {
		this.output = output;
	}

	var scope = this;

	if (this.output) {
		this.output.addEventListener("focus", function() {
			scope.updateFromOutput();
		});

		this.output.addEventListener("onkeyup", function() {
			scope.updateFromOutput();
		});

		this.output.addEventListener("onmouseup", function() {
			scope.updateFromOutput();
		});

		this.output.addEventListener("onchange", function() {
			scope.updateFromOutput();
		});
	}
};

Keyboard.prototype.updateFromOutput = function() {
	if (this.outputIsInputField) {
		this.value = this.output.value;
	} else {
		this.value = this.output.innerText;
	}

	this.getCaretPosition();
};

Keyboard.prototype.clear = function() {
	while (this.container.firstChild) {
		this.container.removeChild(this.container.firstChild);
	}
};

Keyboard.prototype.clearValue = function() {
	this.value = "";
	this.selectionStart = 0;
	this.selectionEnd = 0;
};

Keyboard.prototype.getCurrentKeyset = function() {
	try {
		return this.layouts[this.layoutName]["keys"][this.keyset];
	} catch (err) {
		console.log("Error! Probably no keyboard layout added!");
		return this.layouts["en"]["keys"]["default"];
	}
};

Keyboard.prototype.construct = function() {
	this.clear();
	var html = "";
	var keyset = this.getCurrentKeyset();
	var c = this.container;
	var scope = this;

	for (var r in keyset) {
		html += "<div class='keyboard_row'>";
		for (var k in keyset[r]) {

			var key = keyset[r][k];
			switch (typeof key) {
				case "string":
					html += "<div class='keyboard_key " + key + "' row='" + r + "' index='" + k + "'>" + key + "</div>";
					break;
				case "object":
					var key_class = "";
					if (key.cls)
						key_class = " " + key.cls;
					html += "<div class='keyboard_key" + key_class + " " + key.key + "' object='' row='" + r + "' index='" + k + "'>" + key.key + "</div>";
					break;
			}

		}
		html += "</div>";

	}

	this.container.insertAdjacentHTML("beforebegin", html);

	this.container.addEventListener("onmousedown", function(event) {
		console.log("event", event)
		scope.getCaretPosition();
		scope.keyPressed(this);
	});

	/*this.container.find(".keyboard_key").mouseup(function() {
		scope.keyReleased(this);
	});

	$(this.container).find(".keyboard_key").mouseout(function() {
		scope.keyReleased(this);
	});*/

	///remove text selection
	if (this.container !== "undefined") {
		this.container.onselectstart = function() {
			return false;
		}; // ie
		this.container.onmousedown = function() {
			return false;
		}; // mozilla (this disables the search box)
	}

	this.rescale();
};

Keyboard.prototype.rescale = function() {
	var keyboard_height = 0;
	var keyboard_width = 0;
	var row;
	var key;

	for(var i = 0; i < this.container.children.length; i++){
		row = this.container.children[i];

		var key_height = row.offsetHeight - row.clientHeight;
		var row_width = row.offsetWidth - row.clientWidth;

		for(var j = 0; j < row.children.length; j++){
			key = row.children[j];
			var width = 0;
			//this is a hack for the
			if (key.offsetWidth < $(this).outerWidth(true))
				width = key.offsetWidth;
			else
				width = $(this).outerWidth() + $(this).outerWidth(true);

			row_width += width + 1;
			key_height = Math.max(key_height, $(this).outerHeight(true));
		}

		///setting row dimensions
		$(this).width(row_width);
		$(this).height(key_height);

		///setting keyboard dimensions
		keyboard_height += key_height;
	}
		
	this.container.height = keyboard_height;
	//$(this.container).width(keyboard_width);

	//lets announce that the keyboard is ready to draw
	if (typeof this.ready_function === "function") {
		this.ready_function();
	}
};

Keyboard.prototype.keyPressed = function(key) {
	$(key).addClass("key_pressed");
	var layout = this.getCurrentKeyset();

	var lkey = layout[$(key).attr("row")][$(key).attr("index")];
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
};

Keyboard.prototype.changeValue = function(char) {
	var start = this.value.substring(0, this.selectionStart);
	var end = this.value.substring(this.selectionEnd, this.value.length);
	this.value = "" + start + char + end;
	this.selectionStart += char.length;
	this.selectionEnd = this.selectionStart;
};

Keyboard.prototype.pushtoOutput = function() {
	if (this.output) {
		if (this.outputIsInputField) {
			this.output.value = this.value;
			this.output.selectionStart = this.selectionStart;
			this.output.selectionEnd = this.selectionEnd;
		} else {
			this.output.html(this.value);
		}

		//let the output know that value as changed
		this.output.trigger("change");
		this.output.trigger("keyup");
		this.output.trigger("");

		if (this.cbOnChange && typeof this.cbOnChange === "function") {
			this.cbOnChange(this.value);
		}

	}
};

Keyboard.prototype.getCaretPosition = function() {
	if (this.output !== undefined) {
		if (this.outputIsInputField) {
			this.selectionStart = this.output.selectionStart;
			this.selectionEnd = this.output.selectionEnd;
		}
	}
};

Keyboard.prototype.keyReleased = function(key) {
	$(key).removeClass("key_pressed");
};

Keyboard.prototype.width = function() {
	return $(this.container).outerWidth();
};

Keyboard.prototype.height = function() {
	return $(this.container).outerHeight();
};

Keyboard.prototype.ready = function(ready_function) {
	this.ready_function = ready_function;
};

Keyboard.prototype.setDefaultLayout = function() {
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
};
