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
import DatePicker from 'react-native-datepicker';
import { ScrollView } from 'react-native-gesture-handler';


export default class AddMeal extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            name : '',
            date : new Date(),
            time : new Date(),
            id: ''

        }
        this.initial=this.state;
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
       if(typeof this.state.time == 'string'){
        let hours = this.state.time.substring(0,2);
        let minutes = this.state.time.substring(3, 5);
        formDate.setHours(hours);
        formDate.setMinutes(minutes);
       }
        if(this.state.name){
            let data = await fetch('https://mysqlcs639.cs.wisc.edu/meals', {
            method: 'POST',
            headers: {
                'Accept' : 'application/json',
                'Content-Type' : 'application/json',
                'x-access-token' : this.props.navigation.state.params["token"]
            },
            body: JSON.stringify({
                'name' : this.state.name,
                'date' : formDate
            })
        });

         data = await data.json();
        this.setState({id: data["id"]});
         
       }
    }

      addMeal(){
          if(this.state.name){
          this.updateDB().then(()=>{ 
            this.props.navigation.navigate('AddFoods', {token: this.props.navigation.state.params["token"], id: this.state.id});
            this.setState(this.initial);
           });
          }
      }
      returnToStart(){
          this.setState(this.initial, ()=>{this.props.navigation.navigate('Meals')});
          
      }
      render() {

          return (
              
              <ScrollView style={styles.container}>
                <Text style={{fontSize: 40, alignSelf: 'center', justifyContent:'center', marginTop: 70, flex: 1}}>Add Meal</Text>
                <View style={styles.textFields}>
                  <View style={styles.textEntry}>
                    <TextInput placeholder="Name, ex: 'breakfast'" textAlign={'center'} textStyle={{fontSize: 20}}  value={this.state.name} style={styles.textInput} onChangeText={(name) => this.setState({name})} />
                  </View>
                  <View style={styles.date}>

                      <DatePicker  style={{ width: 200 }}
                            date={this.state.date} //initial date from state
                            mode="date" //The enum of date, datetime and time
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
                            <DatePicker  style={{ width: 200 }}
                            date={this.state.time} //initial date from state
                            mode="time" //The enum of date, datetime and time
                            placeholder="select time"
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
                            onDateChange={time => {
                               this.setState({time});
                            }}/>
                  </View>
                  
                  <View style={styles.textEntry}>
                     <Button onPress={()=>{this.addMeal()}} textStyle={{color: 'white'}} buttonStyle={styles.update} text={'Next'}/>
                  </View>
                </View>
              </ScrollView>    
          )
        }
      }



const styles = StyleSheet.create({
  container:{
    backgroundColor: '#ecf0f1',
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center'
  },
  date: {
    margin: 30,
  },
  textFields:{
    width: 300,
    flex: 10,
    alignContent: 'center',
    marginBottom: 55,
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: '#ffffff'
    
  },
  textEntry:{
    margin: 50
  },
  textInput:{
    height: 50,
    position: 'absolute',
    alignSelf: 'center',
    justifyContent: 'center',
    width: 175
  },

  update:{
    backgroundColor: '#755B69',
    padding: 10, 
    borderRadius: 10,
    height: 60,
    width: 175,
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    alignSelf: 'center'
  }
}
);