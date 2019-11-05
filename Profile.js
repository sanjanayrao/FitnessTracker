import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
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
          showEdit: false
        }
      }
  
  async updateGoals(){
    await this.retrieveInfo();
  }

  async retrieveInfo(){
    let res = await fetch('https://mysqlcs639.cs.wisc.edu/users/' + this.state.username, {
      method: 'GET',
      headers: {
        'Accept' : 'application/json',
        'Content-Type' : 'application/json',
        'x-access-token' : this.state.token
       }
      });
     
      data = await res.json();
      console.log(data)
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
    this.setState({token : this.props.navigation.state.params[0], username: this.props.navigation.state.params[1]}, () => {this.retrieveInfo()});
    
  }
  getDashName(){
    if(this.state.firstName && this.state.lastName){
      return ('' + this.state.firstName + ' ' + this.state.lastName + "'s" + ' Goals');
    }
    return 'My Goals';
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
              <Text style={styles.message}>{this.state.message}, {"\n"} {this.state.username}!</Text>
              <View style={styles.dataTable}>
                <Text style={styles.dashTitle}>{this.getDashName()}</Text>
                <DataTable>
                  <DataTable.Header>
                    <DataTable.Title>Goal Name</DataTable.Title>
                    <DataTable.Title numeric> Goal </DataTable.Title>
                  </DataTable.Header>

                  <DataTable.Row>
                    <DataTable.Cell>Activity</DataTable.Cell>
                    <DataTable.Cell numeric>{this.state.goalDailyActivity} minutes</DataTable.Cell>
                  </DataTable.Row>
                  <DataTable.Row>
                    <DataTable.Cell>Calories </DataTable.Cell>
                    <DataTable.Cell numeric>{this.state.goalDailyCalories} cal</DataTable.Cell>
                  </DataTable.Row>
                  <DataTable.Row>
                    <DataTable.Cell>Carbs</DataTable.Cell>
                    <DataTable.Cell numeric>{this.state.goalDailyCarbohydrates}g</DataTable.Cell>
                  </DataTable.Row>
                  <DataTable.Row>
                    <DataTable.Cell>Fat</DataTable.Cell>
                    <DataTable.Cell numeric>{this.state.goalDailyFat}g</DataTable.Cell>
                  </DataTable.Row>
                  <DataTable.Row>
                    <DataTable.Cell>Protein</DataTable.Cell>
                    <DataTable.Cell numeric>{this.state.goalDailyProtein}g</DataTable.Cell>
                  </DataTable.Row>

                </DataTable>
                <Button style={styles.editButton} title={'edit goals'} onPress={()=>this.showEdit()}/>

              </View>


            </View>
            <EditInfo  width={300} height={600} show={this.state.showEdit} hide={()=>{this.hideEdit()}} user={this.state.username} token={this.state.token} update={()=>{this.updateGoals()}}/>

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
 
