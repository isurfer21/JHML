# JHML
JSON based HTML Markup Language



> This is an experimental project to check the feasibility of using JSON in place of HTML

It was started with a curiosity and finished over a tool that converts **JHML** code into pure **HTML** code. As the name suggest **JHML** refers to *JSON based HTML Markup Language*. 

While designing the syntax for JHML, I tried to make it as a JSON structure that would be intuitive to the actual HTML5 syntax for easy conversion. 

### JHML Grammar

1. For adding attributes to the tag, use `"@"` as key and it's value would be an object with key value pair, *e.g.*, 
```json
"a": {"@": {"href": "./file.html", "title": "File page"}}
```
which is equivalent to 
```html
<a href="./file.html" title="File page"></a>
```
2. For adding attributes without key to the tag, use `""` as key while it's value could be a string or an array list, *e.g.*, 
```json
"input": {"@": {"type": "checkbox", "": ["disabled", "checked"]}}
```
which is equivalent to 
```html
<input type="checkbox" disabled checked/>
```
3. For adding tag without inner content, use `""` as value, *e.g.*,
```json
{"br": ""}
```
which is equivalent to 
```html
<br />
```
4. For adding comment, use `"//"` as key and put your comment as value, e.g., 
```json
{"//": "Your comments"}
```
which is equivalent to 
```html
<!-- Your comments -->
```
5. For adding multiple values to common key of a tag, use array list in the value, e.g., 
```json
"p": {"@": {"class": ["para", "dim"]}, "": "lorem ipsum lorem ipsum"}
```
which is equivalent ot 
```html
<p class="para dim">lorem ipsum lorem ipsum</p>
```

### JHML Syntax

Here to showcase the process, we'll take an example where we would make an input file `data.json` with below content

```json
{
  "div": {
    "div": [
      {"span": "Spanning title"},
      {"br": ""},
      {"span": "Lorem ipsum lorem ipsum lorem ipsum"}
    ],
    "input": {
      "@": {
        "type": "checkbox",
        "name": "confirmation",
        "": ["disable", "checked"]							
      },
      "": "Accepts terms &amp; conditions"
    },
    "button": {
      "@": {
        "type": "button",
        "": "disable"
      },
      "": "Like"
    }
  }
}
```

Now we'll feed this file to the converter that would generate an output file as `data.html` with below content

```html
<div>
  <div>
    <span>Spanning title</span>
    <br />
    <span>Lorem ipsum lorem ipsum lorem ipsum</span>
  </div>
  <input type="checkbox" name="confirmation" disable checked />Accepts T&amp;C
  <button type="button" disable>Like</button>
</div>
```

Similarly, you can generate complete HMTL file or chunk of HTML code from JHML syntax based JSON file.

### Usage

For converting JHML based JSON file into HTML file, you can use below command,

```bash
$ node j2h.js data.json
```

where, the last parameter would be either JSON filename or file-path.

If there would be any error in the JSON file syntax then an exception would occur otherwise it would generate the equivalent HTML file with the same filename, only the extension get's changed.

### Observation

After using this experimental tool to generate HTML code, I have noticed

1. I don't have to worry about closing tags because JSON syntax handles that itself.
2. HTML syntax looks pretty smaller w.r.t. JSON syntax for same chunk of code.
3. Complex HTML code looks simplified in JSON, if it's size is ignored.
4. JHML would be useful for intermediate code like for cross-language conversion.
5. Storage in this format is size-effective due to it's small size when minified JSON.

### Copyright & License

Copyright (c) 2019 Abhishek Kumar.

Licensed under MIT License.
