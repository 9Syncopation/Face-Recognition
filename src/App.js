import React, { Component } from "react";
import Clarifai from "clarifai";
import Particles from "react-particles-js";
import Navigation from "./component/Navigation/Navigation";
import FaceRecognition from "./component/FaceRecognition/FaceRecognition";
import Logo from "./component/logo/Logo";
import ImageLinkedForm from "./component/ImageLinkForm/ImageLinkForm";
import Rank from "./component/Rank/Rank";
import "./App.css";

const app = new Clarifai.App({
  apiKey: "279fa7ebdceb4e7ca6a94e313cee1a3e"
});

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

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: "",
      imageUrl: "",
      box: {}
    };
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
        console.log(box);
        
  }

  onInputChange = event => {
    this.setState({ input: event.target.value });
  };

  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input });
    app.models
      .predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
      .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
      .catch(err => console.log(err))
  };
  render() {
    return (
      <div className="App">
        <Particles className="particles" Parmas={ParticlesOptions} />
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkedForm
          onInputChange={this.onInputChange}
          onButtonSubmit={this.onButtonSubmit}
        />
        <FaceRecognition imageUrl={this.state.imageUrl} box={this.state.box} />
      </div>
    );
  }
}

export default App;
