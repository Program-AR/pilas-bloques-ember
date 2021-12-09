# Translations

> By default, we are using `es-ar` locale 

## Introduction

To use reusable and modularizable translations, we are using a custom structure and rules.

## File structure

When we create a file like `app/components/example_component.js` (and this file includes any translation), we shouldn't add literal text in this file. 
Instead of writing literal text in the file, we will have to use a similar structure, and create custom translation folders, like:

```
/app
  /components
    example_component.js
  /template
    example_template.js
    /desafios
      example_template_desafio.js

/translations
  /components
    /example_component
      es-ar.yaml
  /template
    /example_template
      es-ar.yaml
    /desafios
      /example_template_desafio
        es-ar.yaml
```

## Wrap translations with namespace

Using ember-intl as package reference, we are using the `wraptranslationswithnamespace` configuration.
[Link to ember-intl wraptranslationswithnamespace docs](https://ember-intl.github.io/ember-intl/docs/guide/translating-text#the-wraptranslationswithnamespace-option)
