import { Admin, CustomRoutes, Resource } from "react-admin";
import { RoleList, RoleEdit, RoleCreate } from "./Role";
import { dataProvider } from "../provider";
import { UserList, UserEdit } from "./User";
import { Dashboard } from "./Dashboard";
import { Route } from "react-router-dom";
import { Settings } from "./Settings";

export function Tester() {

    return (
        <Admin
            title="dashboard"
            dashboard={Dashboard}
            dataProvider={dataProvider}>
            <Resource name="users" list={UserList} edit={UserEdit}/>
            <Resource name="roles" list={RoleList} edit={RoleEdit} create={RoleCreate}/>
            <CustomRoutes>
                <Route path="/settings" element={<Settings />} />
            </CustomRoutes>
        </Admin>
    )
}