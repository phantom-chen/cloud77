import { Op, Sequelize, DataTypes } from "sequelize";

let entities: any;

export function createEntities(storage: string): any {
    const sequelize = new Sequelize({
        dialect: 'sqlite',
        storage
    })
    
    entities = sequelize.define('BookmarkEntity', {
        Id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        Guid: { type: DataTypes.TEXT, allowNull: false },
        Title: { type: DataTypes.TEXT, allowNull: false },
        Href: { type: DataTypes.TEXT, allowNull: false },
        Tags: { type: DataTypes.TEXT, allowNull: false },
        Collection: { type: DataTypes.TEXT, allowNull: false },
        Description: { type: DataTypes.TEXT, allowNull: false },
        CreatedAt: { type: DataTypes.DATE, allowNull: false },
        Timestamp: { type: DataTypes.DATE, allowNull: false }
    }, {
        tableName: 'bookmarks',
        modelName: 'BookmarkEntity',
        createdAt: 'CreatedAt',
        updatedAt: 'Timestamp'
    });
}

export async function count(): Promise<number> {
    return await entities.count();
}