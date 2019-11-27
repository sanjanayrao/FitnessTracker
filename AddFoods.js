import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Picker,
} from 'react-native';
import Button from './Button';
import { ScrollView } from 'react-native-gesture-handler';


export default class AddMeal extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            foods: [],
            foodLib: [],
            pick: undefined
            
        }
        this.initial=this.state;
      }

     async updateDB(){
        for(food of this.state.foods){
            let data = await fetch('https://mysqlcs639.cs.wisc.edu/meals/' + this.props.navigation.state.params["id"] + '/foods', {
            method: 'POST',
            headers: {
                'Accept' : 'application/json',
                'Content-Type' : 'application/json',
                'x-access-token' : this.props.navigation.state.params["token"]
            },
            body: JSON.stringify({
                name: food["name"],
                measure : food["measure"],
                calories : food["calories"],
                protein : food["protein"],
                carbohydrates : food["carbohydrates"],
                fat : food["fat"]
                
                })
            }).then(()=>{this.returnToStart()});
        }

      }

      addFood(){
        if(this.state.pick){
            let foodItems = this.state.foods;
            let add;
            for(food of this.state.foodLib){
              if(this.state.pick === food["id"]){
                add = food;
                break;
              }
            }
            foodItems.push(add);
            this.setState({foods: foodItems});
        }
     
      }


      async getFoodDB(){
        let data = await fetch('https://mysqlcs639.cs.wisc.edu/foods', {
            method: 'GET',
            headers: {
                'Accept' : 'application/json',
                'Content-Type' : 'application/json',
                'x-access-token' : this.props.navigation.state.params["token"]
            }});
            data = await data.json();
            let foodLib = [];
            for(food of data["foods"]){
                foodLib.push(food);
            }
            this.setState({foodLib});
      }

      returnToStart(){
          this.setState(this.initial, ()=>{this.props.navigation.navigate('Meals')});
          
      }

      removeFood(item){
        let update = [];
        let rem = false;
        for(food of this.state.foods){
          if(item["name"] === food["name"] && !rem){
            rem = true
          }else{
            update.push(food);
          }
        }
          this.setState({foods: update})
      }

      componentDidMount(){
          this.setState({token: this.props.navigation.state.params["token"], id : this.props.navigation.state.params["id"]}, ()=>{this.getFoodDB()});
      }

      render() {
        let pick = this.state.foodLib.map((item, i) => {
            return <Picker.Item key={i} value={item["id"]} label={item["name"]} />
        });

        let currFoods = this.state.foods.map((item, i) => {
            return  <View style={{flexDirection:'row', margin:5}} index={i} key={i}><Text style={{fontSize: 20}} key={i}> ‣{item["name"]}</Text><Text>          </Text><TouchableOpacity><Button text={'✕'} textStyle={{fontSize: 20, color :'#b00000', alignSelf: 'center'} }  buttonStyle={{alignSelf:'flex-end', height: 20, width:20, alignContent:'center', justifyContent: 'center', backgroundColor: '#c7c3c3'}} onPress={()=>{this.removeFood(item)}}/></TouchableOpacity></View>
        });

          return (

            <ScrollView contentContainerStyle={styles.container}>
                <Text style={{fontSize: 40, alignSelf: 'center', justifyContent:'center', marginTop: 70}}>Add Foods</Text>
                <View style={styles.textFields}>
                <View style={{margin:15}}>
                      <Text style={{alignSelf: 'center', fontSize: 20}}> Choose food items: </Text>
                        <Picker
                            
                            selectedValue={this.state.pick}
                            style={{width: 180, alignSelf: 'center'}}
                            onValueChange={(itemValue) =>{
                                this.setState({pick: itemValue});}
                            }>
                            {pick}
                        </Picker>
                    </View>
                    <View style={styles.textEntry}>
                        <Button onPress={()=>{this.addFood()}} buttonStyle={styles.add} textStyle={{color: 'white'}} text={'Add Food'}/>  
                        <Button onPress={()=>{this.updateDB()}} textStyle={{color: 'white'}} buttonStyle={styles.update} text={'Done'}/>
                    </View>

                    <Text style={{fontSize:25, margin:20, alignSelf: 'center'}}>Current Foods:</Text>
                    <View style={styles.currFood}>
                        {currFoods}
                   
                    </View>
                    <View style={{marginBottom: 170}}></View>
                  </View>
                  <View style={{marginBottom: 100}}></View>
                </ScrollView>
          )
        }
      }


const screenHeight = Math.round(Dimensions.get('window').height);
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ecf0f1',
    alignContent: 'center',
    alignItems: 'center',
  },
  textFields:{
    flex: 5,
    width: 300,
    marginTop: 15,
    alignContent: 'center',
    marginBottom: 25,
    alignSelf: 'center',
    backgroundColor: '#ffffff'
  },
  textEntry:{
    margin: 20,
    marginTop: 50
  },
  currFood: {
    alignSelf:'center',
    justifyContent: 'center',
    marginBottom: 15
  },
  textInput:{
    height: 40,
    margin:10,
    alignSelf: 'center',
    justifyContent: 'center',
    width: 150
  },
  add:{
    backgroundColor: '#9FC9AE',
    padding: 10, 
    borderRadius: 10,
    height: 60,
    width: 175,
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    margin: 5
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