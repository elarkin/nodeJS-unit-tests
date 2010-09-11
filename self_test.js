require.paths.push('src');
var puts = require('sys').puts;
var assert = require('assert');
var test = require('test');

var suite = {};
suite["test"] = function() {
	//I should not execute
};
suite["test pass"] = function() {
	//pass;
};
suite["test error"] = function() {
	throw {
		message: "This is an example of just some random error"
	};
};

suite["test assert failure"] = function() {
	assert.ok(false,"Normal Assertion Failure");
};

puts("You should see one dot (a pass), one E (an error), and one F (a failure)");
puts("========================================================================");

test.run(suite);
