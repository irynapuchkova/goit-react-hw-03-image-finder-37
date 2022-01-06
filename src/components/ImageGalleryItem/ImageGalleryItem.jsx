import PropTypes from "prop-types";

import { GalleryItem, Image } from "./ImageGalleryItem.styled";

export default function ImageGalleryItem({ src, tags, onClick }) {
  return (
    <GalleryItem>
      <Image src={src} alt={tags} onClick={onClick} />
    </GalleryItem>
  );
}

ImageGalleryItem.propTypes = {
  src: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};
