import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold } from '@expo-google-fonts/nunito';
import LandingPage from './screens/LandingPage';
import UploadScreen from './screens/UploadScreen';
import MatchesScreen from './screens/MatchesScreen';
import ClosetScreen from './screens/ClosetScreen';
import ProfileScreen from './screens/ProfileScreen';
import BottomNavigation from './components/BottomNavigation';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// Main App Content Component with bottom tabs
function AppContent() {
  const [showLanding, setShowLanding] = useState(true);
  const [currentTab, setCurrentTab] = useState('upload');

  if (showLanding) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <LandingPage onContinue={() => setShowLanding(false)} />
          <StatusBar style="dark" />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    );
  }

  const renderTab = () => {
    switch (currentTab) {
      case 'upload':
        return <UploadScreen />;
      case 'matches':
        return <MatchesScreen />;
      case 'closet':
        return <ClosetScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <UploadScreen />;
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        {renderTab()}
        <BottomNavigation currentTab={currentTab} onTabChange={setCurrentTab} />
        <StatusBar style="dark" />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

// Main App Component with Auth Provider
export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  let [fontsLoaded_fonts] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded_fonts) {
      setFontsLoaded(true);
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded_fonts]);

  if (!fontsLoaded) {
    return null; // Keep splash screen visible
  }

  return <AppContent />;
}
