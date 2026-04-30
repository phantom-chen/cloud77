import { FC } from "react";

interface AppBarProps {
    items: { label: string; href: string, color: string }[];
}

const AppBar: FC<AppBarProps> = ({ items }) => {

    return (
        <nav>
            <ul style={{ display: 'flex', listStyle: 'none', padding: 0, margin: 0, backgroundColor: '#333' }}>
                {items.map((item, index) => (
                    <li key={index} style={{ margin: '0 10px' }}>
                        <a href={item.href}
                            style={{ color: item.color, textDecoration: 'none', padding: '10px 20px', display: 'block' }}
                            onMouseEnter={(e) => e.currentTarget.style.color = 'yellow'}
                            onMouseLeave={(e) => e.currentTarget.style.color = item.color}
                        >{item.label}</a>
                    </li>
                ))}

            </ul>
        </nav>
    );
};

export default AppBar;