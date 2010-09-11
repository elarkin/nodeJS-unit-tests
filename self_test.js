require.paths.push('src');
var puts = require('sys').puts;
var assert = require('assert');
var test = require('test');

var suite, subtest
suite = {};
subtest = {};

subtest["test"] = suite["test"] = function() {
	//I should not execute
};

subtest["test pass"] = suite["test pass"] = function() {
	//pass;
};

subtest["test error"] = suite["test error"] = function() {
	throw {
		message: "This is an example of just some random error"
	};
};

subtest["test assert failure"] = suite["test assert failure"] = function() {
	assert.ok(false,"Normal Assertion Failure");
};

suite["test subtest"] = subtest

test.run(suite);
