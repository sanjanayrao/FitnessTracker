import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Homescreen from './Homescreen';
import Profile from './Profile';
import Settings from './Settings';
import Activities from './Activities';
import Meals from './Meals';
import AddMeal from './AddMeal';
import AddFoods from './AddFoods';
import WeekView from './WeekView';
import EditFoods from './EditFoods';
import EditMeal from './EditMeal';


 export const TabNav = createBottomTabNavigator({
  Profile:  Profile ,
  Activities: Activities,
  Meals : Meals,
  Week: WeekView,
  Settings : Settings,
  },{
    initialRouteName: 'Profile'
  },{
    order: ['Profile', 'Activities', 'Meals', 'Week', 'Settings']
  }
  
);


export const AppNavigator = createStackNavigator({
  Home: {screen: Homescreen},
  Settings : {screen: Settings},
  Meals : {screen: Meals},
  AddMeal : {screen: AddMeal},
  AddFoods : {screen: AddFoods},
  EditMeal: {screen: EditMeal},
  EditFoods: {screen: EditFoods},
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
