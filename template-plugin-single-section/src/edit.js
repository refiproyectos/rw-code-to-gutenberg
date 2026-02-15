import { __ } from '@wordpress/i18n';
import {
  InspectorControls,
  RichText,
  URLInputButton,
  MediaUpload,
  MediaUploadCheck,
  useBlockProps,
} from '@wordpress/block-editor';
import {
  Button,
  PanelBody,
  RangeControl,
  TextControl,
} from '@wordpress/components';

export default function Edit({ attributes, setAttributes }) {
  const {
    eyebrow,
    heading,
    description,
    primaryButtonText,
    primaryButtonUrl,
    secondaryButtonText,
    secondaryButtonUrl,
    backgroundImageUrl,
    overlayOpacity,
    minHeight,
  } = attributes;

  const blockProps = useBlockProps({
    className: 'rw-hero',
    style: {
      minHeight: `${minHeight}px`,
      backgroundImage: backgroundImageUrl ? `url(${backgroundImageUrl})` : undefined,
    },
  });

  return (
    <>
      <InspectorControls>
        <PanelBody title={__('Section settings', 'rw-example-home-hero')} initialOpen>
          <RangeControl
            label={__('Min height', 'rw-example-home-hero')}
            min={320}
            max={900}
            value={minHeight}
            onChange={(value) => setAttributes({ minHeight: value })}
          />
          <RangeControl
            label={__('Overlay opacity', 'rw-example-home-hero')}
            min={0}
            max={0.9}
            step={0.05}
            value={overlayOpacity}
            onChange={(value) => setAttributes({ overlayOpacity: value })}
          />
          <MediaUploadCheck>
            <MediaUpload
              onSelect={(media) =>
                setAttributes({ backgroundImageUrl: media?.url || '' })
              }
              allowedTypes={['image']}
              render={({ open }) => (
                <Button variant="secondary" onClick={open}>
                  {backgroundImageUrl
                    ? __('Replace background image', 'rw-example-home-hero')
                    : __('Select background image', 'rw-example-home-hero')}
                </Button>
              )}
            />
          </MediaUploadCheck>
        </PanelBody>

        <PanelBody title={__('Primary button', 'rw-example-home-hero')} initialOpen={false}>
          <TextControl
            label={__('Button text', 'rw-example-home-hero')}
            value={primaryButtonText}
            onChange={(value) => setAttributes({ primaryButtonText: value })}
          />
          <URLInputButton
            url={primaryButtonUrl}
            onChange={(value) => setAttributes({ primaryButtonUrl: value })}
          />
        </PanelBody>

        <PanelBody title={__('Secondary button', 'rw-example-home-hero')} initialOpen={false}>
          <TextControl
            label={__('Button text', 'rw-example-home-hero')}
            value={secondaryButtonText}
            onChange={(value) => setAttributes({ secondaryButtonText: value })}
          />
          <URLInputButton
            url={secondaryButtonUrl}
            onChange={(value) => setAttributes({ secondaryButtonUrl: value })}
          />
        </PanelBody>
      </InspectorControls>

      <section {...blockProps}>
        <div className="rw-hero__overlay" style={{ opacity: overlayOpacity }} />
        <div className="rw-hero__content">
          <RichText
            tagName="p"
            className="rw-hero__eyebrow"
            value={eyebrow}
            onChange={(value) => setAttributes({ eyebrow: value })}
            placeholder={__('Eyebrow', 'rw-example-home-hero')}
          />
          <RichText
            tagName="h2"
            className="rw-hero__title"
            value={heading}
            onChange={(value) => setAttributes({ heading: value })}
            placeholder={__('Title', 'rw-example-home-hero')}
          />
          <RichText
            tagName="p"
            className="rw-hero__description"
            value={description}
            onChange={(value) => setAttributes({ description: value })}
            placeholder={__('Description', 'rw-example-home-hero')}
          />
          <div className="rw-hero__actions">
            <a href={primaryButtonUrl || '#'} className="rw-hero__button rw-hero__button--primary">
              {primaryButtonText}
            </a>
            <a href={secondaryButtonUrl || '#'} className="rw-hero__button rw-hero__button--secondary">
              {secondaryButtonText}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
