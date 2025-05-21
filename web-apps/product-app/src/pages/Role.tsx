import { BooleanInput, Create, Datagrid, DeleteButton, Edit, EditButton, List, SelectInput, SimpleForm, TextField, TextInput } from "react-admin";

export function RoleList(props: any) {
    return (
        <List {...props}>
            <Datagrid rowClick='edit'>
                <TextField source="id" />
                <TextField source="name" />
            </Datagrid>
        </List>
    )
}


export function RoleEdit(props: any) {
    return (
        <Edit>
            <SimpleForm>
                <div>
                    <TextInput source="id"/>
                    <TextInput source="name"/>
                    <SelectInput source="domain" choices={[
                        { id: 'all', name: "all", description: "all domains" },
                        { id: 'domain1', name: "domain1" }
                    ]}/>
                    <BooleanInput source="price" label="enable price"/>
                    <EditButton />
                    <DeleteButton />
                </div>
            </SimpleForm>
        </Edit>
    )
}

export function RoleCreate(props: any) {
    return (
        <Create>
            <SimpleForm>
                <TextInput source="id" />
                <TextInput source="name" multiline rows={5} />
            </SimpleForm>
        </Create>
    )
}