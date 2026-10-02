import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Portal from './portal/Portal';

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f6f8fc' }}>
        <StatusBar style="dark" />
        <Portal />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
