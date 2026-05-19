import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from 'styled-components/native';

import { AlbumsProvider } from './src/context/AlbumsContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { theme } from './src/theme/theme';

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider theme={theme}>
        <AlbumsProvider>
          <StatusBar style="dark" />
          <AppNavigator />
        </AlbumsProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
