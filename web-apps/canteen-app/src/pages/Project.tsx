import Header from '../components/Header';
import ListView from '../components/ListView';
import ItemBox from '../components/ItemBox';
import '../components/style.css';

const Project: React.FC = () => {
    return (
        <>
            <Header title='Project' actions={[
                { label: 'Action 1', onClick: () => { console.log('Action 1 is triggered') } }
            ]} />

            <div className="panels-container">

                <div className="left-panel">
                    <ListView items={[
                        { name: 'first item', id: 'first-item' }
                    ]}
                        onItemSelected={item => { console.log(item) }}

                    />

                </div>

                <div className="right-panel">
                    <div className="list-item-selected-details">
                        <div><strong>Selected Item:</strong> xxx</div>
                        <div><strong>Item ID:</strong> xxx</div>
                    </div>

                    <div className="group-container">
                        <div className="group-header">Group 1</div>
                        <div className="item-box-grid">
                            <ItemBox
                                name='Item_1'
                                label='Item 1'
                                action={{ label: 'Action 1', onClick: () => { console.log('Action 1 is triggered') } }}
                                settings={{
                                    'setting1': 'setting 1'
                                }}
                            />
                        </div>

                    </div>
                </div>

            </div>
        </>

    );
};

export default Project;