//import 'react-native-gesture-handler'
import { useEffect } from 'react'
import { StyleSheet, Image, View, Text, Linking } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import HomeBuyer from './src/screens/HomeBuyer';
import HomeSeller from './src/screens/HomeSeller';
import Register from './src/screens/Register';
import ProfileScreen from './src/screens/Profile';
import MyGigs from './src/screens/MyGigs';
import GigDetail from './src/screens/GigDetail';
import Login from './src/screens/Login';
import Settings from './src/screens/Settings';
import AddGig from './src/screens/AddGig';
import UserType from './src/screens/UserType';
import EditProfile from './src/screens/EditProfile';
import ChangePassword from './src/screens/ChangePassword';
import OrderReview from './src/screens/orderReview';
import Orders from './src/screens/Orders';
import AddPosts from './src/screens/AddPosts';
import OrderDetail from './src/screens/OrderDetail'
import AddPayment from './src/screens/AddPayment';
import ChatRoom from './src/screens/ChatRoom';
import VerifyAccount from './src/screens/VerifyAccount';
import ResetPassword from './src/screens/ResetPassword';
import PostDetail from './src/screens/PostDetail';
import Terms from './src/screens/Terms';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector, useDispatch } from 'react-redux';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem
} from '@react-navigation/drawer';
import { StripeProvider } from '@stripe/stripe-react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/state/store'
import SplashScreen from 'react-native-splash-screen'
import { setUserInfo } from './src/state/actions/userActions';
import Icon from 'react-native-vector-icons/MaterialIcons'
import messaging from '@react-native-firebase/messaging';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const MainStack = () => {
  const { user } = useSelector(state => state.user)
  const { token } = user;

  const checkRegister = async () => {
    if (!messaging().isDeviceRegisteredForRemoteMessages) {
      console.log("registered", messaging().isDeviceRegisteredForRemoteMessages)
      await messaging().registerDeviceForRemoteMessages();
    }
  }

  useEffect(() => {
    checkRegister()
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.data,
      );
      Linking.openURL(remoteMessage.data.type)
    });
  })

  return (
    <Stack.Navigator initialRouteName={token ? "Buy Coins" : "Login"}>
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Register"
        component={Register}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Reset Password"
        component={ResetPassword}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UserType"
        component={UserType}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Home"
        component={AppDrawer}
        options={{ headerShown: false }}
      />
      <Drawer.Screen
        name="Detail"
        component={GigDetail}
        options={{
          title: 'Detail',
          headerStyle: { backgroundColor: '#50C878' },
          headerTintColor: "white",
          headerTitleAlign: 'center'
        }}
      />
      <Stack.Screen
        name="Order Detail"
        component={OrderDetail}
        options={{
          title: 'Task Detail',
          headerStyle: { backgroundColor: '#50C878' },
          headerTintColor: "white",
          headerTitleAlign: 'center'
        }}
      />
      <Stack.Screen
        name="Add Post"
        component={AddPosts}
        options={{
          title: "Add Task",
          headerStyle: { backgroundColor: '#50C878' },
          headerTintColor: "white",
          headerTitleAlign: 'center'
        }}
      />
      <Stack.Screen
        name="Terms"
        component={Terms}
        options={{
          title: "Terms and Conditions",
          headerStyle: { backgroundColor: '#50C878' },
          headerTintColor: "white",
          headerTitleAlign: 'center'
        }}
      />
      <Stack.Screen
        name="Verify Account"
        component={VerifyAccount}
        options={{
          headerStyle: { backgroundColor: '#50C878' },
          headerTintColor: "white",
          headerTitleAlign: 'center'
        }}
      />
      <Stack.Screen
        name="Chat Room"
        component={ChatRoom}
        options={{
          headerStyle: { backgroundColor: '#50C878' },
          headerTintColor: "white",
          headerTitleAlign: 'center'
        }}
      />
      <Stack.Screen
        name="Buy Coins"
        component={AddPayment}
        options={{
          headerTitle: "Add Credit",
          headerStyle: { backgroundColor: '#50C878' },
          headerTintColor: "white",
          headerTitleAlign: 'center'
        }}
      />
      <Stack.Screen
        name="Post Detail"
        component={PostDetail}
        options={{
          title: "Task Detail",
          headerStyle: { backgroundColor: '#50C878' },
          headerTintColor: "white",
          headerTitleAlign: 'center'
        }}
      />
      <Drawer.Screen
        name="Order Review"
        component={OrderReview}
        options={{
          headerStyle: { backgroundColor: '#50C878' },
          headerTintColor: "white",
          headerTitleAlign: 'center'
        }}
      />
      <Drawer.Screen
        name="New Gig"
        component={AddGig}
        options={{
          title: 'New Package',
          headerStyle: { backgroundColor: '#50C878' },
          headerTintColor: "white",
          headerTitleAlign: 'center'
        }}
      />
      <Drawer.Screen
        name="Edit Profile"
        component={EditProfile}
        options={{
          headerStyle: { backgroundColor: '#50C878' },
          headerTintColor: "white",
          headerTitleAlign: 'center'
        }}
      />
      <Drawer.Screen
        name="Change Password"
        component={ChangePassword}
        options={{
          headerStyle: { backgroundColor: '#50C878' },
          headerTintColor: "white",
          headerTitleAlign: 'center'
        }}
      />
    </Stack.Navigator>
  );
};

