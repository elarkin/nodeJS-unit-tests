var assert = require('assert');
var print = require('sys').print;
var puts = require('sys').puts;
var inspect = require('sys').inspect;

var tests_with_errors = [];
var tests_with_failures = [];
var suites = [];

var exec_test = function(name, func, suite) {
	suite = suite || {}
	try {
		// don't let the test have access to our context
		func.call(suite);
		print('.'); // success!
	} catch(err) {
		if(err.name !== 'AssertionError') {
			tests_with_errors.push({
				"name": name,
				"err": err
			});
			print('E');
		} else {
			tests_with_failures.push({
				"name": name,
				"err": err
			});
			print('F');
		}
	}
};

var print_details = function() {
	if(tests_with_errors.length === 0 && tests_with_failures.length === 0){
		return; //nothing to print
	}

	puts('');
	puts('');
	var test;
	var len = tests_with_errors.length;
	while(len--) {
		test = tests_with_errors.pop();
		print("EXCEPTION: ");
		puts(test.name);
		puts('');
		puts(inspect(test.err));
		puts('');
	}

	len = tests_with_failures.length;
	while(len--) {
		test = tests_with_failures.pop();
		print("FAILURE: ");
		puts(test.name);
		puts('');

		var err = test.err;
		
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

	print_details();
};

exports.run = run;
