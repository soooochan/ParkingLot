import React from 'react';
import "../styles/Home.css";
import {useNavigate} from 'react-router-dom';

function withNavigation(Component) {
  return function (props) {
    const navigate = useNavigate();
    return <Component {...props} navigate={navigate} />;
  };
}

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    };
   
  }
 

  handleSubmit = (e) => {
    e.preventDefault();
    const { username, password } = this.state;
    console.log(`Username: ${username}, Password: ${password}`);
    // 로그인 로직 처리, 예를 들어 API 호출 등
  }

  handleChange = (e) => {
    const { id, value } = e.target;
    this.setState({
      [id]: value
    });
  }
 
  goToSign = () => {
    this.props.navigate('/parkinglot');
  }

  render() {
    const { username, password } = this.state;

    return (
      <div >

        <form onSubmit={this.handleSubmit}>
          <h2>로그인</h2>
          <div>
        
            <label htmlFor="username">Username: </label>
            <input 
              type="text"
              id="username"
              value={username}
              onChange={this.handleChange}
            />
          </div>
          <div>
            <label htmlFor="password">Password: </label>
            <input 
              type="password"
              id="password"
              value={password}
              onChange={this.handleChange}
            />
          </div>
          <button type="submit"  onClick={this.goToSign}>Login</button>
        </form>
      </div>
    );
  }
}

export default withNavigation(Home);