import { Tabs } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import { Redirect } from 'expo-router';

export default function TabsLayout() {
  const { user, loading } = useAuth();
  if (!loading && !user) return <Redirect href="/login" />;

  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarStyle: { backgroundColor: '#1a1208', borderTopColor: '#3d2e0e' },
      tabBarActiveTintColor: '#c9a84c',
      tabBarInactiveTintColor: '#4a3a2a',
      tabBarLabelStyle: { fontFamily: 'CrimsonPro_400Regular', fontSize: 10 },
    }}>
      <Tabs.Screen name="home" options={{ title: 'Hall' }} />
      <Tabs.Screen name="labs" options={{ title: 'Labs' }} />
      <Tabs.Screen name="quizzes" options={{ title: 'Quizzes' }} />
      <Tabs.Screen name="leaderboard" options={{ title: 'Rankings' }} />
    </Tabs>
  );
}
