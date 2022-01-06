import { BtnLoadMore } from "./Button.styled";
import PropTypes from "prop-types";

export default function Button({ onClick }) {
  return (
    <BtnLoadMore type="button" onClick={onClick}>
      Load more ...
    </BtnLoadMore>
  );
}

Button.propTypes = {
  onClick: PropTypes.func,
};
