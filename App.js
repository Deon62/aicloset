import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useRef, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Alert, Platform, View, BackHandler, Animated, Dimensions, Easing } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold } from '@expo-google-fonts/nunito';
import { Ionicons, Feather } from '@expo/vector-icons';
import NetInfo from '@react-native-community/netinfo';
import { supabase } from './lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LandingPage from './screens/LandingPage';
import OnboardingScreen from './screens/OnboardingScreen';
import HomeScreen from './screens/HomeScreen';
import CardsScreen from './screens/CardsScreen';
import JobsScreen from './screens/JobsScreen';
import ResourcesScreen from './screens/ResourcesScreen';
import ProjectsScreen from './screens/ProjectsScreen';
import StartupsScreen from './screens/StartupsScreen';
import EventsScreen from './screens/EventsScreen';
import PastEventsScreen from './screens/PastEventsScreen';
import EventDetailsScreen from './screens/EventDetailsScreen';
import MarketplaceScreen from './screens/MarketplaceScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import CartScreen from './screens/CartScreen';
import ProductDetailScreen from './screens/ProductDetailScreen';
import PaymentScreen from './screens/PaymentScreen';
import OrdersScreen from './screens/OrdersScreen';
import CommunityScreen from './screens/CommunityScreen';
import CommunityConversationScreen from './screens/CommunityConversationScreen';
import ProfileScreen from './screens/ProfileScreen';
import ProfileInfoScreen from './screens/ProfileInfoScreen';
import SettingsScreen from './screens/SettingsScreen';
import HelpScreen from './screens/HelpScreen';
import PrivacyScreen from './screens/PrivacyScreen';
import AboutScreen from './screens/AboutScreen';
import AccountSettingsScreen from './screens/AccountSettingsScreen';
import NotificationSettingsScreen from './screens/NotificationSettingsScreen';
import StreakScreen from './screens/StreakScreen';
import FeedbackScreen from './screens/FeedbackScreen';
import PaymentsScreen from './screens/PaymentsScreen';
import SignUpScreen from './screens/SignUpScreen';
import LoginScreen from './screens/LoginScreen';
import OfflineScreen from './screens/OfflineScreen';
import BottomNavigation from './components/BottomNavigation';

const DEFAULT_AVATAR = 'https://jfsyjlekhfyymunvsvcs.supabase.co/storage/v1/object/public/avatars/female.jpg';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

let ExpoCalendar = null;
try {
  ExpoCalendar = require('expo-calendar');
} catch (e) {
  ExpoCalendar = null;
}

