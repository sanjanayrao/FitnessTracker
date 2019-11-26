import React from 'react'
import { StackedAreaChart, XAxis, YAxis, Grid } from 'react-native-svg-charts'
import * as shape from 'd3-shape'
import { View, Text, AsyncStorage, Dimensions } from 'react-native'
import { ForceTouchGestureHandler } from 'react-native-gesture-handler';

export default class WeekView extends React.PureComponent {
    constructor(props){
        super(props);
        this.state = {
            // daysAgo: {minutes, caloriesBurned, cals, pro, fat, carb}
        data:{
            seven: {
                min: 0,
                calBurn: 0,
                pro: 0,
                cal : 0,
                fat: 0,
                carb : 0
            },
            six: { 
                min: 0,
                calBurn: 0,
                pro: 0,
                cal : 0,
                fat: 0,
                carb : 0
            },
            five: { 
                min: 0,
                calBurn: 0,
                pro: 0,
                cal : 0,
                fat: 0,
                carb : 0
            },
            four: { 
                min: 0,
                calBurn: 0,
                pro: 0,
                cal : 0,
                fat: 0,
                carb : 0
            },
            three: { 
                min: 0,
                calBurn: 0,
                pro: 0,
                cal : 0,
                fat: 0,
                carb : 0
            },
            two: {
                min: 0,
                calBurn: 0,
                pro: 0,
                cal : 0,
                fat: 0,
                carb : 0
            },
            one: {
                min: 0,
                calBurn: 0,
                pro: 0,
                cal : 0,
                fat: 0,
                carb : 0
            },
            today: { 
                min: 0,
                calBurn: 0,
                pro: 0,
                cal : 0,
                fat: 0,
                carb : 0
            }
        },
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
    let min =  0;
    let calBurn = 0;
    var tok = this.state.token;
    this.setState(this.initial, ()=>{this._getData()});
      // aggregate activity data for all days
    for (item of msg["activities"]){
      var date = new Date(item["date"]);
        if(this.isDayAgo(date, 0)){
            min = this.state.today["min"] + item["duration"];
            calBurn = this.state.today["calBurn"]  + item["calories"];
            this.setState({today: { min, calBurn}});
            min = 0;
            calBurn =0;
        }else if(this.isDayAgo(date, 1)){
            min = this.state.one["min"] + item["duration"];
            calBurn = this.state.one["calBurn"] + item["calories"];
            this.setState({one: { min, calBurn}});
            min = 0;
            calBurn =0;
        }else if(this.isDayAgo(date, 2)){
            min = this.state.two["min"] + item["duration"];
            calBurn = this.state.two["calBurn"] + item["calories"];
            this.setState({two: { min, calBurn}});
            min = 0;
            calBurn =0;
        }else if(this.isDayAgo(date, 3)){
            min = this.state.three["min"] + item["duration"];
            calBurn = this.state.three["calBurn"] + item["calories"];
            this.setState({three: { min, calBurn}});
            min = 0;
            calBurn =0;
        }else if(this.isDayAgo(date, 4)){
            min = this.state.four["min"] + item["duration"];
            calBurn = this.state.four["calBurn"] + item["calories"];
            this.setState({four: { min, calBurn}});
            min = 0;
            calBurn =0;
        }else if(this.isDayAgo(date, 5)){
            min = this.state.five["min"] + item["duration"];
            calBurn = this.state.five["calBurn"] + item["calories"];
            this.setState({five: { min, calBurn}});
            min = 0;
            calBurn =0;
        }else if(this.isDayAgo(date, 6)){
            min = this.state.six["min"] + item["duration"];
            calBurn = this.state.six["calBurn"] + item["calories"];
            this.setState({six: { min, calBurn}});
            min = 0;
            calBurn =0;
        }else if(this.isDayAgo(date, 7)){
            min = this.state.seven["min"] + item["duration"];
            calBurn = this.state.seven["calBurn"] + item["calories"];
            this.setState({seven: { min, calBurn}});
            min = 0;
            calBurn =0;
        }
      }

      
      // now aggregate nutritional info
      let data = await fetch('https://mysqlcs639.cs.wisc.edu/meals', {
      method: 'GET',
      headers: {
        'Accept' : 'application/json',
        'Content-Type' : 'application/json',
        'x-access-token' : tok
      }
      }).catch();
      data = await data.json();

      let pro0 = 0;
      let fat0 = 0;
      let carb0 = 0;
      let cal0 = 0;

      let pro1 = 0;
      let fat1 = 0;
      let carb1 = 0;
      let cal1 = 0;

      let pro2 = 0;
      let fat2 = 0;
      let carb2 = 0;
      let cal2 = 0;

      let pro3 = 0;
      let fat3 = 0;
      let carb3 = 0;
      let cal3 = 0;

      let pro4 = 0;
      let fat4 = 0;
      let carb4 = 0;
      let cal4 = 0;

      let pro5 = 0;
      let fat5 = 0;
      let carb5 = 0;
      let cal5 = 0;

      let pro6 = 0;
      let fat6 = 0;
      let carb6 = 0;
      let cal6 = 0;

      let pro7 = 0;
      let fat7 = 0;
      let carb7 = 0;
      let cal7= 0;


      for(item of data["meals"]){
        var date = new Date(item["date"]);
        let nutrients = await this.getNutrients(item["id"], tok)

        if(this.isDayAgo(date, 0)){
            pro0 += nutrients["protein"];
            fat0 += nutrients["fat"];
            carb0+= nutrients["carbohydrates"];
            cal0 +=  nutrients["calories"];
            
        }else if(this.isDayAgo(date, 1)){
            pro1 += nutrients["protein"];
            fat1 += nutrients["fat"];
            carb1 += nutrients["carbohydrates"];
            cal1 += nutrients["calories"];
            console.log(pro1, fat1, carb1, cal1)
        }else if(this.isDayAgo(date, 2)){
            pro2 += nutrients["protein"];
            fat2 += nutrients["fat"];
            carb2 += nutrients["carbohydrates"];
            cal2 += nutrients["calories"];

        }else if(this.isDayAgo(date, 3)){
           pro3 += nutrients["protein"];
            fat3 += nutrients["fat"];
            carb3 += nutrients["carbohydrates"];
            cal3 += nutrients["calories"];

        }else if(this.isDayAgo(date, 4)){
            pro4 += nutrients["protein"];
            fat4 += nutrients["fat"];
            carb4 += nutrients["carbohydrates"];
            cal4 += nutrients["calories"];

        }else if(this.isDayAgo(date, 5)){
            pro5 += nutrients["protein"];
            fat5 += nutrients["fat"];
            carb5 += nutrients["carbohydrates"];
            cal5 += nutrients["calories"];

        }else if(this.isDayAgo(date, 6)){
            pro6 += nutrients["protein"];
            fat6 += nutrients["fat"];
            carb6 += nutrients["carbohydrates"];
            cal6 += nutrients["calories"];

        }else if(this.isDayAgo(date, 7)){
            pro7 += nutrients["protein"];
            fat7 += nutrients["fat"];
            carb7 += nutrients["carbohydrates"];
            cal7 += nutrients["calories"];

        }

      }
      this.setState({today: {...this.state.today, pro: pro0, fat: fat0, carb: carb0, cal: cal0 } });
      this.setState({one: {...this.state.one, pro: pro1, fat: fat1, carb: carb1, cal: cal1} });
      this.setState({two: {...this.state.two, pro: pro2, fat: fat2, carb: carb2, cal: cal2 } });
      this.setState({three: {...this.state.three, pro: pro3, fat: fat3, carb: carb3, cal: cal3} });
      this.setState({four: {...this.state.four, pro: pro4, fat: fat4, carb: carb4, cal: cal4 } });
      this.setState({five: {...this.state.five, pro: pro5, fat: fat5, carb: carb5, cal: cal5 } });
      this.setState({six: {...this.state.six, pro: pro6, fat: fat6, carb: carb6, cal: cal6 } });
      this.setState({seven: {...this.state.seven, pro: pro7, fat: fat7, carb: carb7, cal: cal7 } });


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
        console.log(nutrients)
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
        
        // const data = [
        //     {
        //         day: 0,
        //         protein: this.state.today["pro"],
        //         calories:  this.state.today["cal"] - this.state.today["calBurn"],
        //         activity: this.state.today["min"],
        //         fat: this.state.today["fat"], 
        //         carbohydrates: this.state.today["carb"],
        //     },
        //     {
        //         day: 1,
        //         protein: this.state.one["pro"],
        //         calories:  this.state.one["cal"] - this.state.one["calBurn"],
        //         activity: this.state.one["min"],
        //         fat: this.state.one["fat"], 
        //         carbohydrates: this.state.one["carb"],
        //     },{
        //         day: 2,
        //         protein: this.state.two["pro"],
        //         calories:  this.state.two["cal"] - this.state.two["calBurn"],
        //         activity: this.state.two["min"],
        //         fat: this.state.two["fat"], 
        //         carbohydrates: this.state.two["carb"],
        //     },{
        //         day: 3,
        //         protein: this.state.three["pro"],
        //         calories:  this.state.three["cal"] - this.state.three["calBurn"],
        //         activity: this.state.three["min"],
        //         fat: this.state.three["fat"], 
        //         carbohydrates: this.state.three["carb"],
        //     },{
        //         day: 4,
        //         protein: this.state.four["pro"],
        //         calories:  this.state.four["cal"] - this.state.four["calBurn"],
        //         activity: this.state.four["min"],
        //         fat: this.state.four["fat"], 
        //         carbohydrates: this.state.four["carb"],
        //     },{
        //         day: 5,
        //         protein: this.state.five["pro"],
        //         calories:  this.state.five["cal"] - this.state.five["calBurn"],
        //         activity: this.state.five["min"],
        //         fat: this.state.five["fat"], 
        //         carbohydrates: this.state.five["carb"],
        //     },{
        //         day: 6,
        //         protein: this.state.six["pro"],
        //         calories:  this.state.six["cal"] - this.state.six["calBurn"],
        //         activity: this.state.six["min"],
        //         fat: this.state.six["fat"], 
        //         carbohydrates: this.state.six["carb"],
        //     },{
        //         day: 7,
        //         protein: this.state.seven["pro"],
        //         calories:  this.state.seven["cal"] - this.state.seven["calBurn"],
        //         activity: this.state.seven["min"],
        //         fat: this.state.seven["fat"], 
        //         carbohydrates: this.state.seven["carb"],
        //     },
          
        // ]

        // const data1 = [
        //     {
        //         day: 0,
        //         protein: this.state.today["pro"],
        //         calories: this.state.today["cal"] - this.state.today["calBurn"],
        //         activity: this.state.today["min"],
        //         fat: this.state.today["fat"], 
        //         carbohydrates: this.state.today["carb"],
        //     },
        //     {
        //         day: 1,
        //         protein: this.state.one["pro"],
        //         calories:  80,
        //         activity: this.state.one["min"],
        //         fat: 40, 
        //         carbohydrates: 40,
        //     },{
        //         day: 2,
        //         protein: this.state.two["pro"],
        //         calories:  this.state.two["cal"] - this.state.two["calBurn"],
        //         activity:  this.state.two["min"],
        //         fat:  this.state.two["fat"], 
        //         carbohydrates: this.state.two["carb"],
        //     },{
        //         day: 3,
        //         protein: this.state.three["pro"],
        //         calories:  this.state.three["cal"] - this.state.three["calBurn"],
        //         activity: this.state.three["min"],
        //         fat: this.state.three["fat"], 
        //         carbohydrates: this.state.three["carb"],
        //     },{
        //         day: 4,
        //         protein: 40,
        //         calories:  40,
        //         activity: this.state.four["min"],
        //         fat: 40, 
        //         carbohydrates: 40,
        //     },{
        //         day: 5,
        //         protein: this.state.five["pro"],
        //         calories:  this.state.five["cal"] - this.state.five["calBurn"],
        //         activity: this.state.five["min"],
        //         fat: this.state.five["fat"], 
        //         carbohydrates: this.state.five["carb"],
        //     },{
        //         day: 6,
        //         protein: this.state.six["pro"],
        //         calories:  this.state.six["cal"] - this.state.six["calBurn"],
        //         activity: this.state.six["min"],
        //         fat: this.state.six["fat"], 
        //         carbohydrates: this.state.six["carb"],
        //     },{
        //         day: 7,
        //         protein:  this.state.seven["pro"],
        //         calories:  this.state.seven["cal"] - this.state.seven["calBurn"],
        //         activity: this.state.seven["min"],
        //         fat: this.state.seven["fat"], 
        //         carbohydrates: this.state.seven["carb"],
        //     },
          
        // ]

     
        const help = [1 , 2, 3, 4, 5]
        const colors =['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6']

        const keys = ['activity', 'calories', 'protein' , 'carbohydrates', 'fat']
        const keys1 = ['min', 'cal','calBurn', 'pro' , 'carb', 'fat']

        const screenHeight = Math.round(Dimensions.get('window').height);
        const screenW = Math.round(Dimensions.get('window').width);

        return (


            <View style={{justifyContent: 'center', backgroundColor: '#ecf0f1', height: screenHeight }}>
                <Text onPress={()=>{this.print()}}> WHY </Text>
                <View style={ { flexDirection: 'row', height: 200, width: screenW * 0.95,alignSelf: 'center', backgroundColor: 'white'} }>
                <StackedAreaChart
                    style={ { flex: 1, magin: 10 } }
                    contentInset={ { top: 10, bottom: 10 } }
                    data={ this.state.data }
                    keys={ keys1 }
                    colors={ colors }
                    curve={ shape.curveNatural }
                >
                    <Grid/>
                </StackedAreaChart>
                <YAxis
                    style={ { position: 'absolute', top: 0, bottom: 0 }}
                    data={ StackedAreaChart.extractDataPoints(this.state.data, keys1) }
                    contentInset={ { top: 10, bottom: 10 } }
                    svg={ {
                        fontSize: 8,
                        fill: 'black',
                        stroke: 'black',
                        strokeWidth: 0.1,
                        alignmentBaseline: 'baseline',
                        baselineShift: '3',
                    } }
                />
                <XAxis
                    style={{ marginHorizontal: -10 }}
                    data={ help }
                    contentInset={{ left: 10, right: 10 }}
                    svg={{ fontSize: 10, fill: 'black' }}
                />
             </View>
            </View>
            
        )
    }
}