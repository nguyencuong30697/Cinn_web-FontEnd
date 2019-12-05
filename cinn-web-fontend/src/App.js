import React from 'react';
import logo from './logo.svg';
import './App.css';
import {BrowserRouter,Switch,Route} from "react-router-dom";
import HomeScreen from './pages/HomeScreen';
import LoginScreen from './pages/LoginScreen';
import RegisterScreen from './pages/RegisterScreen';

class App extends React.Component {

  state = {
    currentUser: '',
  };

  componentWillMount(){
    const currentUser = window.localStorage.getItem('emailUser');
    this.setState({
      currentUser: currentUser,
    });
  };

  handleLogOut = async (event)=>{
    event.preventDefault();
    //fetch
    try{
      const data = await fetch(`http://localhost:3001/users/logout`,{
          method: 'GET',
          credentials: 'include',
      }).then((res) => {return res.json();});  
      if(!data.success){
          console.log("ERROR");
      }else{
        console.log(data);
          //clear localStorage
          window.localStorage.removeItem('emailUser');
          //Chuyen huong ve trang home
          window.location.href = '/login';
      }
    }catch(error){
      console.log("ERROR");
    } 
  };

  render(){
    return (
      <div className='App'>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <a className="navbar-brand" href="/">Ciin%Web</a>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
  
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            {this.state.currentUser ? ( 
                <span className="navbar-nav mr-auto" style={{display:'flex',alignItems:'center'}}>  
                  Welcome {this.state.currentUser}, <a className="nav-link" onClick={this.handleLogOut}>Logout</a> 
                </span>
               ) : (
                <ul className="navbar-nav mr-auto">
                  <li className="nav-item active">
                    <a className="nav-link" href="/login">Login <span className="sr-only">(current)</span></a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="/register">Register</a>
                  </li>
                </ul>
               )}
            
            <form className="form-inline my-2 my-lg-0">
              <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search"/>
              <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
            </form>
          </div>
        </nav>
      
        <div className="container">
          <BrowserRouter>
            <Switch>
              <Route path='/' exact={true} component={HomeScreen}></Route>
              <Route path='/login' component={LoginScreen}></Route>
              <Route path='/register' component={RegisterScreen}></Route>
            </Switch>
          </BrowserRouter>
        </div>
      </div>
    );
  }
}

export default App;
