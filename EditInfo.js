import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  Dimensions,
  TouchableWithoutFeedback
} from 'react-native';
import Button from './Button';

export default class EditInfo extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
          firstName:undefined,
          lastName: undefined,
          goalDailyCalories: undefined,
          goalDailyProtein: undefined,
          goalDailyCarbohydrates: undefined,
          goalDailyFat: undefined,
          goalDailyActivity: undefined,
          token: '',
          username: ''
        }
      }
     async updateAll(){
       this.setState({username: this.props.user, token: this.props.token}, ()=>{this.updateDB()});
     }
     async updateDB(){
        let data = await fetch('https://mysqlcs639.cs.wisc.edu/users/' + this.state.username, {
          method: 'PUT',
          headers: {
            'Accept' : 'application/json',
            'Content-Type' : 'application/json',
            'x-access-token' : this.state.token
          },
          body: JSON.stringify({
            'firstName' : this.state.firstName,
            'lastName' : this.state.lastName,
            'goalDailyActivity' : this.state.goalDailyActivity,
            'goalDailyCalories' : this.state.goalDailyCalories,
            'goalDailyCarbohydrates' : this.state.goalDailyCarbohydrates,
            'goalDailyProtein' : this.state.goalDailyProtein,
            'goalDailyFat' : this.state.goalDailyFat
           })
      }).then(this.props.update).then(this.props.hide).then(()=>{this.setState(intialState)});

      }

      render() {
        if(this.props.show) {
          const screenW = Math.round(Dimensions.get('window').width);
          const screenH = Math.round(Dimensions.get('window').height);
      
          return (
            <View style={{position: 'absolute', left: 0, top: -50}}>
              <TouchableWithoutFeedback onPress={() => this.props.hide()}>
                <View style={{width: screenW, height: screenH, backgroundColor: 'black', opacity: 0.75}}>
                </View>
              </TouchableWithoutFeedback>
              
              <View style={{position: 'absolute', width: this.props.width, height: this.props.height, left: (screenW - this.props.width)/2, top: (screenH - this.props.height)/2, backgroundColor: 'white', borderRadius: 10}}>
                <Text style={{fontSize: 25, marginLeft: 20, marginTop: 15}}>Edit Info</Text>
                <Button buttonStyle={styles.XButton} textStyle={{fontSize: 25}} text={'✕'} onPress={() => this.props.hide()}/>
                <View style={styles.textFields}>
                  <View style={styles.textEntry}>
                    <TextInput placeholder="First Name" defaultValue={this.state.firstName} value={this.state.firstName} style={styles.textInput} onChangeText={(firstName) => this.setState({firstName})} />
                  </View>
                  <View style={styles.textEntry}>
                    <TextInput placeholder="Last Name" defaultValue={this.state.lastName} value={this.state.lastName} style={styles.textInput} onChangeText={(lastName) => this.setState({lastName})} />
                  </View>
                  <View style={styles.textEntry}>
                    <TextInput placeholder="Activity Goal" defaultValue={this.state.goalDailyActivity} value={this.state.goalDailyActivity} style={styles.textInput} onChangeText={(goalDailyActivity) => this.setState({goalDailyActivity})} />
                  </View>
                  <View style={styles.textEntry}>
                    <TextInput placeholder="Calorie Goal" defaultValue={this.state.goalDailyCalories} value={this.state.goalDailyCalories} style={styles.textInput} onChangeText={(goalDailyCalories) => this.setState({goalDailyCalories})} />
                  </View>
                  <View style={styles.textEntry}>
                    <TextInput placeholder="Carbs Goal" defaultValue={this.state.goalDailyCarbohydrates} value={this.state.goalDailyCarbohydrates}  style={styles.textInput}  onChangeText={(goalDailyCarbohydrates) => this.setState({goalDailyCarbohydrates})}/>
                  </View>
                  <View style={styles.textEntry}>
                    <TextInput placeholder="Fat Goal" defaultValue={this.state.goalDailyFat} value={this.state.goalDailyFat} style={styles.textInput} onChangeText={(goalDailyFat) => this.setState({goalDailyFat})} />
                  </View>
                  <View style={styles.textEntry}>
                    <TextInput placeholder="Protein Goal"  defaultValue={this.state.goalDailyProtein} value={this.state.goalDailyProtein}  style={styles.textInput} onChangeText={(goalDailyProtein) => this.setState({goalDailyProtein})} />
                  </View>
                  <View style={styles.textEntry}>
                     <Button onPress={()=>{this.updateAll()}} textStyle={{color: 'white'}} buttonStyle={styles.update} text={'Update Goals!'}/>
                  </View>
                </View>
              </View>
              
            </View>
          )
        }
        return (<View></View>)
      }

}
const intialState = {
  firstName:undefined,
  lastName: undefined,
  goalDailyCalories: undefined,
  goalDailyProtein: undefined,
  goalDailyCarbohydrates: undefined,
  goalDailyFat: undefined,
  goalDailyActivity: undefined,
  token: '',
  username: ''
}

const styles = StyleSheet.create({
  textFields:{
    marginTop: 70,
    alignContent: 'center'
  },
  textEntry:{
    margin:20
  },
  textInput:{
    height: 40,
    margin:10,
    position: 'absolute',
    alignSelf: 'center',
    justifyContent: 'center',
    width: 150
  },
  XButton:{
    alignItems: 'center', 
    justifyContent: 'center',
    width: 70,
    height: 70, 
    position: 'absolute', 
    right: 0
  },
  update:{
    backgroundColor: '#755B69',
    padding: 10, 
    borderRadius: 10,
    height: 60,
    width: 175,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    marginTop: 80
  }
}
);