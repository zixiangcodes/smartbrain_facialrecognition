// Imports React
import React, { Component } from 'react';

// Imports Particle Effects:
import ParticlesBg from 'particles-bg'
// import Particles from 'react-particles-js'; DEPRECATED + ERROR

// Imports Face Recognition
// import Clarifai from 'clarifai';

// Imports components or partials (like from RoR)
import FaceRecognition from './components/FaceRecognition/FaceRecognition'
import Navigation from './components/Navigation/Navigation';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';

// CSS
import './App.css';

// Dynamically adjusts which port or link the backend URL is coming from
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3000';

// const app = new Clarifai.App({
//   apiKey: '9465cf85f14b46bc90e329eb6ef9546a'
// });

const return_Clarifai_requestOptions = (imageUrl) => {
  // # Your PAT (Personal Access Token) can be found in the Account's Security section
  const PAT = "31d9704946384890b4a3e14dcf1df8db";
  // # Specify the correct user_id/app_id pairings. Since you're making inferences outside your app's scope
  const USER_ID = "jj0sxw2xfk96";
  const APP_ID = "test";

  // Change these to whatever model and image URL you want to use

  // # eg : MODEL_ID = 'general-image-detection'
  // const MODEL_ID = 'face-detection';
  // # You can also set a particular model version by specifying the version ID
  // const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';

  // #  Model class objects can be inititalised by providing its URL or also by defining respective user_id, app_id and model_id
  // # eg : model = Model(user_id="clarifai", app_id="main", model_id=MODEL_ID)

  // model_url = "https://clarifai.com/clarifai/main/models/face-detection"
  // detector_model = Model(
  //   url = model_url,
  //   pat = "31d9704946384890b4a3e14dcf1df8db",
  // )

  // # The predict API gives flexibility to generate predictions for data provided through URL,Filepath and bytes format.

  // # Example for prediction through Bytes:
  // # model_prediction = model.predict_by_bytes(input_bytes, input_type="image")

  // # Example for prediction through Filepath:
  // # model_prediction = Model(model_url).predict_by_filepath(filepath, input_type="image")

  const raw = JSON.stringify({
    "user_app_id": {
      "user_id": USER_ID,
      "app_id": APP_ID
    },
    "inputs": [
      {
        "data": {
          "image": {
            "url": imageUrl
          }
        }
      }
    ]
  });

  ///////////////////////////////////////////////////////////////////////////////////
  // YOU DO NOT NEED TO CHANGE ANYTHING BELOW THIS LINE TO RUN THIS EXAMPLE
  ///////////////////////////////////////////////////////////////////////////////////

  const requestOptions = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Authorization': 'Key ' + PAT
    },
    body: raw
  };

  return requestOptions;
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'SignIn',
      // Note: Change this to 'Home' for testing only. Actual route is 'SignIn'..
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        password: '',
        email: '',
        entries: 0,
        joined: ''
      }
    }
  }

  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
      }
    })
  }

  /*
  // old version
  componentDidMount() {
    fetch('http://localhost:3000')
    fetch(`${BACKEND_URL}`)
      .then(response => response.json())
      .then(data => console.log(data))
  }
  */

  componentDidMount() {
    fetch(`${BACKEND_URL}`)
      .then(response => {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          return response.json().then(data => ({ data, isJson: true }));
        } else {
          return response.text().then(text => ({ data: text, isJson: false }));
        }
      })
      .then(({ data, isJson }) => {
        if (isJson) {
          console.log('Received JSON data:', data);
          // Handle your JSON data here
        } else {
          console.log('Received non-JSON response:', data);
          // Handle your non-JSON response here
        }
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  // old working code
  onImageLoad = (imageUrl) => {
    if (imageUrl) {
      fetch("https://api.clarifai.com/v2/models/face-detection/outputs", return_Clarifai_requestOptions(imageUrl))
        .then(response => response.json())
        .then(result => {
          if (result.outputs && result.outputs[0].data.regions) {
            const box = this.calculateFaceLocation(result);
            this.displayFaceBox(box);
          }
        })
        .catch(error => console.log('error', error));
    }
  }

  // Experimental Change
  // onImageLoad = (imageUrl) => {
  //   if (imageUrl) {
  //     fetch(`${BACKEND_URL}/api/detect-face`, {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ imageUrl: imageUrl })
  //     })
  //       .then(response => response.json())
  //       .then(result => {
  //         if (result.outputs && result.outputs[0].data.regions) {
  //           const box = this.calculateFaceLocation(result);
  //           this.displayFaceBox(box);

  //           // Update entry count
  //           fetch(`${BACKEND_URL}/image`, {
  //             method: 'PUT',
  //             headers: { 'Content-Type': 'application/json' },
  //             body: JSON.stringify({ id: this.state.user.id })
  //           })
  //             .then(response => response.json())
  //             .then(count => {
  //               this.setState(Object.assign(this.state.user, { entries: count }))
  //             })
  //             .catch(console.log)
  //         }
  //       })
  //       .catch(error => console.log('Error detecting face:', error));
  //   }
  // }


  displayFaceBox = (box) => {
    console.log(box);
    this.setState({ box: box });
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  }

  // In your onButtonSubmit method (really old):
  // onButtonSubmit = () => {
  //   const { input } = this.state;

  //   if (!input || !this.isValidURL(input)) {
  //     alert("There is no image URL given or it's an invalid URL. Please try again!");
  //     return;
  //   }

  //   this.setState({ imageUrl: input }, () => {
  //     fetch(`${BACKEND_URL}/api/models/face-detection/outputs`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json'
  //         // Remove the Authorization header from here
  //       },
  //       body: JSON.stringify({
  //         "inputs": [
  //           {
  //             "data": {
  //               "image": {
  //                 "url": input
  //               }
  //             }
  //           }
  //         ]
  //       })
  //     })
  //       .then(response => {
  //         if (!response.ok) {
  //           throw new Error(`HTTP error! status: ${response.status}`);
  //         }
  //         return response.json();
  //       })
  //       .then(result => {
  //         if (result.outputs && result.outputs[0].data.regions) {
  //           const box = this.calculateFaceLocation(result);
  //           this.displayFaceBox(box);

  //           return fetch(`${BACKEND_URL}/image`, {
  //             method: 'post',
  //             headers: { 'Content-Type': 'application/json' },
  //             body: JSON.stringify({
  //               id: this.state.user.id
  //             })
  //           });
  //         } else {
  //           throw new Error('No human face detected in the image.');
  //         }
  //       })
  //       .then(response => response.json())
  //       .then(count => {
  //         this.setState(Object.assign(this.state.user, { entries: count }));
  //       })
  //       .catch(error => {
  //         console.error('Error:', error);
  //         alert(`Error: ${error.message}`);
  //       });
  //   });
  // };

  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input });
    fetch(`${BACKEND_URL}/api/detect-face`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        imageUrl: this.state.input
      })
    })
      .then(response => response.json())
      .then(result => {
        if (result && result.outputs) {
          fetch(`${BACKEND_URL}/image`, {
            method: 'POST',
            // previously was 'put'
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
            .then(response => response.json())
            .then(count => {
              console.log('Received count:', count);
              this.setState(Object.assign(this.state.user, { entries: count }))
            })
            .catch(console.log)

          this.displayFaceBox(this.calculateFaceLocation(result))
        }
      })
      .catch(error => console.log('error', error));
  }

  // Experimental code
  // onButtonSubmit = () => {
  //   this.setState({ imageUrl: this.state.input }, () => {
  //     this.onImageLoad(this.state.imageUrl);
  //   });
  // }

  // Utility function to check if the input is a valid URL
  isValidURL = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }

  // Incorrect version (to learn from it)
  // onRouteChange = (route) => {
  //   if (route === 'signout') {
  //     this.setState({ isSignedIn: false })
  //   } else if (route === 'Home') {
  //     this.setState({ isSignedIn: true })
  //   }
  //   this.setState({ route: route });
  // }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({ isSignedIn: false })
      this.setState({ route: 'SignIn' }); // Change this line
    } else if (route === 'Home') {
      this.setState({ isSignedIn: true })
    }
    if (route !== 'signout') {
      this.setState({ route: route });
    }
  }

  // New method to clear the image
  clearImage = () => {
    this.setState(
      {
        input: '',
        imageUrl: '',
        box: {},
      },
      () => {
        console.log("Previous image has been successfully cleared!");
        alert("Previous image has been successfully cleared!");
      }
    );
  }

  render() {
    const { isSignedIn, imageUrl, route, box, input } = this.state;
    return (
      <div className="App">
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        <ParticlesBg className='particles' type="circle" bg={true} />
        <div className="app-content">
          {route === 'Home'
            ? <div>
              <Logo />
              <Rank name={this.state.user.name} entries={this.state.user.entries} />
              <ImageLinkForm
                input={input}
                onInputChange={this.onInputChange}
                onButtonSubmit={this.onButtonSubmit}
              />
              <button onClick={this.clearImage} className="clear-button">Clear Image</button>
              <FaceRecognition box={box} imageUrl={imageUrl} onImageLoad={this.onImageLoad} />
              {/* <FaceRecognition box={box} imageUrl={imageUrl} /> */}
            </div>
            : (
              <div className="auth-container">
                {route === 'SignIn'
                  ? <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
                  : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
                }
              </div>
            )
          }
        </div>
      </div >
    );
  }
}

export default App;