import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import {NavigationContainer, useIsFocused} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import LoginScreen from './Screens/LoginScreen';
import {useSelector} from 'react-redux';
import HomeScreen from './Screens/HomeScreen';
import AddProductScreen from './Screens/AddProductScreen';
import UpdateProductScreen from './Screens/UpdateProductScreen';

// import Ionicons from 'react-native-vector-icons/Ionicons';

const App = () => {
  const [isLogin, setIsLogin] = useState(false);

  const loginControl = useSelector(state => state.products.isLogin);

  function GetHomeScreen() {
    return <HomeScreen />;
  }

  function GetAddProductScreen() {
    return <AddProductScreen />;
  }

  const GetUpdateProductScreen = () => {
    return <UpdateProductScreen />;
  };

  const Tab = createBottomTabNavigator();

  useEffect(() => {
    console.log('CONTROL: ', loginControl);
    setIsLogin(loginControl);
  }, [loginControl]);

  useEffect(() => {}, []);

  return (
    <NavigationContainer>
      {isLogin === true ? (
        <Tab.Navigator
          screenOptions={({route}) => ({
            tabBarIcon: ({focused, size, color}) => {
              console.log('FOCUS: ', route.name);
              let iconName;
              if (route.name === 'home') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'addProducts') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'updateProducts') {
                iconName = focused ? 'home' : 'home-outline';
              }
              // return <Ionicons name={iconName} size={size} color={color} />;
            },
          })}>
          <Tab.Screen
            name="home"
            r
            options={{
              unmountOnBlur: true,
              tabBarLabel: 'Ana Sayfa',
            }}
            component={GetHomeScreen}
          />
          <Tab.Screen
            name="addProducts"
            options={{unmountOnBlur: true}}
            component={GetAddProductScreen}
          />
          <Tab.Screen
            name="updateProducts"
            options={{unmountOnBlur: true}}
            component={GetUpdateProductScreen}
          />
        </Tab.Navigator>
      ) : (
        <LoginScreen />
      )}
    </NavigationContainer>
  );
};

export default App;
