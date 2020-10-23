import React from 'react';
import LottieView from 'lottie-react-native';

export default class TradeAnimation extends React.Component{
    render(){
        return(
            <LottieView
            source={require('../assets/10800-retail-exchange.json')}
            style={{width: '70%', alignSelf: 'center'}}
            autoPlay loop />
        )
    }
}