"use strict";

var shell = require( 'shelljs' );


module.exports = function (grunt) {
	var GIT_DESC = "git-desc";

	grunt.template.addDelimiters(GIT_DESC, "{%", "%}");
	grunt.registerMultiTask('git-desc', 'git describe', function(type){

		var options = this.options({
				template: "{%=branch%}.{%=shortSHA%}.{%=tag%}",
				prop: "config.gitdesc",
				branch: "git branch | grep '*' | sed 's/* //'",
				tag: "git describe --abbrev=0 --tags",
				shortSHA: "git log --pretty=format:'%h' -n 1"
			}),
			data = {},
			res;

		function run(cmd) {
			var res = shell.exec(cmd, {silent:true});
			return res.code === 0 ? res.output.toString().trim() : '' ;
		}

		grunt.verbose.writeflags(options, 'Options');

		for (var name in options) {
			if (name in {template:1, prop:1}) continue;
			data[name] = run(options[name]);
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
	});

}
