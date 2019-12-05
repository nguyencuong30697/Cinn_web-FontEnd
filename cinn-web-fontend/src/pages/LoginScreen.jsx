import React from 'react';
const emailRegex =  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,10}$/;

class LoginScreen extends React.Component{
    state = {
        email: '',
        password: '',
        errorMessage: '',
        loading: true,
    };

    // function handle state when  change value atribute input
    handleOnChangeInput = (attributeName,value)=>{
        this.setState({
            [attributeName]: value,
        });
    }

    handleOnSubmit = async (event)=>{
        event.preventDefault();
        //validate
        try{
            this.setState({
                loading: true,
            });
            const data = await fetch(`http://localhost:3001/users/login`,{
                method: 'POST',
                headers: {
                    'Content-Type':'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    email: this.state.email,
                    password: this.state.password,
                }),
            }).then((res) => {return res.json();});  
            if(!data.success){
                this.setState({
                    errorMessage: data.message,
                });
            }else{
                this.setState({
                    loading: false,
                });
                //save data into Local Storage
                window.localStorage.setItem('emailUser',data.data.email);
                //Chuyen huong ve trang home
                window.location.href = '/';
            }
        }catch(error){
            this.setState({
                errorMessage: error.message,
                loading:false,
            });
        }       
    }

    render(){
        return(
            <div className='row'>
                <div className='col-4'></div>
                    <div className='col-4'>
                        <h2 style={{marginTop:'50px', textAlign:'center'}}>Login Account</h2>
                        <form style={{marginTop:'50px'}} onSubmit={this.handleOnSubmit}>
                            <div className="form-group">
                                <label for="exampleInputEmail1">Email address</label>
                                <input 
                                type="text" 
                                className="form-control" 
                                id="exampleInputEmail1" 
                                aria-describedby="emailHelp" 
                                placeholder="Enter email"
                                value={this.state.email}
                                onChange={(event)=>{
                                    this.handleOnChangeInput('email',event.target.value);
                                }}/>
                            </div>
                            <div className="form-group">
                                <label for="exampleInputPassword1">Password</label>
                                <input type="password" 
                                className="form-control" 
                                id="exampleInputPassword1" 
                                placeholder="Password"
                                value={this.state.password}
                                onChange={(event)=>{
                                    this.handleOnChangeInput('password',event.target.value);
                                }}/>
                            </div>
                            {this.state.errorMessage ? (
                                <div className="alert alert-danger" role="alert">
                                    {this.state.errorMessage}
                                </div>
                            ) : null}
                            <div style={{display:'flex',justifyContent:'center'}}>
                            <button type="submit" className="btn btn-info btn-lg">Login</button>
                        </div>
                        </form>  
                    </div>  
                <div className='col-4'></div>
            </div>
        );
    };
}

export default LoginScreen;