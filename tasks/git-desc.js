"use strict";

var shell = require( 'shelljs' );


module.exports = function (grunt) {
	var GIT_DESC = "git-desc";

	grunt.template.addDelimiters(GIT_DESC, "{%", "%}");
	grunt.registerMultiTask('git-desc', 'git describe', function(type){

		var options = this.options({
				template: "{%=branch%}-{%=commitSHA%}-{%=object%}{%=dirty%}",
				prop: "config.gitdesc"
			}),
			data = {},
			res;

		grunt.verbose.writeflags(options, 'Options');

		if ( (res = shell.exec("git branch | grep '*' | sed 's/* //'", {silent:true})).code == 0){
			data.branch = res.output.toString().trim();
		}

		if ( (res = shell.exec("git log --pretty=format:'%h' -n 1", {silent:true})).code == 0){
			data.commitSHA = res.output.toString().trim();
		}

		if ( (res = shell.exec("git describe", {silent:true})).code == 0){
			data.tag = res.output.toString().trim();
		}

		if (options.template){
			var compiledTmpl = grunt.template.process(options.template, {
								"data": data,
								"delimiters": GIT_DESC
							});
			grunt.config(options.prop+".template", compiledTmpl);
		}

		grunt.config(options.prop+".data", data);
		grunt.log.ok(compiledTmpl);
		console.log(grunt.config(options.prop));
	});

}
