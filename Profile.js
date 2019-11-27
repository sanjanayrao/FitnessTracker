import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button
} from 'react-native';
import EditInfo from './EditInfo';
import { DataTable } from 'react-native-paper';




export default class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
          message: 'Welcome',
          token: '',
          username: '',
          firstName:'',
          lastName: '',
          goalDailyCalories: 0,
          goalDailyProtein: 0,
          goalDailyCarbohydrates: 0,
          goalDailyFat: 0,
          goalDailyActivity: 0,
          showEdit: false,
          meals : [],
          totalCal: 0,
          totalProtein: 0,
          totalCarb: 0,
          totalFat: 0,
          totalAct: 0
        }
      }
  
  async getActivity(){
    let res = await fetch('https://mysqlcs639.cs.wisc.edu/activities/', {
      method: 'GET',
      headers: {
        'Accept' : 'application/json',
        'Content-Type' : 'application/json',
        'x-access-token' : this.state.token
       }
      });
      res = await res.json();
      let aggregAct = 0;
      let subCal = 0;

      for( activity of res["activities"]){
        var date = new Date(activity["date"]);
        if(this.isToday(date)){
          aggregAct += activity["duration"];
          subCal += activity["calories"];
        }
        
      }

      let cal = this.state.totalCal - subCal;
      this.setState({totalAct: aggregAct, totalCal: cal})
  }
  

  async getMeals(){
    let res = await fetch('https://mysqlcs639.cs.wisc.edu/meals/', {
      method: 'GET',
      headers: {
        'Accept' : 'application/json',
        'Content-Type' : 'application/json',
        'x-access-token' : this.state.token
       }
      });
      res = await res.json();
      this.setState({meals: res}, ()=>{this.getFoods()});
  }

  isToday = (someDate) => {
    const today = new Date()
    someDate = new Date(someDate)
    return someDate.getDate() == today.getDate() &&
      someDate.getMonth() == today.getMonth() &&
      someDate.getFullYear() == today.getFullYear()
  }

  async getFoods(){
    if(this.state.meals["meals"]){
    // iterate through meals in this state 
    // check date
    // make a call with the meal id
    // return food data
    // update state

      let meals = this.state.meals["meals"];
      var pro = 0;
      var cal = 0;
      var carb = 0;
      var fat = 0;
  
      for(meal of meals){
        var date = new Date(meal["date"]);
        if((this.isToday(date))){
          let mealId = meal["id"];
          let res = await fetch('https://mysqlcs639.cs.wisc.edu/meals/' + mealId + '/foods/', {
            method: 'GET',
            headers: {
              'Accept' : 'application/json',
              'Content-Type' : 'application/json',
              'x-access-token' : this.state.token
            }
            });
            res = await res.json();
            for ( food of res["foods"]){
              pro += food["protein"];
              cal += food["calories"];
              carb += food["carbohydrates"];
              fat += food["fat"];
            }
        }
      }
      this.setState({  
        totalCal: Math.round(cal),
        totalProtein: Math.round(pro),
        totalCarb: Math.round(carb),
        totalFat: Math.round(fat)
      }, ()=>{this.getActivity();});

    }
  }

    async retrieveInfo(){
      // updates user goals
      let res = await fetch('https://mysqlcs639.cs.wisc.edu/users/' + this.state.username, {
        method: 'GET',
        headers: {
          'Accept' : 'application/json',
          'Content-Type' : 'application/json',
          'x-access-token' : this.state.token
        }
        });
      
        data = await res.json();
        //console.log(this.state.token)
        this.setState({
          firstName: data["firstName"], 
          lastName: data["lastName"], 
          goalDailyActivity: data["goalDailyActivity"],
          goalDailyCalories: data["goalDailyCalories"],
          goalDailyCarbohydrates: data["goalDailyCarbohydrates"],
          goalDailyFat : data["goalDailyFat"],
          goalDailyProtein : data["goalDailyProtein"]
        });

        

  }
  componentDidMount(){
    this.setState({token : this.props.navigation.state.params["token"], username: this.props.navigation.state.params["user"]});
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      this.retrieveInfo().then(()=>{this.getMeals()});
    });
    
  }
  componentWillUnmount(){
    this.focusListener.remove();
  }

  getDashName(){
    if(this.state.firstName && this.state.lastName){
      return ('' + this.state.firstName + ' ' + this.state.lastName + "'s" + ' Progress Today');
    }
    return 'My Progress Today';
  }

  showEdit() {
    this.setState({showEdit: true});
  }

  hideEdit(){
    this.setState({showEdit: false});

  }
  render() {
    return (
        <View style={styles.container}>
          <View style={styles.header}></View>
          <Image style={styles.avatar} source={require('./assets/octo.png')}/>
            <View >
              <View accessible={true}>
              <Text style={styles.message}>{this.state.message}, {"\n"} {this.state.username}!</Text>
              </View>
              <View style={styles.dataTable}>
                <View accessible={true} >
                <Text style={styles.dashTitle} >{this.getDashName()}</Text>
                </View>
                <View accessible={true}>
                <DataTable>
                  <DataTable.Header>
                    <DataTable.Title>Goal Name</DataTable.Title>
                    <DataTable.Title numeric >  Current / Goal </DataTable.Title>
                  </DataTable.Header>

                  <DataTable.Row>
                    <DataTable.Cell>Activity</DataTable.Cell>
                    <DataTable.Cell numeric>{this.state.totalAct} / {this.state.goalDailyActivity} minutes</DataTable.Cell>
                  </DataTable.Row>
                  <DataTable.Row>
                    <DataTable.Cell>Calories </DataTable.Cell>
                    <DataTable.Cell numeric> {this.state.totalCal} / {this.state.goalDailyCalories} cal</DataTable.Cell>
                  </DataTable.Row>
                  <DataTable.Row>
                    <DataTable.Cell>Carbs</DataTable.Cell>
                    <DataTable.Cell numeric>{this.state.totalCarb} / {this.state.goalDailyCarbohydrates}g</DataTable.Cell>
                  </DataTable.Row>
                  <DataTable.Row>
                    <DataTable.Cell>Fat</DataTable.Cell>
                    <DataTable.Cell numeric>{this.state.totalFat} / {this.state.goalDailyFat}g</DataTable.Cell>
                  </DataTable.Row>
                  <DataTable.Row>
                    <DataTable.Cell>Protein</DataTable.Cell>
                    <DataTable.Cell numeric>{this.state.totalProtein} / {this.state.goalDailyProtein}g</DataTable.Cell>
                  </DataTable.Row>

                </DataTable>
                </View>
                <View accessible={true}>
                <Button style={styles.editButton} title={'edit goals'} onPress={()=>this.showEdit()}/>
                </View>
              </View>


            </View>
            <EditInfo  width={300} height={600} show={this.state.showEdit} hide={()=>{this.hideEdit()}} user={this.state.username} token={this.state.token} update={()=>{this.retrieveInfo()}}/>
     
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    backgroundColor: '#070707'
  },
  header:{
    backgroundColor: "#9FC9AE",
    height:150,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: '#755B69',
    backgroundColor: 'white',
    marginBottom:10,
    alignSelf:'center',
    position: 'absolute',
    marginTop:130
  },

  editButton:{
    color: 'blue',
    position:'absolute',
    marginTop: 15
  },
  dataTable:{
    alignSelf: 'center',
    position: 'absolute',
    marginTop: 130,
    width: 300
  },
  message:{
    marginLeft: 15,
    fontSize: 25,
    fontWeight: "bold",
    color: '#F1F2EE',
    marginBottom: 10,
    marginTop: 10
  },
  dashTitle:{
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 30
  }
});
 
