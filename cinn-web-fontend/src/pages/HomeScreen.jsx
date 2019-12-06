import React from 'react';
const pageSize = 6;

class HomeScreen extends React.Component{
    
    state = {
        data: [],
        total: 0,
        currentPageNumber: 1,
    }

    componentWillMount(){
        this.getData(1); // load cai thi hien phan trang dau tien
    };

    getData = async (pageNumber) => {
        try{
            const result = await fetch(`http://localhost:3001/posts/getListPosts/pagination?pageNumber=${pageNumber}&pageSize=${pageSize}`,{
                method:'GET',
                headers:{
                    'Content-Type':'application/json',
                },
                credentials:'include',
            }).then((res)=>{return res.json();})
            this.setState({
                data: result.data.data,
                total: result.data.total,
            });

        }catch(error){
            window.alert(error.message);
        }
    };

    handlePageChange = (newPageNumber) =>{
        // getData
        this.getData(newPageNumber);
        //set currentPageNumber
        this.setState({
            currentPageNumber: newPageNumber,
        });
    };

    handlePrecious = ()=>{
        if(this.state.currentPageNumber > 1){
            // getData
            this.getData(this.state.currentPageNumber-1);
            //set currentPageNumber
            this.setState({
                currentPageNumber: this.state.currentPageNumber - 1,
            });
        }else{

        }
    }

    handleNext = ()=>{
        if(this.state.currentPageNumber<Math.ceil(this.state.total / pageSize)){
            // getData
            this.getData(this.state.currentPageNumber+1);
            //set currentPageNumber
            this.setState({
                currentPageNumber: this.state.currentPageNumber + 1,
            });
        }else{

        }
    }

    render(){
        const maxPageNumber = Math.ceil(this.state.total / pageSize);
		const paginations = [];
		for (let i = 0; i < maxPageNumber; i += 1) {
			paginations.push(i + 1);
		}


        return(
            <div>
                <div className='row'>
                    {this.state.data.map((item)=>{
                        return (
                            <div className="col-4 mt-4" key={item._id}>
                                <div className="card">
                                    <div
                                        className="card-img-top"
                                        style={{
                                            backgroundImage: `url(http://localhost:3001${item.imgUrl})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            backgroundRepeat: 'no-repeate',
                                            height: '350px',
                                            width: 'auto'
                                        }}
                                    ></div>
                                    <div className="card-body">
                                        <h5 className="card-title">{item.author.fullName}</h5>
                                        <p
                                            className="card-text"
                                            style={{
                                                height: '50px',
                                                textOverflow: 'ellipsis',
                                                overflow: 'hidden'
                                            }}
                                        >
                                            {item.content}
                                        </p>
                                        <a href="#" className="btn btn-primary">
                                            More Information
                                        </a>
                                    </div>
                                </div>
                            </div>
                        );    
                    })}
                </div>
                <nav aria-label="Page navigation example">
                <ul className="pagination" style={{float:'right',marginTop:'30px'}}>
                <li className="page-item">
                    <a className="page-link" aria-label="Previous" onClick={this.handlePrecious} >
                    <span aria-hidden="true">&laquo;</span>
                    </a>
                </li>
                {paginations.map(item => {
							const isActive = item === this.state.currentPageNumber; // check xem cai item day co dang la cai trang hien tai khong
							let classNameValue = '';
							if (isActive) {
								classNameValue = 'page-item active'; // Danh dau la dang o trang nay
							} else {
								classNameValue = 'page-item';
							}
							return (
								<li className={classNameValue} key={item}>
									<a className="page-link"
										onClick={() => {
											this.handlePageChange(item);
										}} 
                                    >
										{item}
									</a>
								</li>
							);
						})}
                <li className="page-item">
                    <a className="page-link" onClick={this.handleNext} aria-label="Next">
                    <span aria-hidden="true">&raquo;</span>
                    </a>
                </li>
                </ul>
                </nav>
            </div>
        );
    };
}

export default HomeScreen;