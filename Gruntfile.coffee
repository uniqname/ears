module.exports = (grunt) ->
	grunt.initConfig
		pkg: grunt.file.readJSON 'package.json'
		
		coffee:
            compile:
                options:
                  sourceMap: true

                files: [{
                    expand: true
                    cwd: 'src/'
                    src: ['**.coffee']
                    dest: 'dist/'
                    rename: (dest, src) ->
                        filename = "#{src.substring src.lastIndexOf('/'), src.length}"
                        filename = "#{filename.substring 0, filename.lastIndexOf('.')}"

                        return "#{dest}#{filename}.js"
                }]

        # https:#npmjs.org/package/grunt-include-replace
        includereplace:
            dist:
                options:
                    # Global variables available in all files
                    globals:
                        version: '<%= pkg.version %>'
                        date: '<%= grunt.template.today("yyyy/mm/dd") %>'
                    
                    # Optional variable prefix & suffix, defaults as shown
                    prefix: '@@'
                    suffix: ''

                # Files to perform replacements and includes with
                src: ['dist/<%= pkg.name %>.js', 'dist/<%= pkg.name %>.min.js']

                # Destinaion directory to copy files to
                dest: 'dist/'

        # https:#github.com/gruntjs/grunt-contrib-uglify
        uglify:
            options:
                compress: true
                preserveComments:'some' # preserve the blocks of comments that start with a /*!

            dist:
                src:['dist/<%= pkg.name %>.js']
                dest:'dist/<%= pkg.name %>.min.js'


    grunt.loadNpmTasks 'grunt-contrib-coffee'
	grunt.loadNpmTasks 'grunt-contrib-uglify'
	grunt.loadNpmTasks 'grunt-include-replace'

	grunt.registerTask 'default',['coffee:compile','uglify:dist', 'includereplace']
