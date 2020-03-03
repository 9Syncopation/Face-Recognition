import React, { Component } from "react";
import Particles from "react-particles-js";
import Signin from "./component/Signin/Signin";
import Register from "./component/Register/Resgister";
import Navigation from "./component/Navigation/Navigation";
import FaceRecognition from "./component/FaceRecognition/FaceRecognition";
import Logo from "./component/logo/Logo";
import ImageLinkedForm from "./component/ImageLinkForm/ImageLinkForm";
import Rank from "./component/Rank/Rank";
import "./App.css";



const ParticlesOptions = {
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
};

const initialState = {
    input: "",
    imageUrl: "",
    box: {},
    route:'signin',
    isSignedIn: false,
    user: {
      id: '',
      email: '',
      name: '',
      entries: 0,
      joined: ''

    }
  }

class App extends Component {
  constructor() {
    super();
    this.state = initialState
    
  }

  loadUser = (data)=> {
    this.setState({user: {
        id: data.id,
        email: data.email,
        name: data.name,
        entries: data.entries,
        joined: data.joined,
    }})
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace= data.outputs[0].data.regions[0].region_info.bounding_box
    console.log('clarifai', clarifaiFace);
    
    const image =document.getElementById('inputimage');
    const width =Number(image.width)
    const height = Number(image.height)
    return{
      left_col: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
        this.setState({box: box})
        // console.log(box);
    }

  onRouteChange = (route)=> {
    if(route === 'signout'){
      this.setState(initialState)
    }else if (route === 'home'){
      this.setState({isSignedIn : true})
    }
    this.setState({route: route})
  }

  onInputChange = event => {
    this.setState({ input: event.target.value });
  };

  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input });
      fetch('https://peaceful-earth-60729.herokuapp.com/imageurl', {
        method: 'post',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify({
          input: this.state.input
        })
      })
      .then(response => response.json())
      .then(response => {
        if (response){
          fetch('https://peaceful-earth-60729.herokuapp.com/image', {
            method: 'put',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user,{entries : count}))
            console.log('count', count);
            console.log('state', this.state.user);
              
            //****  With Spread operator  *****       
              // const data = {...this.state.user, entries: count}
              // this.setState({user: {...this.state.user, entries: count}})
              // console.log('data', data);
            
          })
          .catch(console.log)
        }
        this.displayFaceBox(this.calculateFaceLocation(response))
      })
      .catch(err => console.log('calculateerro', err))
  };
  render() {
    const { isSignedIn, imageUrl, route, box} = this.state
    return (
      <div className="App">
        <Particles className="particles" Parmas={ParticlesOptions} />
        <Navigation isSignedIn={isSignedIn} onRouteChange= {this.onRouteChange}/>
        {route === 'home'
              ?<div>
                  <Logo />
                  <Rank name= {this.state.user.name} entries={this.state.user.entries} />
                  <ImageLinkedForm
                    onInputChange={this.onInputChange}
                    onButtonSubmit={this.onButtonSubmit}
                  />
                  <FaceRecognition imageUrl={imageUrl} box={box} />
                </div>
              :(
                route === 'signin'
                ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
                : <Register loadUser = {this.loadUser} onRouteChange={this.onRouteChange}/>
              )
        }
      </div>
    );
  }
}

export default App;
