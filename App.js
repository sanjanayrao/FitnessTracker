import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Homescreen from './Homescreen';
import Profile from './Profile';
import Settings from './Settings';
import Activities from './Activities';
import Meals from './Meals';



 export const TabNav = createBottomTabNavigator({
  Profile:  Profile ,
  Activities: Activities,
  Meals : Meals,
  Settings : Settings
  },{
    initialRouteName: 'Profile'
  },{
    order: ['Profile', 'Activities', 'Meals', 'Settings']
  }
  
);


export const AppNavigator = createStackNavigator({
  Home: {screen: Homescreen},
  Settings : {screen: Settings},
  TabNavigator: TabNav
},{
  headerMode: "none"
});


  const AppContainer = createAppContainer(AppNavigator);

export default class App extends React.Component {
  render() {
    return (
      <AppContainer/> 
    );
  }
}
