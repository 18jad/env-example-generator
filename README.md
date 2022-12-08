# Enveg (Env example generator aka Env e.g)
Generate your .env example faster and easier 🚀

# Usage
```sh
  # Open terminal in the desired directory and run:
  enveg [options]
  # e.g
  event -p "./config/.env" -c -s SECRET -l 2
```
#### Available options are:
- Mandatory:
  - ```-p``` OR ```--path``` followed by the path of your .env file (relative or absolute path support)
- Optional:
  - ```-c``` OR ```--comments``` to include comments, by default comments are removed after parsing
  - ```-e``` OR ```--empty``` to replace values by empty space, by default values are replace by ```default_slug (YOUR) + key```
  - ```-s``` OR ```--slug``` followed by the desired slug that you want to add to the value, default is ```YOUR```
  - ```-l``` OR ```--linespace``` followed by an integer indicating the line-breaks amount between each env variable, default is ```1```