function CustomDrawerContent(props) {
  const dispatch = useDispatch()
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 0, backgroundColor: 'white' }}>
      <View >
        <Image source={require('./src/assets/logo.jpeg')}
          style={{ width: '100%', height: 130, marginVertical: 40, resizeMode: 'cover', alignSelf: 'center', flex: 1 }} />
        {/* <Text style={{ color: 'white', fontSize: 30, alignSelf: 'center', marginBottom: 20 }}>Opinion Tracker</Text> */}
      </View>
      {/* <View style={{ height: 30, borderTopEndRadius: 20, borderTopColor: '#90EE90', borderTopWidth: 1, borderTopStartRadius: 20, overflow: 'hidden', flex: 1, backgroundColor: 'white' }} /> */}
      <DrawerItemList {...props} />
      <DrawerItem
        style={{
          paddingVertical: 14, marginLeft: 0, width: '100%', marginTop: 2, backgroundColor: '#50C878', marginBottom: 0, borderRadius: 0
        }}
        labelStyle={{ color: 'white', fontSize: 17, fontWeight: 'bold' }}
        label="Logout"
        icon={() => <Icon name='logout' size={24} color="white" />}
        onPress={() => {
          dispatch(setUserInfo({}))
          props.navigation.replace('Login');
        }}
      />

    </DrawerContentScrollView>
  );
}

const AppDrawer = () => {
  const { user } = useSelector(state => state.user)

  return (<Drawer.Navigator drawerContent={props => <CustomDrawerContent {...props} />}
    screenOptions={{
      drawerStyle: { marginTop: 0, backgroundColor: '#50C878' },
      drawerLabelStyle: { color: 'white', fontSize: 17, fontWeight: 'bold' },
      drawerItemStyle: {
        backgroundColor: '#50C878',
        padding: 5,
        width: '100%',
        borderRadius: 0,
        marginLeft: 0,
        marginTop: 2,
        marginBottom: 0,
        //borderBottomColor: 'black',
        //borderBottomWidth: 1,
        paddingVertical: 14,
        paddingHorizontal: 0
      }
    }}>
    <Drawer.Screen
      name="Home Drawer"
      component={user.isSeller ? HomeSeller : HomeBuyer}
      options={{
        title: 'Home',
        drawerIcon: () => <Icon name='home' size={24} color="white" />,
        headerStyle: { backgroundColor: '#50C878' },
        headerTintColor: "white"
      }}
    />
    <Drawer.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        title: 'Profile',
        drawerIcon: () => <Icon name='person' size={24} color="white" />,
        headerStyle: { backgroundColor: '#50C878' },
        headerTintColor: "white"
      }}
    />
    <Drawer.Screen
      name="Orders"
      component={Orders}
      options={{
        title: 'Tasks',
        drawerIcon: () => <Icon name='all-inbox' size={24} color="white" />,
        headerStyle: { backgroundColor: '#50C878' },
        headerTintColor: "white"
      }}
    />
    {/* {user.isSeller && <Drawer.Screen
      name="My Gigs"
      component={MyGigs}
      options={{
        title: 'Packages',
        drawerIcon: () => <Icon2 name='dollar-sign' size={24} color="black" />,
        headerStyle: { backgroundColor: '#50C878' },
        headerTintColor: "white"
      }}
    />} */}
    {/* <Drawer.Screen
      name="Settings"
      component={Settings}
      options={{
        title: 'Settings',
        drawerIcon: () => <Icon name='settings' size={24} color="white" />,
        headerStyle: { backgroundColor: '#50C878' },
        headerTintColor: "white"
      }}
    /> */}
    {/* <Drawer.Screen name="Verified Orders" component={VerifiedOrders} /> */}
  </Drawer.Navigator>)
};

export default function App() {
  useEffect(() => {
    SplashScreen.hide();

  }, [])
  return (
    <StripeProvider
      publishableKey="pk_test_51KrzWmLEJCPE187BH8zHoK2eLvAwYfeSQIJB4iji9VqBsDs0qBYuPfTfTjZ6jaYXgm1E8HaLGZNyh9nUEvgN1Jtv00HXIjVdzg"
    >
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <NavigationContainer>
            <SafeAreaProvider>
              <SafeAreaView style={styles.container}>
                <MainStack />
              </SafeAreaView>
            </SafeAreaProvider>
          </NavigationContainer>
        </PersistGate>
      </Provider>
    </StripeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
