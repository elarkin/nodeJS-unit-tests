require.paths.push('src');
var puts = require('sys').puts;
var assert = require('assert');
var test = require('test');

var suite, subtest
suite = {};
subtest1 = {};
subtest2 = {};
subtest1_subtest = {};

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

subtest1_subtest["test assert failure"] = subtest2["test assert failure"] = subtest1["test assert failure"] = suite["test assert failure"] = function() {
	assert.ok(false,"Normal Assertion Failure");
};

suite["test branch1"] = subtest1;
subtest2["test branch2 subtests"] = subtest1["test branch1 subtest"] = subtest1_subtest;
suite["test branch2"] = subtest2;

test.run(suite);
