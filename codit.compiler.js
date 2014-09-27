var Codit = {
	functions: {},
	cFunctions: {},
	uFunctions: {},
	scope: {},

	currentLine: -1,

	operators: ['+', '-', '*', '/'],
	ifOperators: ['==','>','<','!=', '<=', '>='],
	loopOperators: ['until', 'as long as'],
	events: ["clicked", "hovered", "keydowned"]
};

Codit.compile = function (code, options) {
	this.code = code;
	this.lines = code.split("\n");

	for (this.currentLine = 0; this.currentLine < this.lines.length; this.currentLine++) {
		this.query(this.lines[this.currentLine]);
		lastChar = this.lines[this.currentLine].substr(this.lines[this.currentLine].length-1);
		if(lastChar == ':') {
			stillFunction = true;
			Codit.currentLine++;
			while(stillFunction) {
				if(Codit.lines[Codit.currentLine].indexOf(";") > -1) {
					stillFunction = false;
				} else {
					Codit.currentLine++;
				}
			}
		}

	};
}

Codit.query = function (line) {
	this.command = line.split(" ")[0].replace(" ",'');
	this.parameters = line.substr(line.indexOf(" ")+1);

	if(this.command.length > 1)this.functions[this.command](this.parameters);
}

Codit.execute = function (code, options) {
	try {
		Codit.compile(code, options);
		
	} catch (error) {
		parsed = Codit.parseError(error);
		Codit.output(parsed[0], parsed[1]);
	}
}

Codit.value = function  (content) {
	if(content.substr(0,1) === "@") {
		content = this.scope[content.substr(1)];
	} 

	if(parseInt(content) > 0 || parseInt(content) <= 0) {
		content = parseInt(content);
	} else {
		content = content.replace("\\", "");
	}

	return content;
}

Codit.phrase = function (content) {
	bits = content.split(" ");
	result = "";
	for (var bit = 0; bit < bits.length; bit++) {
		word = bits[bit];
		if(Codit.operators.indexOf(word) > -1) {
			temp = Codit.value(bits[bit-1]) + Codit.value(bits[bit]) + Codit.value(bits[bit+1]);
			temp = eval(temp);
			result += temp;
		} else if((Codit.operators.indexOf(bits[bit-1]) < 0) && (Codit.operators.indexOf(bits[bit]) < 0) && (Codit.operators.indexOf(bits[bit+1]) < 0)){
			result += Codit.value(word);
		}
		if(result.toString() == result && bit != bits.length-1)result += " ";
	};

	return result;
}

Codit.evalize = function (content) {
	if(parseInt(content) >=0 || parseInt(content) < 0) {
		return content;
	} else {
		return " '"+content+"' ";
	}
}

Codit.cFunction = function (func, name, command) {
	this.func = func;
	this.name = name;
	this.command = command;

	Codit.functions[this.command] = this.func;
	Codit.cFunctions[this.command] = this;
}


Codit.output = function (content, tip) {

	if(typeof tip !== 'undefined')content += " \n"+tip;
	alert(content);
}

Codit.input = function (content) {
	return prompt(content);
}

Codit.error = function (content, tip) {
	if(typeof tip !== "undefined") {
		content += "<small>("+tip+")</small>";
	}
	throw content; 
}

Codit.parseError = function(text) {
	if(text == "TypeError: Cannot read property 'replace' of undefined") {
		return ["Browser error - expected value", "The variable name might be wrong or there's a space at the end of the line"];
	}

	if(text == "TypeError: Cannot read property 'split' of undefined") {
		return ["Browser error - wrong Codit syntax", "Check your between-commands, like `to` and `then`."];
	}

	if(text == "TypeError: undefined is not a function") {
		return ["Browser error - could not find such a function", "Maybe the command is not defined?"];
	}

	/*if(text.indexOf(" is not defined") > -1) {
		return ["Browser error - something is not defined with a value", "Check all your variables and make sure your numbers are numbers"];
	}*/
	return [text,'at line '+(Codit.currentLine+1)];
}