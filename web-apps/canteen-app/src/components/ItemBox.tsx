import type { ChangeEvent, FC } from "react";
import './ItemBox.css';

export interface ItemBoxProps {
  name: string;
  label: string;
  action: { label: string; onClick: () => void };
  settings: { [key: string]: string };
}

const ItemBox: FC<ItemBoxProps> = ({ name, label, action, settings }) => {

  return (
    <div className="item-box-container">
      <div className="item-box-header">
        <div className="item-box-label">{label}</div>
        <div className="item-box-name">{name}</div>
        <button type="button" className="item-box-action-button" onClick={action.onClick}>
          {action.label}
        </button>
      </div>
      {
        settings && Object.keys(settings).map((settingKey, settingIndex) => (
          <div key={settingIndex} className="item-box-setting-row">
            <label className="item-box-setting-label">{settingKey}</label>
            <input
              type="text"
              className="item-box-setting-input"
              value={settings[settingKey]}
              placeholder={`${settingKey} value...`}
              onChange={(event_: ChangeEvent<HTMLInputElement>) => console.log(event_.target.value)}
            />
          </div>
        ))
      }
    </div>
  )
};

export default ItemBox;
