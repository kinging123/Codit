

new Codit.cFunction(function(text){
	text = Codit.phrase(text);
	Codit.output(text);
}, "Printing", "say");



new Codit.cFunction(function (parameters){
	
	parameters = parameters.split(" to ");
	vname = parameters[0];
	value = parameters[1];
	value = Codit.phrase(value)

	if(vname.substr(0,1) === "@") {
		vname = vname.substr(1);

		if(value.indexOf( "function:") > -1) {
			theFunction = "function: \n";
			stillFunction = true;
			currentLine = Codit.currentLine+1;
			while(stillFunction) {
				if(Codit.lines[currentLine].indexOf(";") > -1) {
					stillFunction = false;
				} else {
					theFunction += "\n"+Codit.lines[currentLine];
					currentLine++;
				}
			}
			value = theFunction;
			Codit.uFunctions[vname] = value;
		}
		if(value.substr(value.length-1) == " ")value = value.substr(0,value.length-1)
		Codit.scope[vname] = value;
	}else {
		Codit.error("Compiling error - wrong variable name: `"+vname+"`", "Should be `@"+vname+"`");
	}

}, "Setting", "set");


new Codit.cFunction(function (parameters) {
	vname = parameters
	if(vname.substr(0,1) === "@") {
		vname = vname.substr(1);
		Codit.scope[vname] = parseInt(Codit.scope[vname]) +1;
	}else {
		Codit.error("Compiling error - wrong variable name: `"+vname+"`", "Should be `@"+vname+"`");
	}
}, "Incrementing", "increment");


new Codit.cFunction(function (parameters){

	parameters = parameters.substr(0,parameters.indexOf(" then:"));
	for (var i = 0; i < Codit.ifOperators.length; i++) {
		operator = Codit.ifOperators[i];
		if(parameters.split(" "+operator+" ").length == 2){
			parameters = parameters.split(" "+operator+" ");

			i = 20;
		}
	};

	parameters[0] = Codit.phrase(parameters[0]);
	parameters[1] = Codit.phrase(parameters[1]);

	parameters[0] = Codit.evalize(parameters[0]);
	parameters[1] = Codit.evalize(parameters[1]);


	stillCode = true;
	currentLine = Codit.currentLine+1;
	theCode = "";
	while(stillCode) {
		if(Codit.lines[currentLine].indexOf(";") > -1) {
			stillCode = false;
		} else {
			theCode += "\n"+Codit.lines[currentLine];
			currentLine++;
		}
	}

	if(eval(parameters[0]+" "+operator+" "+parameters[1])){
		theLines = theCode.split("\n");
		for (var i = 0; i < theLines.length; i++) {
			Codit.query(theLines[i]);
		};
	}


}, "Flow Control", "if");



new Codit.cFunction( function (parameters) {

	parameters = parameters.split(" to ");
	vname = parameters[1];
	question = parameters[0];
	question = Codit.phrase(question);

	if(vname.substr(0,1) === "@") {
		vname = vname.substr(1);
		Codit.scope[vname] = Codit.input(question);
	}else {
		Codit.error("Compiling error - wrong variable name: `"+vname+"`", "Should be `@"+vname+"`");
	}

}, "Input", "get");

new Codit.cFunction( function (parameters) {
	fname = parameters;
	theFunc = Codit.value(fname);
	if (theFunc.indexOf("function:") == 0) {
		lines = theFunc.split("\n");
		for (var line = 1; line < lines.length; line++) {
			Codit.query(lines[line]);
		};
	};
}, "Calling a Function", "excecute");




new Codit.cFunction( function (parameters) {
	output = "Codit commands: ";
	$.each(Codit.cFunctions, function (command, funcObj) {
		output +=  " <br />" + funcObj.command+ " - " + funcObj.name;
	});

	output += "<br /> <hr /> User defined functions:";

	$.each(Codit.uFunctions, function (fname) {
		output +=  " <br />" + fname;
	});	

	Codit.output(output)
}, "Listing the avaliable functions", "help");


new Codit.cFunction( function (parameters){
	
	parameters = parameters.substr(0,parameters.indexOf(":"));
	for (var i = 0; i < Codit.loopOperators.length; i++) {
		operator = Codit.loopOperators[i];
		if(parameters.substr(0, operator.length) == operator){
			parameters = parameters.substr(operator.length+1);
			loopOperator = operator;
			i = 20;
		}
	};


	// parameters = parameters.substr(0,parameters.indexOf(":"));
	for (var i = 0; i < Codit.ifOperators.length; i++) {
		operator = Codit.ifOperators[i];
		if(parameters.split(" "+operator+" ").length == 2){
			parameters = parameters.split(" "+operator+" ");
			ifOperator = operator;
			i = 20;
		}
	};




	stillCode = true;
	currentLine = Codit.currentLine+1;
	theCode = "";
	while(stillCode) {
		if(Codit.lines[currentLine].indexOf(";") > -1) {
			stillCode = false;
		} else {
			theCode += "\n"+Codit.lines[currentLine];
			currentLine++;
		}
	}

	bonus = (loopOperator == "until")?"!":"";

	parameter1 = Codit.phrase(parameters[0]);
	parameter2 = Codit.phrase(parameters[1]);
	parameter1 = Codit.evalize(parameter1);
	parameter2 = Codit.evalize(parameter2);
	stillActive = eval(bonus+"("+parameter1+" "+operator+" "+parameter2+")");

	while(stillActive){

		theLines = theCode.split("\n");
		for (var i = 0; i < theLines.length; i++) {
			Codit.query(theLines[i]);
		};
		
		parameter1 = Codit.phrase(parameters[0]);
		parameter2 = Codit.phrase(parameters[1]);
		parameter1 = Codit.evalize(parameter1);
		parameter2 = Codit.evalize(parameter2);
		stillActive = eval(bonus+"("+parameter1+" "+operator+" "+parameter2+")");
	
	}


}, "Loop", "repeat");


