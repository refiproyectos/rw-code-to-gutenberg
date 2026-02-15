# Template: 1 Plugin / 1 RW Block

Base scaffold to create one Gutenberg block plugin for one section.

## 1) Rename placeholders
Replace every `example/home/hero` occurrence:
- `rw-example-home-hero.php`
- `block.json` (`name`, `title`, `textdomain`)
- `package.json` (`name`)
- `languages/*` file names + headers

Target naming:
- Visible name: `RW nombredelaweb seccion`
- Block slug: `refineria/rw-{web}-{seccion}`
- Plugin textdomain: `rw-{web}-{seccion}`

## 2) Install and build

```bash
npm install
npm run build
```

## 3) Translation maintenance
Update POT on each text change:

```bash
npm run make-pot
```

Compile PO to MO:

```bash
msgfmt languages/<textdomain>-es_ES.po -o languages/<textdomain>-es_ES.mo
msgfmt languages/<textdomain>-ca.po -o languages/<textdomain>-ca.mo
msgfmt languages/<textdomain>-en_US.po -o languages/<textdomain>-en_US.mo
```

## 4) ZIP delivery
Zip the plugin folder with `build/` and `languages/` included for installation.
