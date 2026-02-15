(function (blocks, blockEditor, components, element, i18n) {
  var registerBlockType = blocks.registerBlockType;
  var __ = i18n.__;
  var el = element.createElement;
  var Fragment = element.Fragment;

  var RichText = blockEditor.RichText;
  var URLInputButton = blockEditor.URLInputButton;
  var InspectorControls = blockEditor.InspectorControls;
  var MediaUpload = blockEditor.MediaUpload;
  var MediaUploadCheck = blockEditor.MediaUploadCheck;
  var useBlockProps = blockEditor.useBlockProps;

  var PanelBody = components.PanelBody;
  var RangeControl = components.RangeControl;
  var TextControl = components.TextControl;
  var SelectControl = components.SelectControl;
  var ToggleControl = components.ToggleControl;
  var Button = components.Button;
  var BaseControl = components.BaseControl;
  var ColorPicker = components.ColorPicker;

  var FONT_OPTIONS = [
    { label: 'Manrope', value: '"Manrope", sans-serif' },
    { label: 'System Sans', value: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' },
    { label: 'Georgia', value: 'Georgia, serif' }
  ];

  var SPACING_UNITS = [
    { label: 'px', value: 'px' },
    { label: 'rem', value: 'rem' },
    { label: 'em', value: 'em' },
    { label: '%', value: '%' },
    { label: 'vw', value: 'vw' },
    { label: 'vh', value: 'vh' }
  ];

  function parseNumericInput(value, fallback) {
    var parsed = parseFloat(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  function updateAttr(setAttributes, key, value) {
    var update = {};
    update[key] = value;
    setAttributes(update);
  }

  function spacingValue(attrs, prefix, type) {
    var unit = attrs[prefix + type + 'Unit'] || 'px';

    function sideValue(side) {
      var raw = attrs[prefix + type + side];
      var numeric = typeof raw === 'number' ? raw : 0;
      return numeric + unit;
    }

    return [
      sideValue('Top'),
      sideValue('Right'),
      sideValue('Bottom'),
      sideValue('Left')
    ].join(' ');
  }

  function spacingControls(attrs, setAttributes, prefix, domain) {
    function sideInput(label, placeholder, sideKey, linked, allSideKeys) {
      var key = prefix + sideKey;
      return el(
        'div',
        { style: { minWidth: 0 } },
        el(TextControl, {
          label: label,
          hideLabelFromVision: true,
          placeholder: placeholder,
          value: attrs[key],
          type: 'number',
          onChange: function (value) {
            var numeric = parseNumericInput(value, attrs[key] || 0);
            if (!linked) {
              updateAttr(setAttributes, key, numeric);
              return;
            }

            var update = {};
            allSideKeys.forEach(function (side) {
              update[prefix + side] = numeric;
            });
            setAttributes(update);
          }
        })
      );
    }

    function row(title, type) {
      var unitKey = prefix + type + 'Unit';
      var linkedKey = prefix + type + 'Linked';
      var sidePrefix = type;
      var sideKeys = [
        sidePrefix + 'Top',
        sidePrefix + 'Right',
        sidePrefix + 'Bottom',
        sidePrefix + 'Left'
      ];
      var isLinked = typeof attrs[linkedKey] === 'boolean' ? attrs[linkedKey] : true;

      return el(
        'div',
        {
          style: {
            display: 'grid',
            gridTemplateColumns: '72px repeat(4, minmax(0, 1fr)) 86px auto',
            gap: '8px',
            alignItems: 'center',
            marginBottom: '8px'
          }
        },
        el('div', { style: { fontWeight: 600, opacity: 0.9 } }, title),
        sideInput(__('Superior', domain), 'T', sidePrefix + 'Top', isLinked, sideKeys),
        sideInput(__('Derecha', domain), 'R', sidePrefix + 'Right', isLinked, sideKeys),
        sideInput(__('Inferior', domain), 'B', sidePrefix + 'Bottom', isLinked, sideKeys),
        sideInput(__('Izquierda', domain), 'L', sidePrefix + 'Left', isLinked, sideKeys),
        el(
          'div',
          { style: { minWidth: 0 } },
          el(SelectControl, {
            label: type === 'Margin' ? __('Unidad de margen', domain) : __('Unidad de relleno', domain),
            hideLabelFromVision: true,
            value: attrs[unitKey],
            options: SPACING_UNITS,
            onChange: function (value) {
              updateAttr(setAttributes, unitKey, value || 'px');
            }
          })
        ),
        el(
          Button,
          {
            isSmall: true,
            variant: isLinked ? 'primary' : 'secondary',
            onClick: function () {
              updateAttr(setAttributes, linkedKey, !isLinked);
            },
            title: isLinked ? __('Desvincular lados', domain) : __('Vincular lados', domain)
          },
          isLinked ? __('Vinculado', domain) : __('Libre', domain)
        )
      );
    }

    return el(
      Fragment,
      null,
      row(__('Margen', domain), 'Margin'),
      row(__('Relleno', domain), 'Padding')
    );
  }

  function maybeStyle(value) {
    return value ? value : undefined;
  }

  function colorFromPicker(color) {
    if (!color) {
      return '';
    }
    if (typeof color === 'string') {
      return color;
    }
    if (color.rgb) {
      var rgb = color.rgb;
      if (typeof rgb.a === 'number' && rgb.a < 1) {
        var alpha = Math.round(rgb.a * 100) / 100;
        return 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + alpha + ')';
      }
      return color.hex || 'rgb(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ')';
    }
    return color.hex || '';
  }

  function linkTargetAttrs(isNewTab) {
    if (!isNewTab) {
      return {};
    }

    return {
      target: '_blank',
      rel: 'noopener noreferrer'
    };
  }

  registerBlockType('refineria/rw-palma-beauty-palma-home-hero', {
    edit: function (props) {
      var attrs = props.attributes;
      var setAttributes = props.setAttributes;
      var domain = 'rw-palma-beauty-palma-home-hero';

      function colorControl(label, key, fallback) {
        var selected = attrs[key] === 'transparent' ? 'rgba(0,0,0,0)' : attrs[key];
        function onPick(color) {
          var value = colorFromPicker(color) || fallback;
          var update = {};
          update[key] = value;
          setAttributes(update);
        }

        return el(
          BaseControl,
          { label: label },
          el(ColorPicker, {
            color: selected || fallback,
            enableAlpha: true,
            onChange: onPick,
            onChangeComplete: onPick
          })
        );
      }

      var blockProps = useBlockProps({
        className: 'rw-palma-hero',
        style: {
          minHeight: attrs.sectionMinHeight + 'px',
          backgroundImage:
            'linear-gradient(rgba(22,17,33,' + attrs.overlayOpacity + '), rgba(22,17,33,' + (attrs.overlayOpacity + 0.15) + ')), url("' +
            attrs.backgroundImageUrl +
            '")',
          margin: spacingValue(attrs, 'section', 'Margin'),
          padding: spacingValue(attrs, 'section', 'Padding'),
          borderRadius: maybeStyle(attrs.sectionBorderRadius),
          textAlign: maybeStyle(attrs.sectionTextAlign),
          fontFamily: maybeStyle(attrs.sectionFontFamily)
        }
      });

      var contentStyle = {
        maxWidth: attrs.sectionContentMaxWidth + 'px',
        fontFamily: maybeStyle(attrs.sectionFontFamily)
      };

      var eyebrowStyle = {
        margin: spacingValue(attrs, 'eyebrow', 'Margin'),
        padding: spacingValue(attrs, 'eyebrow', 'Padding'),
        fontSize: attrs.eyebrowFontSize + 'px',
        color: maybeStyle(attrs.eyebrowColor),
        background: maybeStyle(attrs.eyebrowBackgroundColor)
      };

      var titleStyle = {
        fontSize: 'clamp(3rem, 8vw, ' + attrs.titleFontSize + 'px)',
        maxWidth: attrs.titleMaxWidth + 'px',
        color: maybeStyle(attrs.titleColor),
        fontFamily: maybeStyle(attrs.titleFontFamily),
        margin: spacingValue(attrs, 'title', 'Margin'),
        padding: spacingValue(attrs, 'title', 'Padding')
      };

      var descriptionStyle = {
        fontSize: attrs.descriptionFontSize + 'px',
        color: maybeStyle(attrs.descriptionColor),
        fontFamily: maybeStyle(attrs.descriptionFontFamily),
        margin: spacingValue(attrs, 'description', 'Margin'),
        padding: spacingValue(attrs, 'description', 'Padding')
      };

      var primaryButtonStyle = {
        backgroundColor: maybeStyle(attrs.primaryBgColor),
        color: maybeStyle(attrs.primaryTextColor),
        borderColor: maybeStyle(attrs.primaryBorderColor),
        fontSize: attrs.primaryFontSize + 'px',
        fontFamily: maybeStyle(attrs.primaryFontFamily),
        margin: spacingValue(attrs, 'primary', 'Margin'),
        padding: spacingValue(attrs, 'primary', 'Padding')
      };

      var secondaryButtonStyle = {
        backgroundColor: maybeStyle(attrs.secondaryBgColor),
        color: maybeStyle(attrs.secondaryTextColor),
        borderColor: maybeStyle(attrs.secondaryBorderColor),
        fontSize: attrs.secondaryFontSize + 'px',
        fontFamily: maybeStyle(attrs.secondaryFontFamily),
        margin: spacingValue(attrs, 'secondary', 'Margin'),
        padding: spacingValue(attrs, 'secondary', 'Padding')
      };

      return el(
        Fragment,
        null,
        el(
          InspectorControls,
          null,
          el(
            PanelBody,
            { title: __('Ajustes de sección', domain), initialOpen: true },
            el(RangeControl, {
              label: __('Altura mínima de sección (px)', domain),
              min: 420,
              max: 1000,
              value: attrs.sectionMinHeight,
              onChange: function (value) {
                setAttributes({ sectionMinHeight: value || 600 });
              }
            }),
            el(RangeControl, {
              label: __('Opacidad de superposición', domain),
              min: 0.1,
              max: 0.9,
              step: 0.05,
              value: attrs.overlayOpacity,
              onChange: function (value) {
                setAttributes({ overlayOpacity: typeof value === 'number' ? value : 0.52 });
              }
            }),
            el(RangeControl, {
              label: __('Ancho máximo del contenido (px)', domain),
              min: 520,
              max: 1280,
              value: attrs.sectionContentMaxWidth,
              onChange: function (value) {
                setAttributes({ sectionContentMaxWidth: value || 980 });
              }
            }),
            el(SelectControl, {
              label: __('Alineación de texto', domain),
              value: attrs.sectionTextAlign,
              options: [
                { label: __('Centrado', domain), value: 'center' },
                { label: __('Izquierda', domain), value: 'left' },
                { label: __('Derecha', domain), value: 'right' }
              ],
              onChange: function (value) {
                setAttributes({ sectionTextAlign: value || 'center' });
              }
            }),
            el(SelectControl, {
              label: __('Fuente de la sección', domain),
              value: attrs.sectionFontFamily,
              options: FONT_OPTIONS,
              onChange: function (value) {
                setAttributes({ sectionFontFamily: value || '"Manrope", sans-serif' });
              }
            }),
            spacingControls(attrs, setAttributes, 'section', domain),
            el(TextControl, {
              label: __('Radio de borde de sección', domain),
              value: attrs.sectionBorderRadius,
              help: __('Ejemplo: 1.8rem', domain),
              onChange: function (value) {
                setAttributes({ sectionBorderRadius: value });
              }
            }),
            el(MediaUploadCheck, null,
              el(MediaUpload, {
                onSelect: function (media) {
                  setAttributes({ backgroundImageUrl: media && media.url ? media.url : '' });
                },
                allowedTypes: ['image'],
                render: function (obj) {
                  return el(
                    Button,
                    { onClick: obj.open, variant: 'secondary' },
                    attrs.backgroundImageUrl
                      ? __('Reemplazar imagen de fondo', domain)
                      : __('Seleccionar imagen de fondo', domain)
                  );
                }
              })
            )
          ),

          el(
            PanelBody,
            { title: __('Ajustes de etiqueta superior', domain), initialOpen: false },
            el(RangeControl, {
              label: __('Tamaño de etiqueta superior (px)', domain),
              min: 10,
              max: 24,
              value: attrs.eyebrowFontSize,
              onChange: function (value) {
                setAttributes({ eyebrowFontSize: value || 12 });
              }
            }),
            colorControl(__('Color de texto de etiqueta superior', domain), 'eyebrowColor', '#ffffff'),
            colorControl(__('Color de fondo de etiqueta superior', domain), 'eyebrowBackgroundColor', 'rgba(255,255,255,0.1)'),
            spacingControls(attrs, setAttributes, 'eyebrow', domain)
          ),

          el(
            PanelBody,
            { title: __('Ajustes de título', domain), initialOpen: false },
            el(RangeControl, {
              label: __('Tamaño de título (px)', domain),
              min: 34,
              max: 96,
              value: attrs.titleFontSize,
              onChange: function (value) {
                setAttributes({ titleFontSize: value || 72 });
              }
            }),
            el(RangeControl, {
              label: __('Ancho máximo del título (px)', domain),
              min: 420,
              max: 1280,
              value: attrs.titleMaxWidth,
              onChange: function (value) {
                setAttributes({ titleMaxWidth: value || 860 });
              }
            }),
            el(SelectControl, {
              label: __('Fuente del título', domain),
              value: attrs.titleFontFamily,
              options: FONT_OPTIONS,
              onChange: function (value) {
                setAttributes({ titleFontFamily: value || '"Manrope", sans-serif' });
              }
            }),
            colorControl(__('Color del título', domain), 'titleColor', '#ffffff'),
            spacingControls(attrs, setAttributes, 'title', domain)
          ),

          el(
            PanelBody,
            { title: __('Ajustes de descripción', domain), initialOpen: false },
            el(RangeControl, {
              label: __('Tamaño de descripción (px)', domain),
              min: 14,
              max: 36,
              value: attrs.descriptionFontSize,
              onChange: function (value) {
                setAttributes({ descriptionFontSize: value || 20 });
              }
            }),
            el(SelectControl, {
              label: __('Fuente de la descripción', domain),
              value: attrs.descriptionFontFamily,
              options: FONT_OPTIONS,
              onChange: function (value) {
                setAttributes({ descriptionFontFamily: value || '"Manrope", sans-serif' });
              }
            }),
            colorControl(__('Color de la descripción', domain), 'descriptionColor', 'rgba(255,255,255,0.92)'),
            spacingControls(attrs, setAttributes, 'description', domain)
          ),

          el(
            PanelBody,
            { title: __('Ajustes del contenedor de botones', domain), initialOpen: false },
            el(TextControl, {
              label: __('Margen superior del contenedor de botones', domain),
              value: attrs.actionsMarginTop,
              onChange: function (value) {
                setAttributes({ actionsMarginTop: value || '2.25rem' });
              }
            })
          ),

          el(
            PanelBody,
            { title: __('Botón primario', domain), initialOpen: false },
            el(TextControl, {
              label: __('Texto', domain),
              value: attrs.primaryButtonText,
              onChange: function (value) {
                setAttributes({ primaryButtonText: value });
              }
            }),
            el(URLInputButton, {
              url: attrs.primaryButtonUrl,
              onChange: function (value) {
                setAttributes({ primaryButtonUrl: value });
              }
            }),
            el(ToggleControl, {
              label: __('Abrir en nueva pestaña', domain),
              checked: !!attrs.primaryButtonNewTab,
              onChange: function (value) {
                setAttributes({ primaryButtonNewTab: !!value });
              }
            }),
            el(RangeControl, {
              label: __('Botón primario font size (px)', domain),
              min: 12,
              max: 28,
              value: attrs.primaryFontSize,
              onChange: function (value) {
                setAttributes({ primaryFontSize: value || 17 });
              }
            }),
            el(SelectControl, {
              label: __('Botón primario font family', domain),
              value: attrs.primaryFontFamily,
              options: FONT_OPTIONS,
              onChange: function (value) {
                setAttributes({ primaryFontFamily: value || '"Manrope", sans-serif' });
              }
            }),
            colorControl(__('Color de fondo', domain), 'primaryBgColor', '#6e30e8'),
            colorControl(__('Color de texto', domain), 'primaryTextColor', '#ffffff'),
            colorControl(__('Color de borde primario', domain), 'primaryBorderColor', 'rgba(0,0,0,0)'),
            spacingControls(attrs, setAttributes, 'primary', domain)
          ),

          el(
            PanelBody,
            { title: __('Botón secundario', domain), initialOpen: false },
            el(TextControl, {
              label: __('Texto', domain),
              value: attrs.secondaryButtonText,
              onChange: function (value) {
                setAttributes({ secondaryButtonText: value });
              }
            }),
            el(URLInputButton, {
              url: attrs.secondaryButtonUrl,
              onChange: function (value) {
                setAttributes({ secondaryButtonUrl: value });
              }
            }),
            el(ToggleControl, {
              label: __('Abrir en nueva pestaña', domain),
              checked: !!attrs.secondaryButtonNewTab,
              onChange: function (value) {
                setAttributes({ secondaryButtonNewTab: !!value });
              }
            }),
            el(RangeControl, {
              label: __('Botón secundario font size (px)', domain),
              min: 12,
              max: 28,
              value: attrs.secondaryFontSize,
              onChange: function (value) {
                setAttributes({ secondaryFontSize: value || 17 });
              }
            }),
            el(SelectControl, {
              label: __('Botón secundario font family', domain),
              value: attrs.secondaryFontFamily,
              options: FONT_OPTIONS,
              onChange: function (value) {
                setAttributes({ secondaryFontFamily: value || '"Manrope", sans-serif' });
              }
            }),
            colorControl(__('Color de borde', domain), 'secondaryBorderColor', 'rgba(255,255,255,0.35)'),
            colorControl(__('Color de texto', domain), 'secondaryTextColor', '#ffffff'),
            colorControl(__('Color de fondo secundario', domain), 'secondaryBgColor', 'rgba(255,255,255,0.1)'),
            spacingControls(attrs, setAttributes, 'secondary', domain)
          )
        ),

        el(
          'section',
          blockProps,
          el('div', { className: 'rw-palma-hero__content', style: contentStyle },
            el(RichText, {
              tagName: 'span',
              className: 'rw-palma-hero__eyebrow',
              style: eyebrowStyle,
              value: attrs.eyebrow,
              onChange: function (value) {
                setAttributes({ eyebrow: value });
              },
              placeholder: __('Texto de etiqueta superior', domain)
            }),
            el(RichText, {
              tagName: 'h2',
              className: 'rw-palma-hero__title',
              style: titleStyle,
              value: attrs.heading,
              onChange: function (value) {
                setAttributes({ heading: value });
              },
              placeholder: __('Título del hero', domain)
            }),
            el(RichText, {
              tagName: 'p',
              className: 'rw-palma-hero__description',
              style: descriptionStyle,
              value: attrs.description,
              onChange: function (value) {
                setAttributes({ description: value });
              },
              placeholder: __('Descripción del hero', domain)
            }),
            el('div', { className: 'rw-palma-hero__actions', style: { marginTop: maybeStyle(attrs.actionsMarginTop) } },
              el('a', Object.assign({
                href: attrs.primaryButtonUrl || '#',
                className: 'rw-palma-hero__button rw-palma-hero__button--primary',
                style: primaryButtonStyle
              }, linkTargetAttrs(attrs.primaryButtonNewTab)), attrs.primaryButtonText),
              el('a', Object.assign({
                href: attrs.secondaryButtonUrl || '#',
                className: 'rw-palma-hero__button rw-palma-hero__button--secondary',
                style: secondaryButtonStyle
              }, linkTargetAttrs(attrs.secondaryButtonNewTab)), attrs.secondaryButtonText)
            )
          )
        )
      );
    },

    save: function (props) {
      var attrs = props.attributes;
      var blockProps = wp.blockEditor.useBlockProps.save({
        className: 'rw-palma-hero',
        style: {
          minHeight: attrs.sectionMinHeight + 'px',
          backgroundImage:
            'linear-gradient(rgba(22,17,33,' + attrs.overlayOpacity + '), rgba(22,17,33,' + (attrs.overlayOpacity + 0.15) + ')), url("' +
            attrs.backgroundImageUrl +
            '")',
          margin: spacingValue(attrs, 'section', 'Margin'),
          padding: spacingValue(attrs, 'section', 'Padding'),
          borderRadius: maybeStyle(attrs.sectionBorderRadius),
          textAlign: maybeStyle(attrs.sectionTextAlign),
          fontFamily: maybeStyle(attrs.sectionFontFamily)
        }
      });

      var contentStyle = {
        maxWidth: attrs.sectionContentMaxWidth + 'px',
        fontFamily: maybeStyle(attrs.sectionFontFamily)
      };

      var eyebrowStyle = {
        margin: spacingValue(attrs, 'eyebrow', 'Margin'),
        padding: spacingValue(attrs, 'eyebrow', 'Padding'),
        fontSize: attrs.eyebrowFontSize + 'px',
        color: maybeStyle(attrs.eyebrowColor),
        background: maybeStyle(attrs.eyebrowBackgroundColor)
      };

      var titleStyle = {
        fontSize: 'clamp(3rem, 8vw, ' + attrs.titleFontSize + 'px)',
        maxWidth: attrs.titleMaxWidth + 'px',
        color: maybeStyle(attrs.titleColor),
        fontFamily: maybeStyle(attrs.titleFontFamily),
        margin: spacingValue(attrs, 'title', 'Margin'),
        padding: spacingValue(attrs, 'title', 'Padding')
      };

      var descriptionStyle = {
        fontSize: attrs.descriptionFontSize + 'px',
        color: maybeStyle(attrs.descriptionColor),
        fontFamily: maybeStyle(attrs.descriptionFontFamily),
        margin: spacingValue(attrs, 'description', 'Margin'),
        padding: spacingValue(attrs, 'description', 'Padding')
      };

      var primaryButtonStyle = {
        backgroundColor: maybeStyle(attrs.primaryBgColor),
        color: maybeStyle(attrs.primaryTextColor),
        borderColor: maybeStyle(attrs.primaryBorderColor),
        fontSize: attrs.primaryFontSize + 'px',
        fontFamily: maybeStyle(attrs.primaryFontFamily),
        margin: spacingValue(attrs, 'primary', 'Margin'),
        padding: spacingValue(attrs, 'primary', 'Padding')
      };

      var secondaryButtonStyle = {
        backgroundColor: maybeStyle(attrs.secondaryBgColor),
        color: maybeStyle(attrs.secondaryTextColor),
        borderColor: maybeStyle(attrs.secondaryBorderColor),
        fontSize: attrs.secondaryFontSize + 'px',
        fontFamily: maybeStyle(attrs.secondaryFontFamily),
        margin: spacingValue(attrs, 'secondary', 'Margin'),
        padding: spacingValue(attrs, 'secondary', 'Padding')
      };

      return el(
        'section',
        blockProps,
        el('div', { className: 'rw-palma-hero__content', style: contentStyle },
          el(RichText.Content, {
            tagName: 'span',
            className: 'rw-palma-hero__eyebrow',
            style: eyebrowStyle,
            value: attrs.eyebrow
          }),
          el(RichText.Content, {
            tagName: 'h2',
            className: 'rw-palma-hero__title',
            style: titleStyle,
            value: attrs.heading
          }),
          el(RichText.Content, {
            tagName: 'p',
            className: 'rw-palma-hero__description',
            style: descriptionStyle,
            value: attrs.description
          }),
          el('div', { className: 'rw-palma-hero__actions', style: { marginTop: maybeStyle(attrs.actionsMarginTop) } },
            el('a', Object.assign({
              href: attrs.primaryButtonUrl || '#',
              className: 'rw-palma-hero__button rw-palma-hero__button--primary',
              style: primaryButtonStyle
            }, linkTargetAttrs(attrs.primaryButtonNewTab)), attrs.primaryButtonText),
            el('a', Object.assign({
              href: attrs.secondaryButtonUrl || '#',
              className: 'rw-palma-hero__button rw-palma-hero__button--secondary',
              style: secondaryButtonStyle
            }, linkTargetAttrs(attrs.secondaryButtonNewTab)), attrs.secondaryButtonText)
          )
        )
      );
    }
  });
})(window.wp.blocks, window.wp.blockEditor, window.wp.components, window.wp.element, window.wp.i18n);
