import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState, useRef } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Animated } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold } from '@expo-google-fonts/nunito';
import { Ionicons, Feather } from '@expo/vector-icons';
import LandingPage from './screens/LandingPage';
import OnboardingScreen from './screens/OnboardingScreen';
import HomeScreen from './screens/HomeScreen';
import EventsScreen from './screens/EventsScreen';
import PastEventsScreen from './screens/PastEventsScreen';
import MarketplaceScreen from './screens/MarketplaceScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import CartScreen from './screens/CartScreen';
import ProductDetailScreen from './screens/ProductDetailScreen';
import CommunityScreen from './screens/CommunityScreen';
import CommunityConversationScreen from './screens/CommunityConversationScreen';
import ProfileScreen from './screens/ProfileScreen';
import ProfileInfoScreen from './screens/ProfileInfoScreen';
import SettingsScreen from './screens/SettingsScreen';
import BottomNavigation from './components/BottomNavigation';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

function AppContent() {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [showLanding, setShowLanding] = useState(false);
  const [currentTab, setCurrentTab] = useState('home');
  const [showPastEvents, setShowPastEvents] = useState(false);
  const [homeOverlay, setHomeOverlay] = useState(null); // null | 'notifications'
  const [shopOverlay, setShopOverlay] = useState(null); // null | 'notifications' | 'cart' | 'product'
  const [activeProduct, setActiveProduct] = useState(null);
  const [communityOverlay, setCommunityOverlay] = useState(null); // null | 'conversation'
  const [activeCommunity, setActiveCommunity] = useState(null);
  const [profileOverlay, setProfileOverlay] = useState(null); // null | 'info' | 'settings'
  const [joinedCommunityIds, setJoinedCommunityIds] = useState(() => new Set());
  const [postsByCommunity, setPostsByCommunity] = useState(() => ({
    'data-science-ai': [
      {
        id: 'ds-1',
        authorName: 'Aisha K.',
        meta: 'Moderator',
        text: 'Welcome! Share your current ML project and what you are learning.',
        createdAt: Date.now() - 1000 * 60 * 60 * 10,
      },
      {
        id: 'ds-2',
        authorName: 'Brian M.',
        meta: 'Member',
        text: 'Anyone working with TensorFlow Lite? I am trying to deploy on mobile.',
        createdAt: Date.now() - 1000 * 60 * 60 * 6,
      },
    ],
    'web-development': [
      {
        id: 'web-1',
        authorName: 'Njeri',
        meta: 'Member',
        text: 'Let’s build a portfolio challenge this weekend. Who is in?',
        createdAt: Date.now() - 1000 * 60 * 60 * 8,
      },
    ],
  }));
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

  const toggleJoinCommunity = (id) => {
    setJoinedCommunityIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const addCommunityPost = (communityId, text) => {
    const body = String(text || '').trim();
    if (!body) return;
    setPostsByCommunity((prev) => {
      const existing = Array.isArray(prev?.[communityId]) ? prev[communityId] : [];
      const nextPost = {
        id: `${communityId}-${Date.now()}`,
        authorName: 'You',
        meta: 'Member',
        text: body,
        createdAt: Date.now(),
      };
      return {
        ...(prev || {}),
        [communityId]: [nextPost, ...existing],
      };
    });
  };

  const postCountsByCommunity = Object.keys(postsByCommunity || {}).reduce((acc, key) => {
    const count = Array.isArray(postsByCommunity?.[key]) ? postsByCommunity[key].length : 0;
    acc[key] = count;
    return acc;
  }, {});

  const renderTab = () => {
    switch (currentTab) {
      case 'home':
        if (homeOverlay === 'notifications') {
          return <NotificationsScreen onBack={() => setHomeOverlay(null)} />;
        }
        return (
          <HomeScreen
            onOpenNotifications={() => setHomeOverlay('notifications')}
            onOpenProfile={() => {
              setHomeOverlay(null);
              setCurrentTab('profile');
            }}
          />
        );
      case 'events':
        return showPastEvents ? (
          <PastEventsScreen onBack={() => setShowPastEvents(false)} />
        ) : (
          <EventsScreen onOpenPastEvents={() => setShowPastEvents(true)} />
        );
      case 'shop':
        if (shopOverlay === 'notifications') {
          return (
            <NotificationsScreen
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
              onViewDetails={(product) => {
                setActiveProduct(product);
                setShopOverlay('product');
              }}
            />
          );
        }
        if (shopOverlay === 'product') {
          return (
            <ProductDetailScreen
              product={activeProduct}
              onBack={() => {
                setShopOverlay('cart');
                setActiveProduct(null);
              }}
              onCheckout={() => {
                setShopOverlay('cart');
                setActiveProduct(null);
              }}
              onUpdate={() => {
                setShopOverlay('cart');
                setActiveProduct(null);
              }}
            />
          );
        }
        return (
          <MarketplaceScreen
            likedIds={likedIds}
            cartIds={cartIds}
            onToggleLiked={toggleLiked}
            onToggleCart={toggleCart}
            onOpenCart={() => setShopOverlay('cart')}
          />
        );
      case 'community':
        if (communityOverlay === 'conversation' && activeCommunity?.id) {
          const communityId = activeCommunity.id;
          return (
            <CommunityConversationScreen
              community={activeCommunity}
              posts={postsByCommunity?.[communityId] || []}
              isJoined={joinedCommunityIds.has(communityId)}
              onJoin={() => toggleJoinCommunity(communityId)}
              onBack={() => {
                setCommunityOverlay(null);
                setActiveCommunity(null);
              }}
              onAddPost={(text) => addCommunityPost(communityId, text)}
            />
          );
        }
        return (
          <CommunityScreen
            joinedIds={joinedCommunityIds}
            onToggleJoin={toggleJoinCommunity}
            postCounts={postCountsByCommunity}
            onOpenCommunity={(community) => {
              setActiveCommunity(community);
              setCommunityOverlay('conversation');
            }}
          />
        );
      case 'profile':
        if (profileOverlay === 'info') {
          return <ProfileInfoScreen onBack={() => setProfileOverlay(null)} />;
        }
        if (profileOverlay === 'settings') {
          return <SettingsScreen onBack={() => setProfileOverlay(null)} />;
        }
        return (
          <ProfileScreen
            onOpenProfileInfo={() => setProfileOverlay('info')}
            onOpenSettings={() => setProfileOverlay('settings')}
            onLogout={() => {
              setCurrentTab('home');
              setShowLanding(false);
              setShowOnboarding(true);
              setShowPastEvents(false);
              setHomeOverlay(null);
              setShopOverlay(null);
              setActiveProduct(null);
              setCommunityOverlay(null);
              setActiveCommunity(null);
              setProfileOverlay(null);
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
        {!((
          currentTab === 'community' && communityOverlay === 'conversation'
        ) || (
          currentTab === 'home' && homeOverlay === 'notifications'
        ) || (
          currentTab === 'shop' && (shopOverlay === 'notifications' || shopOverlay === 'cart' || shopOverlay === 'product')
        ) || (
          currentTab === 'profile' && profileOverlay === 'info'
        ) || (
          currentTab === 'profile' && profileOverlay === 'settings'
        )) ? (
          <BottomNavigation currentTab={currentTab} onTabChange={setCurrentTab} />
        ) : null}
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
    ...Ionicons.font,
    ...Feather.font,
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
