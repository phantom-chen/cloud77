import { Datagrid, List, TextField, ReferenceField, DeleteButton, Edit, EditButton, ReferenceInput, SelectInput, SimpleForm, TextInput } from "react-admin";

export function UserList(props: any) {
    return (
        <List {...props}>
            <Datagrid rowClick='edit'>
                <TextField source="id" />
                <TextField source="name" />
                <ReferenceField source="role" reference="roles">
                    <TextField source="name" />
                </ReferenceField>
            </Datagrid>
        </List>
    )
}

export function UserEdit(props: any) {
    return (
        <Edit>
            <SimpleForm>
                <div>
                    <TextInput source="id"/>
                    <TextInput source="name"/>
                    <ReferenceInput label="Role" source="role" reference="roles">
                        <SelectInput optionText="name" />
                    </ReferenceInput>
                    <EditButton />
                    <DeleteButton />
                </div>
            </SimpleForm>
        </Edit>
    )
}
