## mxy-cli

a simple javascript project cli


### installation

	$ npm install -g mxy-cli

### Usage

	$ mxy init <template-name> <project-name>
Example:

	$ mxy init webpack my-project

this command will pull the template from betterTry/webpack-template, prompts for some information, and generate the project at `./my-project`.

### local Template

Instead of a GitHub repo, you can also use a template on your local file system:

  	$ mxy init ~/www/js/webpack-template my-project

### Usable Template
[webpack](https://github.com/betterTry/webpack-template) - A full-featured Webpack + vue + pug + typescript setup with hot-reload, linting & css extraction.

### Custom Templates
please have a look vue-cli.
