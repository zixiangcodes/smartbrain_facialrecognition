  onButtonSubmit = () => {
    const { input } = this.state;

    if (!input || !this.isValidURL(input)) {
      alert("There is no image URL given or it's an invalid URL. Please try again!");
      return;
    }

    this.setState({ imageUrl: input }, () => {
      const requestOptions = return_Clarifai_requestOptions(input);

      // fetch("https://api.clarifai.com/v2/models/face-detection/outputs", requestOptions)
      // To fix later on.
      fetch(`http://localhost:3000/api/models/face-detection/outputs`, requestOptions)
        .then(response => response.json())
        .then(result => {
          if (result.outputs && result.outputs[0].data.regions) {
            const box = this.calculateFaceLocation(result);
            this.displayFaceBox(box);

            return fetch(`${BACKEND_URL}/image`, {
              method: 'put',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                id: this.state.user.id
              })
            });
          } else {
            throw new Error('No human face detected in the image.');
          }
        })
        .then(response => response.json())
        .then(count => {
          this.setState(Object.assign(this.state.user, { entries: count }));
        })
        .catch(error => {
          console.log('Error:', error);
        });
    });
  };