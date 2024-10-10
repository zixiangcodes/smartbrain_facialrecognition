import React from 'react'
import './SignIn.css'

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3000';

class SignIn extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			signInEmail: '',
			signInPassword: '',
			error: null
		}
	}

	onEmailChange = (event) => {
		this.setState({ signInEmail: event.target.value })
	}

	onPasswordChange = (event) => {
		this.setState({ signInPassword: event.target.value })
	}

	onSubmitSignIn = () => {
		console.log('Attempting to sign in with:', this.state);

		fetch(`${BACKEND_URL}/signin`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				email: this.state.signInEmail,
				password: this.state.signInPassword
			}),
			credentials: 'include'
		})
			.then(response => {
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				return response.json();
			})
			.then(user => {
				if (user.id) {
					this.props.loadUser(user)
					this.props.onRouteChange('Home');
				} else {
					this.setState({ error: 'Failed to sign in. Please check your credentials.' });
				}
			})
			.catch(error => {
				console.error('Error:', error);
				this.setState({ error: `An error occurred while signing in: ${error.message}` });
			});
	}

	render() {
		const { onRouteChange } = this.props;
		return (
			<article className="signin-container">
				<main className="signin-main">
					<div className="signin-form">
						<fieldset id="sign_up">
							<legend>Sign In</legend>
							<div className="form-group">
								<label htmlFor="email-address">Email</label>
								<input
									type="email"
									name="email-address"
									id="email-address"
									onChange={this.onEmailChange}
								/>
							</div>
							<div className="form-group">
								<label htmlFor="password">Password</label>
								<input
									type="password"
									name="password"
									id="password"
									onChange={this.onPasswordChange}
								/>
							</div>
						</fieldset>
						<div className="signin-button">
							<input
								onClick={this.onSubmitSignIn}
								type="submit"
								value="Login" />
						</div>
						{this.state.error && <p className="error-message">{this.state.error}</p>}
						<div className="register-link">
							<p onClick={() => onRouteChange('register')}>Register</p>
						</div>
					</div>
				</main>
			</article>
		);
	}
}

export default SignIn;