function AppContent() {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [showLanding, setShowLanding] = useState(false);
  const [authScreen, setAuthScreen] = useState(null); // null | 'signup' | 'login'
  const [authBooting, setAuthBooting] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const [profileVersion, setProfileVersion] = useState(0);
  const [profileLoading, setProfileLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [currentTab, setCurrentTab] = useState('home');
  const [showPastEvents, setShowPastEvents] = useState(false);
  const [activeEvent, setActiveEvent] = useState(null);
  const [homeOverlay, setHomeOverlay] = useState(null); // null | 'notifications' | 'cards' | 'jobs' | 'resources' | 'projects' | 'startups'
  const [homeOverlayMounted, setHomeOverlayMounted] = useState(null);
  const homeOverlayAnim = useRef(new Animated.Value(0)).current;
  const homeOverlayClosingRef = useRef(false);
  const [shopOverlay, setShopOverlay] = useState(null); // null | 'notifications' | 'cart' | 'product'
  const [activeProduct, setActiveProduct] = useState(null);
  const [communityOverlay, setCommunityOverlay] = useState(null); // null | 'conversation'
  const [activeCommunity, setActiveCommunity] = useState(null);
  const [postsLoading, setPostsLoading] = useState(false);
  const [loadedCommunityIds, setLoadedCommunityIds] = useState(() => new Set());
  const [profileOverlay, setProfileOverlay] = useState(null); // null | 'info' | 'settings' | 'feedback' | 'payments'
  const [joinedCommunityIds, setJoinedCommunityIds] = useState(() => new Set());
  const [postsByCommunity, setPostsByCommunity] = useState(() => ({}));
  const [likedIds, setLikedIds] = useState(() => new Set());
  const [cartIds, setCartIds] = useState(() => new Set());

  useEffect(() => {
    let mounted = true;
    const computeOffline = (state) => {
      const isConnected = state?.isConnected;
      const reachable = state?.isInternetReachable;
      return isConnected === false || reachable === false;
    };

    NetInfo.fetch().then((state) => {
      if (!mounted) return;
      setIsOffline(computeOffline(state));
    });

    const unsub = NetInfo.addEventListener((state) => {
      if (!mounted) return;
      setIsOffline(computeOffline(state));
    });

    return () => {
      mounted = false;
      unsub?.();
    };
  }, []);

  const openHomeOverlay = useCallback(
    (key) => {
      homeOverlayClosingRef.current = false;
      setHomeOverlay(key);
      setHomeOverlayMounted(key);
      homeOverlayAnim.setValue(0);
      Animated.timing(homeOverlayAnim, {
        toValue: 1,
        duration: 240,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    },
    [homeOverlayAnim]
  );

  const closeHomeOverlay = useCallback(() => {
    if (!homeOverlayMounted) {
      setHomeOverlay(null);
      setHomeOverlayMounted(null);
      return;
    }
    if (homeOverlayClosingRef.current) return;
    homeOverlayClosingRef.current = true;
    Animated.timing(homeOverlayAnim, {
      toValue: 0,
      duration: 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(({ finished }) => {
      homeOverlayClosingRef.current = false;
      if (!finished) return;
      setHomeOverlay(null);
      setHomeOverlayMounted(null);
    });
  }, [homeOverlayAnim, homeOverlayMounted]);

  useEffect(() => {
    let mounted = true;

    const boot = async () => {
      try {
        setAuthBooting(true);
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.warn('Failed to load session', error);
        }
        const session = data?.session;
        if (!mounted) return;
        setAuthScreen(session ? null : 'login');
        setUserId(session?.user?.id || null);
      } catch (e) {
        console.warn('Failed to load auth session', e);
        if (!mounted) return;
        setAuthScreen('login');
        setUserId(null);
      } finally {
        if (mounted) setAuthBooting(false);
      }
    };

    boot();

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;
      setAuthScreen(session ? null : 'login');
      setUserId(session?.user?.id || null);
      // reset cached membership/posts on any auth change
      setJoinedCommunityIds(new Set());
      setPostsByCommunity({});
      setLoadedCommunityIds(new Set());
      await clearProfileCache();
      if (session?.user?.id) {
        setProfileLoading(true);
        await Promise.all([
          loadMemberships(session.user.id),
          refreshProfileCache(session.user.id),
          syncStreakCache(session.user.id),
        ]);
        setProfileLoading(false);
      } else {
        setProfileLoading(false);
      }
    });

    return () => {
      mounted = false;
      sub?.subscription?.unsubscribe?.();
    };
  }, []);

  const addToCalendar = async (event) => {
    try {
      if (!ExpoCalendar) {
        Alert.alert('Add to calendar', 'Calendar module is not installed. Run: npx expo install expo-calendar');
        return;
      }

      const startDate = event?.startAt ? new Date(event.startAt) : new Date(Date.now() + 60 * 60 * 1000);
      const endDate = event?.endAt ? new Date(event.endAt) : new Date(startDate.getTime() + 90 * 60 * 1000);

      const notesParts = [];
      if (event?.venueHint) notesParts.push(event.venueHint);
      if (Array.isArray(event?.requirements) && event.requirements.length > 0) {
        notesParts.push(`Requirements: ${event.requirements.join(', ')}`);
      }

      const result = await ExpoCalendar.createEventInCalendarAsync(
        {
          title: event?.title || 'EUCOSSA Event',
          startDate,
          endDate,
          location: event?.location || 'Egerton University',
          notes: notesParts.join('\n'),
          timeZone: undefined,
        },
        {}
      );

      if (result?.action === 'saved') {
        Alert.alert('Calendar', 'Event saved.');
        setActiveEvent(null);
      }
    } catch (e) {
      Alert.alert('Add to calendar', 'Failed to add event to calendar.');
      console.warn('Failed to add to calendar', e);
    }
  };

  const togglePostVote = async (communityId, postId, value) => {
    if (!userId) {
      Alert.alert('Vote', 'Please login to vote.');
      setShowOnboarding(false);
      setShowLanding(false);
      setAuthScreen('login');
      setCurrentTab('home');
      return;
    }

    setPostsByCommunity((prev) => {
      const existing = Array.isArray(prev?.[communityId]) ? prev[communityId] : [];
      const updated = existing.map((post) => {
        if (post.id !== postId) return post;
        const nextVote = post.userVote === value ? 0 : value;
        const nextScore = (post.voteScore || 0) - (post.userVote || 0) + nextVote;
        return { ...post, userVote: nextVote, voteScore: nextScore };
      });
      return { ...(prev || {}), [communityId]: updated };
    });

    const { data, error } = await supabase
      .from('post_votes')
      .select('value')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .maybeSingle();

    const currentVote = Number(data?.value) || 0;
    const nextVote = currentVote === value ? 0 : value;

    if (nextVote === 0) {
      await supabase.from('post_votes').delete().eq('post_id', postId).eq('user_id', userId);
    } else {
      await supabase
        .from('post_votes')
        .upsert({ post_id: postId, user_id: userId, value: nextVote }, { onConflict: 'post_id,user_id' });
    }

    await refreshProfileCache(userId);
  };

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

  const loadMemberships = async (uid) => {
    if (!uid) return;
    try {
      const { data, error } = await supabase.from('community_members').select('community_id').eq('user_id', uid);
      if (error) {
        console.warn('Load memberships error', error);
        return;
      }
      const next = new Set((data || []).map((row) => row.community_id));
      setJoinedCommunityIds(next);
    } catch (e) {
      console.warn('Load memberships failed', e);
    }
  };

  const clearProfileCache = async () => {
    try {
      await AsyncStorage.multiRemove([
        '@profile_github',
        '@profile_name',
        '@profile_course',
        '@profile_year',
        '@profile_bio',
        '@profile_photo_uri',
        '@profile_points',
        '@profile_streak',
      ]);
    } catch (e) {
      console.warn('Clear profile cache failed', e);
    }
  };

  const refreshStreakCache = async (uid) => {
    if (!uid) return;
    try {
      const { data, error } = await supabase
        .from('user_streaks')
        .select('streak_count')
        .eq('user_id', uid)
        .maybeSingle();
      if (error) return;
      const count = typeof data?.streak_count === 'number' ? data.streak_count : 0;
      await AsyncStorage.setItem('@profile_streak', String(count));
      setProfileVersion((v) => v + 1);
    } catch (e) {
      console.warn('Refresh streak cache failed', e);
    }
  };

  const syncStreakCache = async (uid) => {
    if (!uid) return;
    try {
      await supabase.rpc('touch_user_streak');
    } catch (e) {
      console.warn('Touch streak failed', e);
    }
    await refreshStreakCache(uid);
  };

  const refreshProfileCache = async (uid) => {
    if (!uid) return;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('github_username,name,course,year,avatar_url,points')
        .eq('id', uid)
        .single();
      if (error) return;
      await AsyncStorage.multiSet([
        ['@profile_github', String(data?.github_username || '').trim()],
        ['@profile_name', String(data?.name || '').trim()],
        ['@profile_course', String(data?.course || '').trim()],
        ['@profile_year', String(data?.year || '').trim()],
        ['@profile_bio', ''],
        ['@profile_photo_uri', String(data?.avatar_url || '').trim()],
        ['@profile_points', String(typeof data?.points === 'number' ? data.points : 0)],
      ]);
      setProfileVersion((v) => v + 1);
    } catch (e) {
      console.warn('Refresh profile cache failed', e);
    }
  };

  const fetchCommunityPosts = async (communityId) => {
    if (!communityId) return;
    try {
      setPostsLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('id, body, created_at, parent_post_id, author:profiles!posts_author_id_fkey(name, github_username, avatar_url)')
        .eq('community_id', communityId)
        .order('created_at', { ascending: false });
      if (error) {
        console.warn('Fetch posts error', error);
        return;
      }
      let votesMap = {};
      const postIds = (data || []).map((row) => row.id).filter(Boolean);
      if (postIds.length > 0) {
        const { data: voteRows, error: voteError } = await supabase
          .from('post_votes')
          .select('post_id, value, user_id')
          .in('post_id', postIds);
        if (voteError) {
          console.warn('Fetch post votes error', voteError);
        } else {
          votesMap = (voteRows || []).reduce((acc, row) => {
            const pid = row.post_id;
            if (!pid) return acc;
            if (!acc[pid]) acc[pid] = { score: 0, userVote: 0 };
            const val = Number(row.value) === -1 ? -1 : 1;
            acc[pid].score += val;
            if (row.user_id === userId) acc[pid].userVote = val;
            return acc;
          }, {});
        }
      }

      // fetch parent posts for quotes
      const parentIds = (data || []).map((row) => row.parent_post_id).filter(Boolean);
      let parentMap = {};
      if (parentIds.length > 0) {
        const { data: parentRows, error: parentError } = await supabase
          .from('posts')
          .select('id, body, author:profiles!posts_author_id_fkey(name, github_username)')
          .in('id', parentIds);
        if (parentError) {
          console.warn('Fetch parent posts error', parentError);
        } else {
          parentMap = (parentRows || []).reduce((acc, row) => {
            acc[row.id] = {
              id: row.id,
              text: row.body,
              authorName: row.author?.name || 'Member',
              authorGithub: row.author?.github_username || '',
            };
            return acc;
          }, {});
        }
      }

      const mapped = (data || []).map((row) => {
        const vote = votesMap[row.id] || { score: 0, userVote: 0 };
        return {
          id: row.id,
          text: row.body,
          createdAt: new Date(row.created_at).getTime(),
          authorName: row.author?.name || 'Member',
          authorGithub: row.author?.github_username || '',
          authorAvatar: row.author?.avatar_url || DEFAULT_AVATAR,
          voteScore: vote.score,
          userVote: vote.userVote,
          quote: row.parent_post_id ? parentMap[row.parent_post_id] || null : null,
        };
      });
      setPostsByCommunity((prev) => ({ ...(prev || {}), [communityId]: mapped }));
      setLoadedCommunityIds((prev) => {
        const next = new Set(prev);
        next.add(communityId);
        return next;
      });
    } catch (e) {
      console.warn('Fetch posts failed', e);
    } finally {
      setPostsLoading(false);
    }
  };

  const toggleJoinCommunity = async (id) => {
    if (!userId) {
      Alert.alert('Join community', 'Please login to join communities.');
      setShowOnboarding(false);
      setShowLanding(false);
      setAuthScreen('login');
      setCurrentTab('home');
      return;
    }
    const wasJoined = joinedCommunityIds.has(id);
    setJoinedCommunityIds((prev) => {
      const next = new Set(prev);
      if (wasJoined) next.delete(id);
      else next.add(id);
      return next;
    });
    try {
      if (wasJoined) {
        const { error } = await supabase.from('community_members').delete().eq('community_id', id).eq('user_id', userId);
        if (error) console.warn('Leave community error', error);
      } else {
        const { error } = await supabase.from('community_members').upsert({ community_id: id, user_id: userId });
        if (error) console.warn('Join community error', error);
      }
      await refreshProfileCache(userId);
    } catch (e) {
      console.warn('Toggle join failed', e);
    }
  };

  const addCommunityPost = async (communityId, text, parentPostId = null) => {
    const body = String(text || '').trim();
    if (!body) return;
    if (!userId) {
      Alert.alert('Add post', 'Please login to post.');
      return;
    }
    try {
      const { data, error } = await supabase
        .from('posts')
        .insert({ community_id: communityId, body, author_id: userId, parent_post_id: parentPostId || null })
        .select('id, body, created_at, parent_post_id, author:profiles!posts_author_id_fkey(name, github_username, avatar_url)')
        .single();
      if (error) {
        console.warn('Add post error', error);
        Alert.alert('Post', 'Failed to add post. Try again.');
        return;
      }
      const newPost = {
        id: data.id,
        text: data.body,
        createdAt: new Date(data.created_at).getTime(),
        authorName: data.author?.name || 'Member',
        authorGithub: data.author?.github_username || '',
        authorAvatar: data.author?.avatar_url || DEFAULT_AVATAR,
        voteScore: 0,
        userVote: 0,
        quote: null,
      };
      if (data.parent_post_id) {
        const { data: parentRow } = await supabase
          .from('posts')
          .select('id, body, author:profiles!posts_author_id_fkey(name, github_username)')
          .eq('id', data.parent_post_id)
          .maybeSingle();
        if (parentRow) {
          newPost.quote = {
            id: parentRow.id,
            text: parentRow.body,
            authorName: parentRow.author?.name || 'Member',
            authorGithub: parentRow.author?.github_username || '',
          };
        }
      }
      setPostsByCommunity((prev) => {
        const existing = Array.isArray(prev?.[communityId]) ? prev[communityId] : [];
        return { ...(prev || {}), [communityId]: [newPost, ...existing] };
      });
      await refreshProfileCache(userId);
    } catch (e) {
      console.warn('Add post failed', e);
      Alert.alert('Post', 'Failed to add post. Try again.');
    }
  };

  const postCountsByCommunity = Object.keys(postsByCommunity || {}).reduce((acc, key) => {
    const count = Array.isArray(postsByCommunity?.[key]) ? postsByCommunity[key].length : 0;
    acc[key] = count;
    return acc;
  }, {});

  useEffect(() => {
    if (communityOverlay === 'conversation' && activeCommunity?.id) {
      fetchCommunityPosts(activeCommunity.id);
    }
  }, [communityOverlay, activeCommunity?.id]);

  useEffect(() => {
    const onBackPress = () => {
      if (showLanding || showOnboarding || authScreen) return false;

      if (shopOverlay === 'product') {
        setShopOverlay('cart');
        setActiveProduct(null);
        return true;
      }
      if (shopOverlay === 'payment') {
        setShopOverlay('cart');
        return true;
      }
      if (shopOverlay === 'orders') {
        setShopOverlay(null);
        return true;
      }
      if (shopOverlay === 'cart' || shopOverlay === 'notifications') {
        setShopOverlay(null);
        return true;
      }

      if (communityOverlay === 'conversation') {
        setCommunityOverlay(null);
        setActiveCommunity(null);
        return true;
      }

      if (homeOverlayMounted) {
        closeHomeOverlay();
        return true;
      }

      if (activeEvent?.id) {
        setActiveEvent(null);
        return true;
      }
      if (showPastEvents) {
        setShowPastEvents(false);
        return true;
      }

      if (profileOverlay === 'help' || profileOverlay === 'privacy' || profileOverlay === 'about' || profileOverlay === 'accountSettings' || profileOverlay === 'notificationSettings') {
        setProfileOverlay('settings');
        return true;
      }
      if (profileOverlay) {
        setProfileOverlay(null);
        return true;
      }

      if (currentTab !== 'home') {
        setCurrentTab('home');
        return true;
      }

      return false;
    };

    const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => sub.remove();
  }, [
    activeEvent?.id,
    authScreen,
    communityOverlay,
    currentTab,
    homeOverlayMounted,
    closeHomeOverlay,
    profileOverlay,
    shopOverlay,
    showLanding,
    showOnboarding,
    showPastEvents,
  ]);

  const renderHomeBase = () => {
    return (
      <HomeScreen
        loading={profileLoading}
        onOpenNotifications={() => openHomeOverlay('notifications')}
        onOpenCards={() => openHomeOverlay('cards')}
        onOpenJobs={() => openHomeOverlay('jobs')}
        onOpenResources={() => openHomeOverlay('resources')}
        onOpenProjects={() => openHomeOverlay('projects')}
        onOpenStartups={() => openHomeOverlay('startups')}
        onRefresh={async () => {
          await refreshProfileCache(userId);
        }}
        profileVersion={profileVersion}
        onOpenProfile={() => {
          setCurrentTab('profile');
        }}
      />
    );
  };

  const renderHomeOverlay = () => {
    if (!homeOverlayMounted) return null;
    if (homeOverlayMounted === 'notifications') {
      return <NotificationsScreen onBack={closeHomeOverlay} />;
    }
    if (homeOverlayMounted === 'cards') {
      return <CardsScreen onBack={closeHomeOverlay} />;
    }
    if (homeOverlayMounted === 'jobs') {
      return <JobsScreen onBack={closeHomeOverlay} />;
    }
    if (homeOverlayMounted === 'resources') {
      return <ResourcesScreen onBack={closeHomeOverlay} />;
    }
    if (homeOverlayMounted === 'projects') {
      return <ProjectsScreen onBack={closeHomeOverlay} />;
    }
    if (homeOverlayMounted === 'startups') {
      return <StartupsScreen onBack={closeHomeOverlay} />;
    }
    return null;
  };

  const renderEventsStack = () => {
    if (showPastEvents) {
      return <PastEventsScreen onBack={() => setShowPastEvents(false)} />;
    }
    if (activeEvent?.id) {
      return (
        <EventDetailsScreen
          event={activeEvent}
          onBack={() => setActiveEvent(null)}
          onRegister={() => setActiveEvent(null)}
          onAddToCalendar={addToCalendar}
        />
      );
    }
    return <EventsScreen onOpenPastEvents={() => setShowPastEvents(true)} onOpenEvent={(event) => setActiveEvent(event)} />;
  };

  const renderShopStack = () => {
    if (shopOverlay === 'notifications') {
      return <NotificationsScreen onBack={() => setShopOverlay(null)} />;
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
          onMakeOrder={() => setShopOverlay('payment')}
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
            setShopOverlay('payment');
            setActiveProduct(null);
          }}
          onUpdate={() => {
            setShopOverlay('cart');
            setActiveProduct(null);
          }}
        />
      );
    }
    if (shopOverlay === 'payment') {
      return (
        <PaymentScreen
          onBack={() => setShopOverlay('cart')}
          onPaid={() => setShopOverlay('orders')}
        />
      );
    }
    if (shopOverlay === 'orders') {
      return <OrdersScreen onBack={() => setShopOverlay(null)} />;
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
  };

  const renderCommunityStack = () => {
    if (communityOverlay === 'conversation' && activeCommunity?.id) {
      const communityId = activeCommunity.id;
      return (
        <CommunityConversationScreen
          community={activeCommunity}
          posts={postsByCommunity?.[communityId] || []}
          loading={postsLoading || !loadedCommunityIds.has(communityId)}
          isJoined={joinedCommunityIds.has(communityId)}
          onVote={(postId, value) => togglePostVote(communityId, postId, value)}
          onRefresh={() => fetchCommunityPosts(communityId)}
          onJoin={() => toggleJoinCommunity(communityId)}
          onBack={() => {
            setCommunityOverlay(null);
            setActiveCommunity(null);
          }}
          onAddPost={(text, parentId) => addCommunityPost(communityId, text, parentId)}
        />
      );
    }

    return (
      <CommunityScreen
        joinedIds={joinedCommunityIds}
        onToggleJoin={toggleJoinCommunity}
        postCounts={postCountsByCommunity}
        onOpenCommunity={(community) => {
          setPostsLoading(true);
          setActiveCommunity(community);
          setCommunityOverlay('conversation');
        }}
      />
    );
  };

  const renderProfileStack = () => {
    if (profileOverlay === 'info') {
      return <ProfileInfoScreen onBack={() => setProfileOverlay(null)} onSaved={() => setProfileVersion((v) => v + 1)} />;
    }
    if (profileOverlay === 'settings') {
      return (
        <SettingsScreen
          onBack={() => setProfileOverlay(null)}
          onOpenHelp={() => setProfileOverlay('help')}
          onOpenPrivacy={() => setProfileOverlay('privacy')}
          onOpenAbout={() => setProfileOverlay('about')}
          onOpenAccount={() => setProfileOverlay('accountSettings')}
          onOpenNotifications={() => setProfileOverlay('notificationSettings')}
        />
      );
    }
    if (profileOverlay === 'help') {
      return <HelpScreen onBack={() => setProfileOverlay('settings')} />;
    }
    if (profileOverlay === 'privacy') {
      return <PrivacyScreen onBack={() => setProfileOverlay('settings')} />;
    }
    if (profileOverlay === 'about') {
      return <AboutScreen onBack={() => setProfileOverlay('settings')} />;
    }
    if (profileOverlay === 'accountSettings') {
      return <AccountSettingsScreen onBack={() => setProfileOverlay('settings')} />;
    }
    if (profileOverlay === 'notificationSettings') {
      return <NotificationSettingsScreen onBack={() => setProfileOverlay('settings')} />;
    }
    if (profileOverlay === 'streak') {
      return <StreakScreen onBack={() => setProfileOverlay(null)} />;
    }
    if (profileOverlay === 'feedback') {
      return <FeedbackScreen onBack={() => setProfileOverlay(null)} />;
    }
    if (profileOverlay === 'payments') {
      return <PaymentsScreen onBack={() => setProfileOverlay(null)} />;
    }
    return (
      <ProfileScreen
        onOpenProfileInfo={() => setProfileOverlay('info')}
        onOpenSettings={() => setProfileOverlay('settings')}
        onOpenFeedback={() => setProfileOverlay('feedback')}
        onOpenPayments={() => setProfileOverlay('payments')}
        onOpenStreak={() => setProfileOverlay('streak')}
        profileVersion={profileVersion}
        onProfileUpdated={() => {
          refreshProfileCache(userId);
          setPostsByCommunity({});
        }}
        onLogout={() => {
          setCurrentTab('home');
          setShowLanding(false);
          setShowOnboarding(false);
          setShowPastEvents(false);
          setActiveEvent(null);
          setHomeOverlay(null);
          setHomeOverlayMounted(null);
          homeOverlayAnim.setValue(0);
          setShopOverlay(null);
          setActiveProduct(null);
          setCommunityOverlay(null);
          setActiveCommunity(null);
          setProfileOverlay(null);
          supabase.auth.signOut();
        }}
      />
    );
  };

  if (isOffline) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <OfflineScreen
            onRetry={async () => {
              const state = await NetInfo.fetch();
              const isConnected = state?.isConnected;
              const reachable = state?.isInternetReachable;
              setIsOffline(isConnected === false || reachable === false);
            }}
          />
          <StatusBar style="dark" />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    );
  }

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
            onContinue={async () => {
              setShowLanding(false);
              setAuthScreen('login');
            }}
          />
          <StatusBar style="dark" />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    );
  }

  if (authBooting) {
    return null;
  }

  if (authScreen === 'signup') {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <SignUpScreen
            onNeedLogin={() => setAuthScreen('login')}
            onDone={() => {
              setAuthScreen(null);
              setCurrentTab('home');
            }}
          />
          <StatusBar style="dark" />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    );
  }

  if (authScreen === 'login') {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <LoginScreen
            onNeedSignUp={() => setAuthScreen('signup')}
            onDone={() => {
              setAuthScreen(null);
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
        <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
          <View style={[styles.scene, currentTab === 'home' ? styles.sceneActive : styles.sceneHidden]} pointerEvents={currentTab === 'home' ? 'auto' : 'none'}>
            <View style={{ flex: 1 }} pointerEvents={homeOverlayMounted ? 'none' : 'auto'}>
              {renderHomeBase()}
            </View>
            {homeOverlayMounted ? (
              <Animated.View
                pointerEvents="auto"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: '#FFFFFF',
                  transform: [
                    {
                      translateX: homeOverlayAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [Dimensions.get('window').width, 0],
                      }),
                    },
                  ],
                }}
              >
                {renderHomeOverlay()}
              </Animated.View>
            ) : null}
          </View>
          <View style={[styles.scene, currentTab === 'events' ? styles.sceneActive : styles.sceneHidden]} pointerEvents={currentTab === 'events' ? 'auto' : 'none'}>
            {renderEventsStack()}
          </View>
          <View style={[styles.scene, currentTab === 'shop' ? styles.sceneActive : styles.sceneHidden]} pointerEvents={currentTab === 'shop' ? 'auto' : 'none'}>
            {renderShopStack()}
          </View>
          <View style={[styles.scene, currentTab === 'community' ? styles.sceneActive : styles.sceneHidden]} pointerEvents={currentTab === 'community' ? 'auto' : 'none'}>
            {renderCommunityStack()}
          </View>
          <View style={[styles.scene, currentTab === 'profile' ? styles.sceneActive : styles.sceneHidden]} pointerEvents={currentTab === 'profile' ? 'auto' : 'none'}>
            {renderProfileStack()}
          </View>
        </View>
        {!((
          currentTab === 'community' && communityOverlay === 'conversation'
        ) || (
          currentTab === 'home' && homeOverlayMounted
        ) || (
          currentTab === 'events' && showPastEvents
        ) || (
          currentTab === 'events' && activeEvent?.id
        ) || (
          currentTab === 'shop' && (shopOverlay === 'notifications' || shopOverlay === 'cart' || shopOverlay === 'product')
        ) || (
          currentTab === 'shop' && (shopOverlay === 'payment' || shopOverlay === 'orders')
        ) || (
          currentTab === 'profile' && profileOverlay === 'info'
        ) || (
          currentTab === 'profile' && profileOverlay === 'settings'
        ) || (
          currentTab === 'profile' && profileOverlay === 'help'
        ) || (
          currentTab === 'profile' && profileOverlay === 'privacy'
        ) || (
          currentTab === 'profile' && profileOverlay === 'about'
        ) || (
          currentTab === 'profile' && profileOverlay === 'accountSettings'
        ) || (
          currentTab === 'profile' && profileOverlay === 'notificationSettings'
        ) || (
          currentTab === 'profile' && profileOverlay === 'streak'
        ) || (
          currentTab === 'profile' && profileOverlay === 'feedback'
        ) || (
          currentTab === 'profile' && profileOverlay === 'payments'
        )) ? (
          <BottomNavigation currentTab={currentTab} onTabChange={setCurrentTab} />
        ) : null}
        <StatusBar style="dark" />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = {
  scene: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  sceneActive: {
    opacity: 1,
  },
  sceneHidden: {
    opacity: 0,
  },
};

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
