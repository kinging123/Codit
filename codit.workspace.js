$(function () {
	//Override Codit settings
	Codit.output = function (content, tip) {

		$("#output").append("<br /> > "+content);
		if(typeof tip !== "undefined") {
			$("#output").append("<small>("+tip+")</small>");
		}
	}

	Codit.input = function (content) {
		return prompt(content);
	}


	//Since we overridden the output functionality, 
	//we want to have another way of stopping the code excecution with an alert.
	new Codit.cFunction(function(parameters){alert(parameters)}, "Debugging Alert", "alert");



	//Clearing function is very good for testing
	new Codit.cFunction(function (parameters) {
		$("#output, #code").html("").val('');

	}, "Clearing", "clear");



	$("#compile").click(function () {
		Codit.compile($("#code").val());
	});

	$("#code").on("keydown", function (e) {
		if(e.keyCode == 13 && e.ctrlKey) { // Ctrl+Enter to excecute the code
			Codit.excecute($("#code").val());

		}
	});
});