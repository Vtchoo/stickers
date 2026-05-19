import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AlbumDashboardScreen } from '../screens/AlbumDashboardScreen';
import { AlbumPagesScreen } from '../screens/AlbumPagesScreen';
import { AlbumTemplatesScreen } from '../screens/AlbumTemplatesScreen';
import { DuplicatesScreen } from '../screens/DuplicatesScreen';
import { MyAlbumsScreen } from '../screens/MyAlbumsScreen';
import { RegisterStickerScreen } from '../screens/RegisterStickerScreen';
import { StickerListScreen } from '../screens/StickerListScreen';
import { theme } from '../theme/theme';

export type RootStackParamList = {
  AlbumTemplates: undefined;
  MyAlbums: undefined;
  AlbumDashboard: { albumId: string };
  StickerList: { albumId: string };
  AlbumPages: { albumId: string };
  RegisterSticker: { albumId: string; initialSlotId?: string };
  Duplicates: { albumId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator
      initialRouteName="AlbumTemplates"
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.surface },
        headerShadowVisible: false,
        headerTintColor: theme.colors.text,
        headerTitleStyle: { fontWeight: '800' },
        contentStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <Stack.Screen
        name="AlbumTemplates"
        component={AlbumTemplatesScreen}
        options={{ title: 'Sticker Album Manager' }}
      />
      <Stack.Screen name="MyAlbums" component={MyAlbumsScreen} options={{ title: 'My Albums' }} />
      <Stack.Screen
        name="AlbumDashboard"
        component={AlbumDashboardScreen}
        options={{ title: 'Album Dashboard' }}
      />
      <Stack.Screen name="StickerList" component={StickerListScreen} options={{ title: 'Sticker List' }} />
      <Stack.Screen name="AlbumPages" component={AlbumPagesScreen} options={{ title: 'Album View' }} />
      <Stack.Screen
        name="RegisterSticker"
        component={RegisterStickerScreen}
        options={{ title: 'Register Stickers' }}
      />
      <Stack.Screen name="Duplicates" component={DuplicatesScreen} options={{ title: 'Trade List' }} />
    </Stack.Navigator>
  </NavigationContainer>
);