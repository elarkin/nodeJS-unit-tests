var assert = require('assert');
var print = require('sys').print;
var puts = require('sys').puts;
var inspect = require('sys').inspect;

var tests_with_errors = {};
var tests_with_failures = {};

var exec_test = function(name, func, suite) {
	suite = suite || {}
	try {
		// don't let the test have access to our context
		func.call(suite);
		print('.'); // success!
	} catch(err) {
		if(err.name !== 'AssertionError') {
			tests_with_errors[name] = err;
			print('E');
		} else {
			tests_with_failures[name] = err;
			print('F');
		}
	}
};

var print_summary = function() {
	puts('');
	puts('');
	var test_name;
	for(test_name in tests_with_errors) {
		print("EXCEPTION: ");
		puts(test_name);
		puts('');
		puts(inspect(tests_with_errors[test_name]));
		puts('');
	}

	for(test_name in tests_with_failures) {
		print("FAILURE: ");
		puts(test_name);
		puts('');

		var err = tests_with_failures[test_name];
		
		if(err.message) {
			print("Message: ");
			puts(err.message);
		}

		if(err.actual !== undefined || err.expected !== undefined) {
			print("Actual: ");
			puts(inspect(err.actual));
			print("Expected: ");
			puts(inspect(err.expected));
		}

		if(err.operator) {
			print("Operator: ");
			puts(inspect(err.operator));
		}

		if(err.stack !== undefined) {
			puts("Stacktrace:");
			puts(err.stack);
		}
	}
};

var run = function(suite) {
	var test_name;
	for(test_name in suite) {
		if(/^test.+/.test(test_name)) {
			if(suite.hasOwnProperty(test_name)) {
				exec_test(test_name,suite[test_name],suite);
			}
		}
	}

	print_summary();
};

exports.run = run;
