var assert = require('assert');
var print = require('sys').print;
var puts = require('sys').puts;
var inspect = require('sys').inspect;

var failures = [];
var suites = [];

var exec_test = function(name, func, suite) {
	suite = suite || {}
	try {
		// don't let the test have access to our context
		func.call(suite);
		print('.'); // success!
	} catch(err) {
		var is_error = !(err instanceof(assert.AssertionError));
		failures.push({
			"name": name,
			"err": err,
			"is_error": is_error
		});

		if(is_error) {
			print('E');
		} else {
			print('F');
		}
	}
};

var print_details = function() {
	if(failures.length === 0){
		return; //nothing to print
	}

	puts('');
	var test;
	var len = failures.length;
	var num_failed = len;
	while(len--) {
		test = failures.shift();
		puts('');
		if(test.is_error){
			print("EXCEPTION: ");
			puts(test.name);
			puts(inspect(test.err));
		} else {
			print("FAILURE: ");
			puts(test.name);
			puts(test.err.toString());
		}
	}
	return num_failed;
};

var run_suite = function(suite, suite_name) {
	var test_name;
	var test;
	var test_path;
	for(test_name in suite) {
		if(/^test.+/.test(test_name)) {
			if(suite.hasOwnProperty(test_name)) {
				test = suite[test_name];
				test_path = suite_name + "/" + test_name;
				if(test.constructor === Function) {
					exec_test(test_path,test,suite);
				} else {
					suites.push({
						"name":test_path,
						"suite":test
					});
				}
			}
		}
	}
};

var run = function(root_suite,suite_name) {
	if(suite_name === undefined) {
		suite_name = "Main";
	}

	suites.push({
		"name":suite_name,
		"suite":root_suite
	});

	var suite;
	while(suites.length > 0) {
		suite = suites.pop();
		run_suite(suite.suite,suite.name);
	}

	return print_details();
};

exports.run = run;
