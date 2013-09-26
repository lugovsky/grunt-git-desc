"use strict";

module.exports = function (grunt) {
	grunt.initConfig({
		"jshint": {
			"all": [
				"Gruntfile.js",
				"tasks/*.js"
			],
			"options": {
				"jshintrc": ".jshintrc"
			}
		},

		"git-desc": {
			me:{
				options:{
					template: "{%=branch%}.{%=customSHA2%}.{%=tag%}{%=SHA%}.+{%=since%}",
					customSHA2: "git log --pretty=format:'%h' -n 1"
				}
			}
		}

	});

	grunt.loadTasks("tasks");
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.registerTask("default", [  "git-desc" ]);
};