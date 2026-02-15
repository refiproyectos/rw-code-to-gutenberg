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
  var ColorPalette = components.ColorPalette;

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
    function field(label, side) {
      var key = prefix + side;
      return el(TextControl, {
        label: label,
        value: attrs[key],
        type: 'number',
        onChange: function (value) {
          updateAttr(setAttributes, key, parseNumericInput(value, attrs[key] || 0));
        }
      });
    }

    return el(
      Fragment,
      null,
      el('p', { style: { margin: '16px 0 8px', fontWeight: 600 } }, __('Margin', domain)),
      field(__('Top', domain), 'MarginTop'),
      field(__('Right', domain), 'MarginRight'),
      field(__('Bottom', domain), 'MarginBottom'),
      field(__('Left', domain), 'MarginLeft'),
      el(SelectControl, {
        label: __('Margin unit', domain),
        value: attrs[prefix + 'MarginUnit'],
        options: SPACING_UNITS,
        onChange: function (value) {
          updateAttr(setAttributes, prefix + 'MarginUnit', value || 'px');
        }
      }),
      el('p', { style: { margin: '16px 0 8px', fontWeight: 600 } }, __('Padding', domain)),
      field(__('Top', domain), 'PaddingTop'),
      field(__('Right', domain), 'PaddingRight'),
      field(__('Bottom', domain), 'PaddingBottom'),
      field(__('Left', domain), 'PaddingLeft'),
      el(SelectControl, {
        label: __('Padding unit', domain),
        value: attrs[prefix + 'PaddingUnit'],
        options: SPACING_UNITS,
        onChange: function (value) {
          updateAttr(setAttributes, prefix + 'PaddingUnit', value || 'px');
        }
      })
    );
  }

  function maybeStyle(value) {
    return value ? value : undefined;
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
            { title: __('Section settings', domain), initialOpen: true },
            el(RangeControl, {
              label: __('Section min height (px)', domain),
              min: 420,
              max: 1000,
              value: attrs.sectionMinHeight,
              onChange: function (value) {
                setAttributes({ sectionMinHeight: value || 600 });
              }
            }),
            el(RangeControl, {
              label: __('Overlay opacity', domain),
              min: 0.1,
              max: 0.9,
              step: 0.05,
              value: attrs.overlayOpacity,
              onChange: function (value) {
                setAttributes({ overlayOpacity: typeof value === 'number' ? value : 0.52 });
              }
            }),
            el(RangeControl, {
              label: __('Content max width (px)', domain),
              min: 520,
              max: 1280,
              value: attrs.sectionContentMaxWidth,
              onChange: function (value) {
                setAttributes({ sectionContentMaxWidth: value || 980 });
              }
            }),
            el(SelectControl, {
              label: __('Text align', domain),
              value: attrs.sectionTextAlign,
              options: [
                { label: __('Center', domain), value: 'center' },
                { label: __('Left', domain), value: 'left' },
                { label: __('Right', domain), value: 'right' }
              ],
              onChange: function (value) {
                setAttributes({ sectionTextAlign: value || 'center' });
              }
            }),
            el(SelectControl, {
              label: __('Section font family', domain),
              value: attrs.sectionFontFamily,
              options: FONT_OPTIONS,
              onChange: function (value) {
                setAttributes({ sectionFontFamily: value || '"Manrope", sans-serif' });
              }
            }),
            spacingControls(attrs, setAttributes, 'section', domain),
            el(TextControl, {
              label: __('Section border radius', domain),
              value: attrs.sectionBorderRadius,
              help: __('Example: 1.8rem', domain),
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
                      ? __('Replace background image', domain)
                      : __('Select background image', domain)
                  );
                }
              })
            )
          ),

          el(
            PanelBody,
            { title: __('Eyebrow settings', domain), initialOpen: false },
            el(RangeControl, {
              label: __('Eyebrow font size (px)', domain),
              min: 10,
              max: 24,
              value: attrs.eyebrowFontSize,
              onChange: function (value) {
                setAttributes({ eyebrowFontSize: value || 12 });
              }
            }),
            el(BaseControl, { label: __('Eyebrow text color', domain) },
              el(ColorPalette, {
                value: attrs.eyebrowColor,
                onChange: function (value) {
                  setAttributes({ eyebrowColor: value || '#ffffff' });
                }
              })
            ),
            el(TextControl, {
              label: __('Eyebrow background color', domain),
              value: attrs.eyebrowBackgroundColor,
              onChange: function (value) {
                setAttributes({ eyebrowBackgroundColor: value || 'rgba(255,255,255,0.1)' });
              }
            }),
            spacingControls(attrs, setAttributes, 'eyebrow', domain)
          ),

          el(
            PanelBody,
            { title: __('Title settings', domain), initialOpen: false },
            el(RangeControl, {
              label: __('Title font size (px)', domain),
              min: 34,
              max: 96,
              value: attrs.titleFontSize,
              onChange: function (value) {
                setAttributes({ titleFontSize: value || 72 });
              }
            }),
            el(RangeControl, {
              label: __('Title max width (px)', domain),
              min: 420,
              max: 1280,
              value: attrs.titleMaxWidth,
              onChange: function (value) {
                setAttributes({ titleMaxWidth: value || 860 });
              }
            }),
            el(SelectControl, {
              label: __('Title font family', domain),
              value: attrs.titleFontFamily,
              options: FONT_OPTIONS,
              onChange: function (value) {
                setAttributes({ titleFontFamily: value || '"Manrope", sans-serif' });
              }
            }),
            el(BaseControl, { label: __('Title color', domain) },
              el(ColorPalette, {
                value: attrs.titleColor,
                onChange: function (value) {
                  setAttributes({ titleColor: value || '#ffffff' });
                }
              })
            ),
            spacingControls(attrs, setAttributes, 'title', domain)
          ),

          el(
            PanelBody,
            { title: __('Description settings', domain), initialOpen: false },
            el(RangeControl, {
              label: __('Description font size (px)', domain),
              min: 14,
              max: 36,
              value: attrs.descriptionFontSize,
              onChange: function (value) {
                setAttributes({ descriptionFontSize: value || 20 });
              }
            }),
            el(SelectControl, {
              label: __('Description font family', domain),
              value: attrs.descriptionFontFamily,
              options: FONT_OPTIONS,
              onChange: function (value) {
                setAttributes({ descriptionFontFamily: value || '"Manrope", sans-serif' });
              }
            }),
            el(TextControl, {
              label: __('Description color', domain),
              value: attrs.descriptionColor,
              onChange: function (value) {
                setAttributes({ descriptionColor: value || 'rgba(255,255,255,0.92)' });
              }
            }),
            spacingControls(attrs, setAttributes, 'description', domain)
          ),

          el(
            PanelBody,
            { title: __('Buttons wrapper settings', domain), initialOpen: false },
            el(TextControl, {
              label: __('Buttons wrapper margin-top', domain),
              value: attrs.actionsMarginTop,
              onChange: function (value) {
                setAttributes({ actionsMarginTop: value || '2.25rem' });
              }
            })
          ),

          el(
            PanelBody,
            { title: __('Primary button', domain), initialOpen: false },
            el(TextControl, {
              label: __('Text', domain),
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
              label: __('Open in new tab', domain),
              checked: !!attrs.primaryButtonNewTab,
              onChange: function (value) {
                setAttributes({ primaryButtonNewTab: !!value });
              }
            }),
            el(RangeControl, {
              label: __('Primary button font size (px)', domain),
              min: 12,
              max: 28,
              value: attrs.primaryFontSize,
              onChange: function (value) {
                setAttributes({ primaryFontSize: value || 17 });
              }
            }),
            el(SelectControl, {
              label: __('Primary button font family', domain),
              value: attrs.primaryFontFamily,
              options: FONT_OPTIONS,
              onChange: function (value) {
                setAttributes({ primaryFontFamily: value || '"Manrope", sans-serif' });
              }
            }),
            el(BaseControl, { label: __('Background color', domain) },
              el(ColorPalette, {
                value: attrs.primaryBgColor,
                onChange: function (value) {
                  setAttributes({ primaryBgColor: value || '#6e30e8' });
                }
              })
            ),
            el(BaseControl, { label: __('Text color', domain) },
              el(ColorPalette, {
                value: attrs.primaryTextColor,
                onChange: function (value) {
                  setAttributes({ primaryTextColor: value || '#ffffff' });
                }
              })
            ),
            el(TextControl, {
              label: __('Primary border color', domain),
              value: attrs.primaryBorderColor,
              onChange: function (value) {
                setAttributes({ primaryBorderColor: value || 'transparent' });
              }
            }),
            spacingControls(attrs, setAttributes, 'primary', domain)
          ),

          el(
            PanelBody,
            { title: __('Secondary button', domain), initialOpen: false },
            el(TextControl, {
              label: __('Text', domain),
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
              label: __('Open in new tab', domain),
              checked: !!attrs.secondaryButtonNewTab,
              onChange: function (value) {
                setAttributes({ secondaryButtonNewTab: !!value });
              }
            }),
            el(RangeControl, {
              label: __('Secondary button font size (px)', domain),
              min: 12,
              max: 28,
              value: attrs.secondaryFontSize,
              onChange: function (value) {
                setAttributes({ secondaryFontSize: value || 17 });
              }
            }),
            el(SelectControl, {
              label: __('Secondary button font family', domain),
              value: attrs.secondaryFontFamily,
              options: FONT_OPTIONS,
              onChange: function (value) {
                setAttributes({ secondaryFontFamily: value || '"Manrope", sans-serif' });
              }
            }),
            el(TextControl, {
              label: __('Border color', domain),
              value: attrs.secondaryBorderColor,
              onChange: function (value) {
                setAttributes({ secondaryBorderColor: value || 'rgba(255,255,255,0.35)' });
              }
            }),
            el(BaseControl, { label: __('Text color', domain) },
              el(ColorPalette, {
                value: attrs.secondaryTextColor,
                onChange: function (value) {
                  setAttributes({ secondaryTextColor: value || '#ffffff' });
                }
              })
            ),
            el(TextControl, {
              label: __('Secondary background color', domain),
              value: attrs.secondaryBgColor,
              onChange: function (value) {
                setAttributes({ secondaryBgColor: value || 'rgba(255,255,255,0.1)' });
              }
            }),
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
              placeholder: __('Eyebrow text', domain)
            }),
            el(RichText, {
              tagName: 'h2',
              className: 'rw-palma-hero__title',
              style: titleStyle,
              value: attrs.heading,
              onChange: function (value) {
                setAttributes({ heading: value });
              },
              placeholder: __('Hero title', domain)
            }),
            el(RichText, {
              tagName: 'p',
              className: 'rw-palma-hero__description',
              style: descriptionStyle,
              value: attrs.description,
              onChange: function (value) {
                setAttributes({ description: value });
              },
              placeholder: __('Hero description', domain)
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
