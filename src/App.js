import { Admin, Resource, CustomRoutes, ListGuesser } from 'react-admin';

import dataProvider from './dataProvider';

export const App = () => {
  return (
    <Admin
      dataProvider={dataProvider}
    >
      <Resource name="leads" list={ListGuesser} />
    </Admin>
  )
}