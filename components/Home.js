import React, { Component } from 'react';
import {
    Header,
    Container,
    Title,
    Content, 
    Spinner
  } from 'native-base';
import Dataset from 'impagination';
import RobotItem from './RobotItem';

export default class Home extends Component {
    constructor(props){
        super(props);
        this.state = {
            dataset: null, 
            datasetState: null
        }
    }
    setupImpagination(){
        let dataset = new Dataset({
            pageSize: 15, 
            // Anytime there's a new state emitted, we want to set that on
            // the componets local state.
            observe: (datasetState) => {
                this.setState({datasetState});
            },
            //where to fetch data from.
            fetch(pageOffset, pageSize, stats){
                return fetch(`https://serene-beach-38011.herokuapp.com/api/faker?page=${pageOffset + 1}&per_page=${pageSize}`)
                    .then(response => response.json())
                    .catch((error) => {
                        console.error(error);
                    });
            }
        });
        //Set the readOffset to the first record in the state
        dataset.setReadOffset(0);
        this.setState({dataset});
    }
    componentWillMount() {
        this.setupImpagination();
    }

    setCurrentReadOffset = (event) => {
        let itemHeight = 402;
        let currentOffset = Math.floor(event.nativeEvent.contentOffset.y);
        let currentItemIndex = Math.ceil(currentOffset / itemHeight);
        this.state.dataset.setReadOffset(currentItemIndex);
    }

    renderItem(){
        return this.state.datasetState.map(record => {
            if(!record.isSettled){
                return <Spinner key={Math.random()}/>
            }
            return <RobotItem record={record} key={record.content.id}/>
        });
    }

    render() {
        return (
        <Container>
            <Header>
            <Title>Robot Impagination</Title>
            </Header>
            <Content scrollEventThrottle={300} onScroll={this.setCurrentReadOffset}>
                {this.renderItem()}
            </Content>
        </Container>
        );
    }
  }