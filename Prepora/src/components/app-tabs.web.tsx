import { Tabs, TabSlot } from 'expo-router/ui';

export default function AppTabs() {
  return (
    <Tabs style={{ flex: 1, height: '100%' }}>
      <TabSlot style={{ flex: 1, height: '100%' }} />
    </Tabs>
  );
}

