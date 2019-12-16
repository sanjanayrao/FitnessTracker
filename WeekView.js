import React from 'react'
import { StackedAreaChart, XAxis, YAxis, Grid } from 'react-native-svg-charts'
import * as shape from 'd3-shape'
import { View, Text, AsyncStorage, Dimensions } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler';

export default class WeekView extends React.PureComponent {
    constructor(props){
        super(props);
        this.state = {
            data: [],       
            token: ''
        }

    }

    async getData(){
      let msg = await fetch('https://mysqlcs639.cs.wisc.edu/activities', {
      method: 'GET',
      headers: {
        'Accept' : 'application/json',
        'Content-Type' : 'application/json',
        'x-access-token' : this.state.token
      }
      }).catch();
    msg = await msg.json();
    
    
    let data = [];
    let i;
    // create days
    for ( i = 0 ; i < 8 ; i++) {
        data.push({day: 0,
            protein: 0,
            calories:  0,
            activity: 0,
            fat: 0,
            carbohydrates: 0
            });
    }

    for (item of msg["activities"]){
        var date = new Date(item["date"]);
        for ( i = 0 ; i < 8 ; i++){
            if(this.isDayAgo(date, i)) {
                data[i]["activity"] += item["duration"];
                data[i]["calories"] += item["calories"];
            }
        }
    } 
      // now aggregate nutritional info
      let rsp = await fetch('https://mysqlcs639.cs.wisc.edu/meals', {
      method: 'GET',
      headers: {
        'Accept' : 'application/json',
        'Content-Type' : 'application/json',
        'x-access-token' : this.state.token
      }
      }).catch();

      rsp = await rsp.json();

    for( item of rsp["meals"]){
        var date = new Date(item["date"]);
        let nutrients = await this.getNutrients(item["id"], this.state.token)
        for( i = 0 ; i < 8 ; i++){ 
            if(this.isDayAgo(date, i)){
                data[i]["protein"] += nutrients["protein"];
                data[i]["fat"]  += nutrients["fat"];
                data[i]["carbohydrates"] += nutrients["carbohydrates"];
                data[i]["calories"]  +=  nutrients["calories"];
            }
        }
    }

    this.setState({data: data});
    }

    async getNutrients(id, tok){
        let res = await fetch('https://mysqlcs639.cs.wisc.edu/meals/' + id + '/foods/', {
            method: 'GET',
            headers: {
              'Accept' : 'application/json',
              'Content-Type' : 'application/json',
              'x-access-token' : tok
            }
            });
        res = await res.json();
        let nutrients = {
            protein: 0,
            calories: 0,
            fat: 0,
            carbohydrates: 0
        }
        for(food of res["foods"]){
            nutrients["protein"] += food["protein"] || 0;
            nutrients["calories"] += food["calories"] || 0;
            nutrients["fat"] += food["fat"] || 0;
            nutrients["carbohydrates"] += food["carbohydrates"] || 0;
            
        }
        return nutrients;
    }

    isDayAgo = (someDate, daysAgo) => {
        var today = new Date();
        today.setDate(today.getDate() - daysAgo);
        someDate = new Date(someDate);
        return someDate.getDate() == today.getDate()  &&
          someDate.getMonth() == today.getMonth() &&
          someDate.getFullYear() == today.getFullYear()
      }

    async _getData(){
        var token = await AsyncStorage.getItem('token');
        // remove preceeding and trailing backslash
        token = token.substr(1).slice(0, -1);
        this.setState({token});
      }

    componentDidMount(){
        this.focusListener = this.props.navigation.addListener('didFocus', () => {
          this._getData().then(()=> this.setState(this.intitial)).then(()=>{this.getData()});
        });
      }
      
      componentWillUnmount(){
        this.focusListener.remove();
      }

      print(item){
          console.log(item)
      }
    render() {

     
        const day = [0, 1, 2, 3, 4, 5, 6, 7]
        const colors =['#9FC9AE', '#B38CB4', '#C7EAE4', '#DDC67B', '#FCBCB8']
        const keys = [ 'protein' , 'carbohydrates', 'fat', 'activity', 'calories']

        const screenHeight = Math.round(Dimensions.get('window').height);
        const screenW = Math.round(Dimensions.get('window').width);

        return (

           <ScrollView style={{backgroundColor: '#ecf0f1', height: screenHeight}}>
               <Text style={{fontSize: 40, marginTop: 60, marginBottom: 5, alignSelf: 'center'}}>Week View</Text>
                <View style={{marginTop:150}}>
                    <Text style={{fontSize: 25, alignSelf: 'center'}}> Your Stats Over 7 Days </Text>
                <View style={ { flexDirection: 'row', height: 230, width: screenW * 0.95, alignSelf: 'center', backgroundColor: 'white'} }>
                    <StackedAreaChart
                        style={ { flex: 1, magin: 10 } }
                        contentInset={ { top: 10, bottom: 35 } }
                        data={ this.state.data }
                        keys={ keys }
                        colors={ colors }
                        curve={ shape.curveLinear }
                    >
                        <Grid/>
                    </StackedAreaChart>
                    <YAxis
                    data={StackedAreaChart.extractDataPoints(this.state.data, keys)}
                    contentInset={ {top: 20, bottom: 20 }}

                    svg={{
                        fill: 'grey',
                        fontSize: 10,
                    }}
                    
                />
                </View>
                <XAxis
                    style={{ marginHorizontal: 10, postion:'absolute' }}
                    data={ day }
                    contentInset={{ left: 10, right: 10 }}
                    svg={{ fontSize: 10, fill: 'black' }}
                />
                <Text>(days ago)</Text>
                
                </View>
                <View style={{backgroundColor: 'white', width: 145, margin: 15, padding: 5}}>
                    <Text style={{ marginBottom: 5, fontSize: 18}}>
                        Key:
                    </Text>
                    <Text style={{color: colors[0], fontWeight: 'bold'}}>protein (g)</Text>
                    <Text style={{color: colors[1], fontWeight: 'bold'}}>carbohydrates (g)</Text>
                    <Text style={{color: colors[2], fontWeight: 'bold'}}>fat (g)</Text>
                    <Text style={{color: colors[3], fontWeight: 'bold'}}>activity (min)</Text>
                    <Text style={{color: colors[4], fontWeight: 'bold'}}>calories (kcal)</Text>

                </View>
            </ScrollView>
        )
    }
}