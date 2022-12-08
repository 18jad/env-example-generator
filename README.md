# Enveg (Env Example Generator)

Generate your .env example faster and easier 🚀

<img src="https://user-images.githubusercontent.com/74220144/206539193-99ba8398-70e3-4dfb-8149-c6d2858da554.gif" width="100%" />

# Installation

```sh
  npm i -g enveg
```

# Usage

```sh
  # Open terminal in the desired directory and run:
  enveg [options]
  # e.g
  enveg -c -p "./config/.env" -s DEMO_SLUG -l 2
```

#### Available options are:

- Mandatory:
  - `-p` OR `--path` followed by the path of your .env file (relative or absolute path support)
- Optional:
  - `-c` OR `--comments` to include comments, by default comments are removed after parsing
  - `-e` OR `--empty` to replace values by empty space, by default values are replaced by `default_slug (YOUR) + key`
  - `-s` OR `--slug` followed by the desired slug that you want to add to the value, default is `YOUR`
  - `-l` OR `--linespace` followed by an integer indicating the line-breaks amount between each env variable, default is `1`
