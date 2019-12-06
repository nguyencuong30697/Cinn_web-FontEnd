import React from 'react';
const maxFileSize = 5000000;
const imageFileRegex = /\.(gif|jpg|jpeg|tiff|png)$/i;

class CreatePostScreen extends React.Component {
    state={
        content:'',
        imgUrl:'',
        file: undefined,
        errorMessage:'',
        fileName:'',
    };

    // function handle state when  change value atribute input
    handleOnChangeInput = (attributeName,value)=>{
        this.setState({
            [attributeName]: value,
        });
    }

    //func hanld file when choose file to upload
    handleFileChange = (event) => {
        const file = event.target.files[0];
    
        if (!imageFileRegex.test(file.name)) {
          this.setState({
            errorMessage: 'Invalid image file',
          });
        } else if (file.size > maxFileSize) {
          this.setState({
            errorMessage: 'File too large (Less than 5MB)',
          });
        } else {
          const fileReader = new FileReader();
          fileReader.readAsDataURL(file);
          // se duong goi khi ma convert dc tu file ve base64 string
          fileReader.onload = () => {
            this.setState({
              errorMessage: '',
              file: file,
              fileName: file.name,
              imageUrl: fileReader.result,
            });
          };
        }
      };

    handleOnSubmit = async (event) => {
        event.preventDefault();
        //validate
        if(!this.state.content){
            this.setState({
                errorMessage: 'Please input Content of Post',
            });
        } else if(!this.state.file){
            this.setState({
                errorMessage: 'Please upload file',
            });
        } else {
            this.setState({
                errorMessage: '',
            });
            try{
                //fetch API
                //Gui image len truoc sau do nhan duoc duong link anh, roi moi gui lai len server de luu
                //form data 
                const fromData = new FormData();
                fromData.append('image',this.state.file);
                //upload image
                const uploadResult = await fetch(`http://localhost:3001/uploads/photos`,{
                    method: 'POST',
                    body: fromData,
                    credentials:'include',
                }).then((res)=>{return res.json();});

                //create new post
                await fetch(`http://localhost:3001/posts//create-post`,{
                    method: 'POST',
                    headers: {
                        'Content-Type':'application/json',
                    },
                    body: JSON.stringify({
                        content: this.state.content,
                        imgUrl: uploadResult.data,
                    }),
                    credentials:'include',
                }).then((res)=>{return res.json();});
                
                //back to homepage
                window.location.href = '/';
            }catch(err){
                this.setState({
                    errorMessage: err.message,
                });
            }
        }
    };

    render() {
        return (
            <div className='row'>
                <div className='col-2'></div>
                <div className='col-8'>
                    <form className='mt-5' onSubmit={this.handleOnSubmit}>
                        <div className="form-group row">
                            <label for="content" className="col-sm-2 col-form-label">Content (<span className="text-danger">*</span>)</label>
                            <div className="col-sm-10">
                            <textarea rows={8} 
                                type="text" 
                                className="form-control" 
                                id="content" 
                                placeholder="Write Something"
                                value={this.state.content}
                                onChange={(event)=>{
                                    this.handleOnChangeInput('content',event.target.value);
                                }}
                                />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label for="image" className="col-sm-2 col-form-label">Image (<span className="text-danger">*</span>)       </label>
                            <div className="col-sm-10">
                                <div className="custom-file">
                                    <input type="file" 
                                        className="custom-file-input" 
                                        id="validatedCustomFile"
                                        onChange={this.handleFileChange}/>
                                    <label className="custom-file-label" 
                                            for="validatedCustomFile" 
                                            >Choose Image : {this.state.fileName} </label>
                                </div>
                                {this.state.imageUrl ? (
                                    <div style={{
                                    backgroundImage: `url(${this.state.imageUrl})`,
                                    backgroundRepeat: 'no-repeat',
                                    backgroundSize: 'cover', 
                                    backgroundPosition: 'center',
                                    width: '100%',
                                    height: '400px',
                                    marginTop: '20px',
                                    }}></div>
                                ) : null}
                            </div>
                        </div>
                        {this.state.errorMessage ? (
                                    <div className="alert alert-danger mt-3" role="alert">
                                    {this.state.errorMessage}
                                    </div>
                                ) : null}
                        <div style={{display: 'flex', justifyContent: 'center'}}>
                            <input type='submit' value='Create Post' className='btn btn-primary' />
                        </div>
                    </form>
                </div>
                <div className='col-2'></div>
            </div>
        );
    }
}

export default CreatePostScreen;