import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import SignIn from './components/SignIn/SignIn'
import Particles from 'react-particles-js';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Clarifai from 'clarifai';
import './App.css';

const app = new Clarifai.App({
  apiKey: '8ca60e5fbbb546e2b8e7460d2acb1b2c'
 });

//particles background
const paritclesOptions = {
  particles: {
    number: {
      value: 150,
      density: {
        enable: true,
        value_area: 800,
      }
    }
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      input:'',
      imageUrl:'',
      box: {},
    }
  }

  calculatFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height),
    }
  }

  displayFaceBox = (box) => {
    console.log(box)
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input})
    app.models
    .predict(
    Clarifai.FACE_DETECT_MODEL,
    // URL
    this.state.input
    )
    .then(response => this.displayFaceBox(this.calculatFaceLocation(response)))
    .catch(err => console.log(err));
          // there was an error
  }

  render() {
    return (
      <div className="App">
        <Particles className='particles' params={paritclesOptions} />
        <Navigation />
        <SignIn />
        <Logo />
        <Rank />
        <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />
        <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl} />
      </div>
    );
  }
}

export default App;
