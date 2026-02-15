import { RichText, useBlockProps } from '@wordpress/block-editor';

export default function save({ attributes }) {
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

  const blockProps = useBlockProps.save({
    className: 'rw-hero',
    style: {
      minHeight: `${minHeight}px`,
      backgroundImage: backgroundImageUrl ? `url(${backgroundImageUrl})` : undefined,
    },
  });

  return (
    <section {...blockProps}>
      <div className="rw-hero__overlay" style={{ opacity: overlayOpacity }} />
      <div className="rw-hero__content">
        <RichText.Content tagName="p" className="rw-hero__eyebrow" value={eyebrow} />
        <RichText.Content tagName="h2" className="rw-hero__title" value={heading} />
        <RichText.Content tagName="p" className="rw-hero__description" value={description} />
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
  );
}
