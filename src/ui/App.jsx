import { Route, Routes } from 'react-router-dom';
import { Layout } from './Layout.jsx';
import { HomePage } from './pages/HomePage.jsx';
import { GroupsPage } from './pages/GroupsPage.jsx';
import { ChannelsPage } from './pages/ChannelsPage.jsx';

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/index.html" element={<HomePage />} />
        <Route path="/groups" element={<GroupsPage />} />
        <Route path="/groups.html" element={<GroupsPage />} />
        <Route path="/channels" element={<ChannelsPage />} />
        <Route path="/channels.html" element={<ChannelsPage />} />
      </Route>
    </Routes>
  );
}
