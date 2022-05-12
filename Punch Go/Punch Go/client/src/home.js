import React, { Component } from "react";
import "./App.css";
import { Link, NavLink, Redirect, Route, Router, Switch } from "react-router-dom";
let web3 = require('./utils/InitWeb3');
let punchingInstance = require('./eth/punching')
let projects = []
let count_ongoing = 0
let finished = 0
let projects_number = 0
class home extends Component {
    constructor() {
        super()
        this.state = {
            accounts: ''
        }
    }

    componentWillMount = async () => {
        //获取当前的所有地址
        count_ongoing = 0
        finished = 0
        let accounts = await web3.eth.getAccounts()
        let temp = await punchingInstance.methods.getBalance().call()
        temp = await web3.utils.fromWei(temp, 'ether')
        console.log(temp)
        projects_number = await punchingInstance.methods.allpunchingsLength().call()
        let current_time = Date.parse(new Date())
        for (let i = 0; i < projects_number; i++) {
            let project = await punchingInstance.methods.allpunchings(i).call()
            if (project.isSuccess === true) {
                finished += 1
            }
            else {
                count_ongoing += 1
            }
            projects.push(project)
        }
        this.setState({
            // manager: manager,
            accounts: accounts
        })
    };
    render() {
        return (

            <div>
                <nav class="navbar navbar-expand-lg navbar-dark bg-success text-white font-weight-bold">
                    <i className="fas fa-fw fa-2x fa-clock" />
                    <a class="navbar-brand" href="#">Punch Go</a>
                    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>

                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul class="navbar-nav mr-auto">
                            <li class="nav-item active">
                                <Link className="nav-link" to='/home'>
                                    <i className="fas fa-fw fa-home" />
                                    <span>Home</span>
                                </Link>
                            </li>
                            <li class="nav-item">
                                <Link className="nav-link" to='/allpunchings'>
                                    <i className="fas fa-fw fa-calendar" />
                                    <span>All Punches</span>
                                </Link>
                            </li>
                            <li class="nav-item">
                                <Link className="nav-link" to='/createpunching'>
                                    <i className="fas fa-fw fa-calendar-plus" />
                                    <span>initiate a Punch</span>
                                </Link>
                            </li>
                            <li class="nav-item dropdown">
                                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    My punches
                                </a>
                                <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                                    <Link className="dropdown-item" to='/my_launch_punchings'>
                                        {/* <i className="fas fa-fw fa-home" /> */}
                                        <span>Punches Initiated</span>
                                    </Link>
                                    <Link className="dropdown-item" to='/my_joined_punchings'>
                                        {/* <i className="fas fa-fw fa-home" /> */}
                                        <span>Punches Participated</span>
                                    </Link>

                                </div>
                            </li>
                            

                        </ul>
                        <form>
                            {/* className="d-none d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search"> */}
                            <div className="input-group">
                                <input type="text" className="form-control bg-light border-0 small"
                                    placeholder="Search Punches"
                                    aria-label="Search" aria-describedby="basic-addon2" />
                                <div className="input-group-append">
                                    <button className="btn btn-light" type="button">
                                        <i className="fas fa-search fa-sm" />
                                    </button>
                                </div>
                            </div>
                        </form>
                        <a class="nav-item dropdown ml-3
                        ">
                             <img className="img-profile rounded-circle dropdown-toggle"  src="img/man.svg" width="30px" id="navbarDropdown1" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"/>
                            
                            
                                
                            {/* <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    User Info
                                </a> */}
                            <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown1">
                                <Link className="dropdown-item" to='/my_launch_punchings'>
                                    {/* <i className="fas fa-fw fa-home" /> */}
                                    <span className="mr-2 d-none d-lg-inline text-gray-600 small">
                                        Current Account Address：{this.state.accounts[0]}</span>
                                </Link>

                            </div>
                        </a>
                        

                    </div>
                </nav>
                <div id="wrapper" style={{height:'800px'}}>


                    

                    <div id="content-wrapper" className="d-flex flex-column">


                        <div id="content" className="pt-3">

                            

                            <div className="container-fluid">


                                <div className="d-sm-flex align-items-center justify-content-between mb-4">
                                    <h1 className="h3 mb-0 text-gray-800">Overview</h1>
                                    <a href="#" className="d-none d-sm-inline-block btn btn-sm btn-success shadow-sm"><i
                                        className="fas fa-download fa-sm text-white-50" />导出报告</a>
                                </div>

                                <div className="row">
                                    <div className="col-xl-4 col-md-6 mb-4">
                                        <div className="card border-left-success shadow h-100 py-2">
                                            <div className="card-body">
                                                <div className="row no-gutters align-items-center">
                                                    <div className="col mr-2">
                                                        <div
                                                            className="text-xs font-weight-bold text-success text-uppercase mb-1">
                                                            Number of All Punches
                                                        </div>
                                                        <div className="h5 mb-0 font-weight-bold text-gray-800">{projects_number}</div>
                                                    </div>
                                                    <div className="col-auto">
                                                        <i className="fas fa-list fa-2x text-gray-300" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                    <div className="col-xl-4 col-md-6 mb-4">
                                        <div className="card border-left-info shadow h-100 py-2">
                                            <div className="card-body">
                                                <div className="row no-gutters align-items-center">
                                                    <div className="col mr-2">
                                                        <div
                                                            className="text-xs font-weight-bold text-info text-uppercase mb-1">Number of Finished Punches
                                                        </div>
                                                        <div className="row no-gutters align-items-center">
                                                            <div className="col-auto">
                                                                <div
                                                                    className="h5 mb-0 mr-3 font-weight-bold text-gray-800">{finished}
                                                                </div>
                                                            </div>
                                                            <div className="col">
                                                                <div className="progress progress-sm mr-2">
                                                                    <div className="progress-bar bg-info" role="progressbar"
                                                                        style={{ width: (finished / projects_number) * 100 + '%' }} aria-valuenow="50"
                                                                        aria-valuemin="0"
                                                                        aria-valuemax="100" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-auto">
                                                        <i className="fas fa-check-circle fa-2x text-gray-300" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                    <div className="col-xl-4 col-md-6 mb-4">
                                        <div className="card border-left-warning shadow h-100 py-2">
                                            <div className="card-body">
                                                <div className="row no-gutters align-items-center">
                                                    <div className="col mr-2">
                                                        <div
                                                            className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                                                            Number of Ongoing Punches
                                                        </div>
                                                        <div className="h5 mb-0 font-weight-bold text-gray-800">{count_ongoing}</div>
                                                    </div>
                                                    <div className="col-auto">
                                                        <i className="fas fa-spinner fa-2x text-gray-300" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>




                            </div>


                        </div>



                        <footer className="sticky-footer bg-white">
                            <div className="container my-auto">
                                <div className="copyright text-center my-auto">
                                    <span>Copyright &copy; CU 2022</span>
                                </div>
                            </div>
                        </footer>


                    </div>


                </div>
                <script src="vendor/jquery/jquery.min.js" />
                <script src="vendor/bootstrap/js/bootstrap.bundle.min.js" />
                <script src="vendor/jquery-easing/jquery.easing.min.js" />
                <script src="js/sb-admin-2.min.js" />
                <script src="vendor/chart.js/Chart.min.js" />
                <script src="js/demo/chart-area-demo.js" />
                <script src="js/demo/chart-pie-demo.js" />
            </div>
        );
    }
}

export default home;
