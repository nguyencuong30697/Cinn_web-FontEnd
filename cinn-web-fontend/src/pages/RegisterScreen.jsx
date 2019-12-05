import React from 'react';
const emailRegex =  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,10}$/;

class RegisterScreen extends React.Component{
    state = {
        email: '',
        password: '',
        confirmPass: '',
        fullName: '',
        errorMessage: '',
        isSuccess: false,
        counter: 3,
        loading: false,
    };

    // function handle state when  change value atribute input
    handleOnChangeInput = (attributeName,value)=>{
        this.setState({
            [attributeName]: value,
        });
    };

    handleOnSubmit = async (event)=>{
        event.preventDefault();
        //validate
        if(!emailRegex.test(this.state.email)){
            this.setState({
                errorMessage: 'Invalid Email Address',
            });
        } else if(!passwordRegex.test(this.state.password)){
            this.setState({
                errorMessage: 'Invalid Password',
            });
        } else if(this.state.password !== this.state.confirmPass){
            this.setState({
                errorMessage: `Confirm Password Didn't Match`,
            });
        } else if(!this.state.fullName){
            this.setState({
                errorMessage: 'Please Input FullName',
            });
        } else {
            // validate oke
            this.setState({
                errorMessage: '',
            });
            //fetch
            try{
                this.setState({
                    loading: true,
                });
                const data = await fetch(`http://localhost:3001/users/register`,{
                    method: 'POST',
                    headers: {
                        'Content-Type':'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        email: this.state.email,
                        password: this.state.password,
                        fullName: this.state.fullName,
                    }),
                }).then((res) => {return res.json();});  
                if(!data.success){
                    this.setState({
                        errorMessage: data.message,
                    });
                }else{
                    this.setState({
                        isSuccess: true,
                        loading: false,
                    });
                    setTimeout(()=>{
                        this.setState({
                            counter: 2,
                        });
                    },1000);
                    setTimeout(()=>{
                        this.setState({
                            counter: 1,
                        });
                    },2000);
                    setTimeout(()=>{
                        this.setState({
                            counter: 0,
                        });
                        window.location.href = '/login';
                    },3000);
                }
                console.log(data);
            }catch(error){
                this.setState({
                    errorMessage: error.message,
                    loading:false,
                });
            }
        }
    };

    render(){
        return(
            <div className='row'>
                <div className='col-4'></div>
                <div className='col-4'>
                    <h2 style={{marginTop:'50px', textAlign:'center'}}>Register Account</h2>
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
                    <div className="form-group">
                        <label for="exampleInputPassword2">Confirm Password</label>
                        <input type="password" 
                        className="form-control" 
                        id="exampleInputPassword2" 
                        placeholder="Confirm Password"
                        value={this.state.confirmPass}
                        onChange={(event)=>{
                            this.handleOnChangeInput('confirmPass',event.target.value);
                        }}/>
                    </div>
                    <div className="form-group">
                        <label for="exampleInputFullName">Full Name</label>
                        <input type="text" 
                        className="form-control" 
                        id="exampleInputFullName" 
                        placeholder="Full Name"
                        value={this.state.fullName}
                        onChange={(event)=>{
                            this.handleOnChangeInput('fullName',event.target.value);
                        }}/>
                    </div>
                    
                    {this.state.errorMessage ? (
                        <div className="alert alert-danger" role="alert">
                            {this.state.errorMessage}
                        </div>
                    ) : null}

                    {this.state.isSuccess ? (
                        <div className="alert alert-success" role="alert">
                            Login success, redirect in {this.state.counter}s
                        </div>
                    ) : null}

                    {this.state.loading ? (
                        <div className="d-flex justify-content-center">
                            <div className="spinner-border" role="status">
                            <span className="sr-only">Loading...</span>
                            </div>
                        </div>
                    ) : (
                        <div style={{display:'flex',justifyContent:'center'}}>
                            <button type="submit" className="btn btn-outline-success btn-lg">Register</button>
                        </div>
                    )}
                    
                    </form>
                </div>
                <div className='col-4'></div>
            </div>
        );
    }
}

export default RegisterScreen;
