import React from 'react'
import './SignIn.css'

class SignIn extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			signInEmail: '',
			signInPassword: ''
		}
	}

	onEmailChange = (event) => {
		this.setState({ signInEmail: event.target.value })
	}

	onPasswordChange = (event) => {
		this.setState({ signInPassword: event.target.value })
	}

	onSubmitSignIn = () => {
		fetch('http://localhost:3000/signin', {
			method: 'post',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				email: this.state.signInEmail,
				password: this.state.signInPassword
			})
		})
			.then(response => response.json())
			.then(user => {
				if (user.id) {
					this.props.loadUser(user)
					this.props.onRouteChange('home');
				}
			})
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