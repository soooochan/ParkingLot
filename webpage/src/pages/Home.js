import React, {Fragment} from 'react';
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
      <Fragment>
          <div className="home-content">
            <img
              src="/img/parking.png"
              alt="logo"
              className="home-img"
            />
            <form onSubmit={this.handleSubmit} className="home-select-box">
                    <h2>주차장 입력</h2>
                    <div>
                  
                      <label htmlFor="username"> 주차장을 입력하세요!!! </label>
                      <input 
                        type="text"
                        id="username"
                        value={username}
                        onChange={this.handleChange}
                      />
                    </div>
                  { /*<div>
                      <label htmlFor="password">Password: </label>
                      <input 
                        type="password"
                        id="password"
                        value={password}
                        onChange={this.handleChange}
                      />
    </div>*/}
                <button type="submit"  onClick={this.goToSign}>Submit</button>
              </form>
          </div>
    </Fragment>
    
    );
  }
}

export default withNavigation(Home);