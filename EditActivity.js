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


export default class EditActivity extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
          name : undefined,
          duration : undefined,
          calories : undefined,
          date : new Date()
        }
        this.initialState= this.state;
      }

      
     async updateDB(){
      if(typeof this.state.date == 'string'){
        let month = this.state.date.substring(0,2);
        let day = this.state.date.substring(3, 5);
        let year = this.state.date.substring(6, 10);
        var formDate = new Date(year, month-1, day);
      }else{
       var formDate = new Date(this.state.date);
      }
            let data = await fetch('https://mysqlcs639.cs.wisc.edu/activities/' + this.props.id, {
            method: 'PUT',
            headers: {
                'Accept' : 'application/json',
                'Content-Type' : 'application/json',
                'x-access-token' : this.props.token
            },
            body: JSON.stringify({
                'name' : this.state.name,
                'duration' : this.state.duration,
                'calories' : this.state.calories,
                'date' : formDate,
            })
        }).then(this.props.update).then(this.props.hide).then(()=>{this.setState(this.initialState)});
        
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
                <Text style={{fontSize: 25, marginLeft: 20, marginTop: 15}}>Edit Meal</Text>
                <Button buttonStyle={styles.XButton} textStyle={{fontSize: 25}} text={'✕'} onPress={() => this.handleClose()}/>
                <View style={styles.textFields}>
                  <View style={styles.textEntry}>
                    <TextInput placeholder="Name"  textAlign={'center'} value={this.state.firstName} style={styles.textInput} onChangeText={(name) => this.setState({name})} />
                  </View>
                  <View style={styles.textEntry}>
                    <TextInput placeholder="Duration" textAlign={'center'}  value={this.state.duration} style={styles.textInput} onChangeText={(duration) => this.setState({duration})} />
                  </View>
                  <View style={styles.textEntry}>
                    <TextInput placeholder="Calories" textAlign={'center'} value={this.state.calories} style={styles.textInput} onChangeText={(calories) => this.setState({calories})} />
                  </View>
                  <View style={styles.date}>
                      <DatePicker  style={{ width: 200 }}
                            date={this.state.date} //initial date from state
                            mode="datetime" //The enum of date, datetime and time
                            placeholder="select date"
                            format="MM-DD-YYYY"
                            minDate="01-01-2000"
                            maxDate="01-01-2059"
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
                               this.setState({date});
                            }}/>
                  </View>
                  <View style={styles.textEntry}>
                     <Button onPress={()=>{this.updateDB()}} textStyle={{color: 'white'}} buttonStyle={styles.update} text={'Edit Activity!'}/>
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
    marginTop: 30
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