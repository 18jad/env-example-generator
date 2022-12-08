# Enveg (Env Example Generator)

Generate your .env example faster and easier 🚀

# Demo 

<img src="https://user-images.githubusercontent.com/74220144/206572108-a2378768-6a01-47bd-84b0-27fb454bcf25.gif" width="100%" />

<table align="center">
<tr>
<th>ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ.envㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ</th>
<th>ㅤㅤㅤㅤㅤㅤㅤㅤㅤ.env.example (after parsing)ㅤㅤㅤㅤㅤㅤㅤㅤㅤ</th>
</tr>
<tr>
<td>

```env


# VERSION 1 OF API KEY
API_KEY_V1 = "KEY_XXXX_XXX_XXX"
# VERSION 2 OF API KEY
API_KEY_V2 = "KEY2_XXXX_XXX_XXX"

# ONE COMMENT 
# DOUBLE COMMENT
# TRIPLE COMMENT
HOW_MANY_COMMENTS = 3

@ignore
IGNORE_ME = "OKAY YOU ARE IGNORED"


```

</td>
<td>



```env


# VERSION 1 OF API KEY
API_KEY_V1 = YOUR_API_KEY_V1 


# VERSION 2 OF API KEY
API_KEY_V2 = YOUR_API_KEY_V2 


# ONE COMMENT 
# DOUBLE COMMENT
# TRIPLE COMMENT
HOW_MANY_COMMENTS = YOUR_HOW_MANY_COMMENTS
```



</td>
</tr>
</table>

Command used
```
enveg -c -l 2
```

# Installation

```sh
  npm i -g enveg
```

# Usage

## Simple:
```sh
  # Open terminal in the desired directory and run:
  enveg
  # it will pick current directory .env and run with default options
```

## Advanced:
```sh
  # Open terminal in the desired directory and run:
  enveg [options]
  # e.g
  enveg -c -p "./config/.env" -s DEMO_SLUG -l 2
  
  # to ignore a key add `@ignore` before it
```

# Options (optional)
  - `-p` OR `--path` followed by the path of your .env file (relative or absolute path support), default is current terminal directory, it will pick the .env file in it if there's any.
  - `-c` OR `--comments` to include comments, by default comments are removed after parsing
  - `-e` OR `--empty` to replace values by empty space, by default values are replaced by `default_slug (YOUR) + key`
  - `-s` OR `--slug` followed by the desired slug that you want to add to the value, default is `YOUR`
  - `-l` OR `--linespace` followed by an integer indicating the line-breaks amount between each env variable, default is `1`
