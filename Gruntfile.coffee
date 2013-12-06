module.exports = (grunt) ->
    # load all grunt tasks and not need to declare them at the end
    require('matchdep').filterDev('grunt-*').forEach grunt.loadNpmTasks

    grunt.initConfig
        pkg: grunt.file.readJSON 'package.json'
        
        # basic watch tasks first for development
        watch:
            coffee:
                files: [
                    'src/*.coffee'
                ]
                tasks: 'coffee:compile'
                options:
                    livereload: true

        # lint our files to make sure we're keeping to team standards
        coffeelint:
            files:
                src: ['src/<%= pkg.name %>.coffee']
            options:
                'indentation':
                    value: 4
                    level: 'warn'
                'no_trailing_whitespace':
                    level: 'ignore'
                'max_line_length':
                    velue: 120
                    level: 'warn'

        coffee:
            compile:
                options:
                    sourceMap: true

                files: [{
                    expand: true
                    cwd: 'src/'
                    src: ['<%= pkg.name %>.coffee']
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

        # clear out any unneccessary files
        clean: ['dist/*']

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
                src: ['dist/<%= pkg.name %>.js', 'dist/<%= pkg.name %>.min.js', 'src/<%= pkg.name %>.html']

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
                src: ['dist/<%= pkg.name %>.js', 'dist/<%= pkg.name %>.min.js', 'src/<%= pkg.name %>.html']

                # Destinaion directory to copy files to
                dest: 'dist/'                

        yuidoc:
            compile:
                name: '<%= pkg.name %>'
                description: '<%= pkg.description %>'
                version: '<%= pkg.version %>'
                url: '<%= pkg.homepage %>'
                options:
                    paths: 'dist/'
                    outdir: 'docs/'

    grunt.registerTask 'dev',['clean', 'coffeelint', 'coffee:compile', 'includereplace:dev']
    grunt.registerTask 'default',['clean', 'coffee:compile', 'uglify:dist', 'includereplace:dist', 'yuidoc:compile']
