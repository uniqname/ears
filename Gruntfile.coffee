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

        # https:#github.com/gruntjs/grunt-contrib-uglify
        uglify:
            options:
                compress: true
                preserveComments:'some' # preserve the blocks of comments that start with a /*!
                sourceMap: "dist/<%= pkg.name %>.min.js.map"
                sourceMapIn: 'dist/<%= pkg.name %>.js.map'
                sourceMapRoot: "dist/"

            dist:
                src:['dist/<%= pkg.name %>.js']
                dest:'dist/<%= pkg.name %>.min.js'

        # https:#npmjs.org/package/grunt-include-replace
        includereplace:
            dist:
                options:
                    # Global variables available in all files
                    globals:
                        version: '<%= pkg.version %>'
                        date: '<%= grunt.template.today("yyyy/mm/dd") %>'
                        earsjs: '<%= pkg.name %>.min.js'
                    
                    # Optional variable prefix & suffix, defaults as shown
                    prefix: '@@'
                    suffix: ''

                # Files to perform replacements and includes with
                src: ['dist/<%= pkg.name %>.js', 'dist/<%= pkg.name %>.min.js', '*.html']

                # Destinaion directory to copy files to
                dest: 'dist/'

            dev: 
                options:

                    # Global variables available in all files
                    globals:
                        version: '<%= pkg.version %>'
                        date: '<%= grunt.template.today("yyyy/mm/dd") %>'
                        earsjs: '<%= pkg.name %>.js'

                # Files to perform replacements and includes with
                src: ['dist/<%= pkg.name %>.js', 'dist/<%= pkg.name %>.min.js', '*.html']
        yuidoc:
            compile:
                name: '<%= pkg.name %>'
                description: '<%= pkg.description %>'
                version: '<%= pkg.version %>'
                url: '<%= pkg.homepage %>'
                options:
                    paths: 'dist/'
                    outdir: 'docs/'


    grunt.loadNpmTasks 'grunt-contrib-coffee'
    grunt.loadNpmTasks 'grunt-contrib-uglify'
    grunt.loadNpmTasks 'grunt-include-replace'
    grunt.loadNpmTasks 'grunt-contrib-yuidoc'

    grunt.registerTask 'dev',['coffee:compile','uglify:dist', 'includereplace:dev', 'yuidoc:compile']
    grunt.registerTask 'default',['coffee:compile','uglify:dist', 'includereplace:dist', 'yuidoc:compile']
