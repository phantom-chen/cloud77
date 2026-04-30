import { useState, type FC } from "react";
import './ListView.css';

export interface ListItem {
	name: string;
	id: string;
}

interface ListViewProps {
	items: ListItem[];
	onItemSelected: (item: ListItem) => void;
}

const ListView: FC<ListViewProps> = ({ items, onItemSelected }) => {

  const [searchInput, setSearchInput] = useState<string>("");
  const [selectedItem, setSelectedItem] = useState<{ name: string, id: string } | null>(null);

  return (
    <>
      <div className="list-items-search-controls">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search..."
        />
        <button type="button" className="list-items-search-button">Search</button>
      </div>

      <div className="list-items-container">
        {items.map((item, index) => {
          return <button key={index} className="list-item-button" onClick={() => {
            setSelectedItem(item);
            onItemSelected(item);
          }}>{item.name}</button>;
        })}
      </div>

      {selectedItem ? (
        <div className="list-item-selected-details">
          <div><strong>Selected Item:</strong> {selectedItem.name}</div>
          <div><strong>Item ID:</strong> {selectedItem.id}</div>
        </div>
      ) : null}
    </>
  );
};

export default ListView;
