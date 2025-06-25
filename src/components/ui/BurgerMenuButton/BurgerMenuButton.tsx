import React from "react";
import "./BurgerMenuButton.scss";

type Props = {
  onClick: () => void;
  isOpen: boolean;
};

export const BurgerMenuButton: React.FC<Props> = ({ onClick, isOpen }) => (
  <button
    className={`burger-menu-btn${isOpen ? " open" : ""}`}
    onClick={onClick}
    aria-label="Открыть меню"
    type="button"
  >
    <span />
    <span />
    <span />
  </button>
); 