import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState, useRef } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Animated } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold } from '@expo-google-fonts/nunito';
import LandingPage from './screens/LandingPage';
import OnboardingScreen from './screens/OnboardingScreen';
import HomeScreen from './screens/HomeScreen';
import EventsScreen from './screens/EventsScreen';
import PastEventsScreen from './screens/PastEventsScreen';
import MarketplaceScreen from './screens/MarketplaceScreen';
import LikedItemsScreen from './screens/LikedItemsScreen';
import CartScreen from './screens/CartScreen';
import CommunityScreen from './screens/CommunityScreen';
import ProfileScreen from './screens/ProfileScreen';
import BottomNavigation from './components/BottomNavigation';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// Main App Content Component with bottom tabs
function AppContent() {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [showLanding, setShowLanding] = useState(false);
  const [currentTab, setCurrentTab] = useState('home');
  const [showPastEvents, setShowPastEvents] = useState(false);
  const [shopOverlay, setShopOverlay] = useState(null); // null | 'liked' | 'cart'
  const [likedIds, setLikedIds] = useState(() => new Set());
  const [cartIds, setCartIds] = useState(() => new Set());
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const toggleLiked = (id) => {
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleCart = (id) => {
    setCartIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const renderTab = () => {
    switch (currentTab) {
      case 'home':
        return <HomeScreen />;
      case 'events':
        return showPastEvents ? (
          <PastEventsScreen onBack={() => setShowPastEvents(false)} />
        ) : (
          <EventsScreen onOpenPastEvents={() => setShowPastEvents(true)} />
        );
      case 'shop':
        if (shopOverlay === 'liked') {
          return (
            <LikedItemsScreen
              likedIds={likedIds}
              cartIds={cartIds}
              onToggleLiked={toggleLiked}
              onToggleCart={toggleCart}
              onBack={() => setShopOverlay(null)}
            />
          );
        }
        if (shopOverlay === 'cart') {
          return (
            <CartScreen
              likedIds={likedIds}
              cartIds={cartIds}
              onToggleLiked={toggleLiked}
              onToggleCart={toggleCart}
              onBack={() => setShopOverlay(null)}
            />
          );
        }
        return (
          <MarketplaceScreen
            likedIds={likedIds}
            cartIds={cartIds}
            onToggleLiked={toggleLiked}
            onToggleCart={toggleCart}
            onOpenLiked={() => setShopOverlay('liked')}
            onOpenCart={() => setShopOverlay('cart')}
          />
        );
      case 'community':
        return <CommunityScreen />;
      case 'profile':
        return (
          <ProfileScreen
            onLogout={() => {
              setCurrentTab('home');
              setShowLanding(false);
              setShowOnboarding(true);
              setShowPastEvents(false);
              setShopOverlay(null);
            }}
          />
        );
      default:
        return <HomeScreen />;
    }
  };

  useEffect(() => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }, [currentTab, fadeAnim]);

  if (showOnboarding) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <OnboardingScreen
            onDone={() => {
              setShowOnboarding(false);
              setShowLanding(true);
            }}
          />
          <StatusBar style="dark" />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    );
  }

  if (showLanding) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <LandingPage
            onContinue={() => {
              setShowLanding(false);
              setCurrentTab('home');
            }}
          />
          <StatusBar style="dark" />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Animated.View style={{ flex: 1, opacity: fadeAnim, backgroundColor: '#FFFFFF' }} key={currentTab}>
          {renderTab()}
        </Animated.View>
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
