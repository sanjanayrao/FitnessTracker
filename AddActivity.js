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
import DatePicker from 'react-native-datepicker'


export default class AddActivity extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            name : '',
            duration : '',
            calories : '',
            date : new Date()
        }
        this.initial=this.state;
      }

     async updateDB(){
        if(this.state.name && this.state.duration && this.state.calories){
            let data = await fetch('https://mysqlcs639.cs.wisc.edu/activities/', {
            method: 'POST',
            headers: {
                'Accept' : 'application/json',
                'Content-Type' : 'application/json',
                'x-access-token' : this.props.token
            },
            body: JSON.stringify({
                'name' : this.state.name,
                'duration' : this.state.duration,
                'calories' : this.state.calories,
                'date' : this.state.date,
            })
        }).then(this.props.update).then(this.props.hide).then(()=>{this.setState(this.initial)});
        }
      }

      handleClose(){
        this.setState(this.initial);
        this.props.hide();
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
              
              <View style={{position: 'absolute', width: this.props.width, height: this.props.height*0.70, left: (screenW - this.props.width)/2, top: (screenH - this.props.height + 150)/2, backgroundColor: 'white', borderRadius: 10}}>
                <Text style={{fontSize: 25, marginLeft: 20, marginTop: 15}}>Add Meal</Text>
                <Button buttonStyle={styles.XButton} textStyle={{fontSize: 25}} text={'✕'} onPress={() => this.handleClose()}/>
                <View style={styles.textFields}>
                  <View style={styles.textEntry}>
                    <TextInput placeholder="Name" textAlign={'center'}  value={this.state.firstName} style={styles.textInput} onChangeText={(name) => this.setState({name})} />
                  </View>
                  <View style={styles.textEntry}>
                    <TextInput placeholder="Duration"  textAlign={'center'} value={this.state.duration} style={styles.textInput} onChangeText={(duration) => this.setState({duration})} />
                  </View>
                  <View style={styles.textEntry}>
                    <TextInput placeholder="Calories" textAlign={'center'} value={this.state.calories} style={styles.textInput} onChangeText={(calories) => this.setState({calories})} />
                  </View>
                  <View style={styles.date}>
                      <DatePicker  style={{ width: 200 }}
                            date={this.state.date} //initial date from state
                            mode="datetime" //The enum of date, datetime and time
                            backgroundColor= 'black'
                            placeholder="select date"
                            format="YYYY-MM-DD"
                            confirmBtnText="Confirm"
                            cancelBtnText="Cancel"
                            customStyles={{
                                dateIcon: {
                                position: 'absolute',
                                left: 0,
                                top: 4,
                                marginLeft: 0,
                                },
                                dateInput: {
                                marginLeft: 36,
                                },
                            }}
                            onDateChange={date => {
                                this.setState({ date: date });
                            }}/>
                  </View>
                  <View style={styles.textEntry}>
                     <Button onPress={()=>{this.updateDB()}} textStyle={{color: 'white'}} buttonStyle={styles.update} text={'Add Activity!'}/>
                  </View>
                </View>
              </View>
              
            </View>
          )
        }
        return (<View></View>)
      }

}

const styles = StyleSheet.create({
  date: {
    margin: 20,
    marginLeft: 34,
    marginTop: 50
  },
  textFields:{
    marginTop: 35,
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
    alignSelf: 'center'
  }
}
);