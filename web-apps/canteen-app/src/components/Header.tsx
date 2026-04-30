import type { FC } from "react";
import './Header.css';

interface HeaderProps {
  title: string;
  actions: { label: string; onClick: () => void }[];
}

const Header: FC<HeaderProps> = (props: HeaderProps) => {

  const { title, actions } = props;

  return (
    <div className="app-header">
      <div className="app-header-title">{title}</div>
      <div className="app-header-actions">
        {
          actions.map((action, index) => (
            <button
              key={index}
              type="button"
              className="app-header-action-button"
              onClick={action.onClick}
            >
              {action.label}
            </button>
          ))
        }
      </div>
    </div>
  );

};

export default Header;
