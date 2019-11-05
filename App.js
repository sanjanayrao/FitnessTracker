import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Homescreen from './Homescreen';
import Profile from './Profile';

const AppNavigator = createStackNavigator({
  Home: { screen: Homescreen },
  Profile: {screen: Profile},
});

const AppContainer = createAppContainer(AppNavigator);

export default class App extends React.Component {
  render() {
    return (
      <AppContainer/>
    );
  }
}
