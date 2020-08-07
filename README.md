# FormatJS locale generator

This is a tool to generate locales for FormatJS like ones from `locale-data`
folder from the polyfills.

You may need a locale that is absent or inaccurate there but it can be onerous
to write them by hand. So this uses some source files to generate locales as
the original ones are created but in a more appropriate format.

⚠️ **The currently supported `Intl` APIs are**:
- `Intl.ListFormat`
- `Intl.PluralRules`
- `Intl.RelativeTimeFormat`

## Usage

```
Usage: formatjs-localegen [options] <files...>

Create locales for FormatJS

Options:
  -m <module>    Module to create locale for. If specified, there should be
                 only one input file
  -d <dir>       Output directory (default: "locale-data")
  -l <locale>    Locale code
```

The source files are YAML files like [these ones][example-dir] (Esperanto). The
`Intl` module gets inferred by the file name (see the example folder mentioned
before). You can define it yourself by `-m` option and in this case you can
provide only one file.

## Building

The project uses [Yarn].

```bash
git clone https://github.com/kotwys/formatjs-locale-generator
cd formatjs-locale-generator
yarn
```

The executable will be named `dist/index.js`.

[Yarn]: https://classic.yarnpkg.com/en/
[example-dir]: https://github.com/kotwys/formatjs-esperanto/tree/master/data
