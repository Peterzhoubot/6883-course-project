import React, { Component } from "react";
import { Link } from "react-router-dom";
let punchingInstance = require('./eth/punching')
let web3 = require('./utils/InitWeb3');
let project = {}
let projects = []
let ddl = ''
let style = ''
let state = ''
let indexes = []
class my_joined_punchings extends React.Component {
    constructor() {
        super()
        this.state = {
            accounts: ''
        }
    }
    Is_complete_style(id) {
        project = projects[id]
        ddl = project.deadline
        let current_time = Date.parse(new Date())
        if (project.isSuccess === true) {
            style = "badge badge-info ml-3"
        }
        else {
            if (ddl - current_time >= 0) {
                style = "badge badge-warning ml-3"
            }
            else {
                style = "badge badge-secondary ml-3"
            }
        }
        return style
    }
    Is_complete(id) {
        project = projects[id]
        ddl = project.deadline
        let current_time = Date.parse(new Date())
        if (project.isSuccess === true) {
            state = "Finished"
        }
        else {
            if (ddl - current_time >= 0) {
                state = "Ongoing"
            }
            else {
                state = "Expired"
            }
        }
        return state
    }
    componentWillMount = async () => {
        projects = [] //清空数组
        //获取当前的所有地址
        let accounts = await web3.eth.getAccounts()
        let projects_number = await punchingInstance.methods.allpunchingsLength().call()
        for (let i = 0; i < projects_number; i++) {
            let project = await punchingInstance.methods.allpunchings(i).call()
            let money = await punchingInstance.methods.getMypunchings(i).call({
                from: accounts[0]
            })
            if (money > 0) {
                console.log(i)
                indexes.push(i)
                projects.push(project)
            }
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
                            <li class="nav-item ">
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
                            <li class="nav-item dropdown active">
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
                            <img className="img-profile rounded-circle dropdown-toggle" src="img/man.svg" width="30px" id="navbarDropdown1" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" />



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
                <div id="wrapper" className="pt-4" style={{height:"800px"}}>


                    <div id="content-wrapper" className="d-flex flex-column">
                        <div id="content">
                           

                            <div className="container-fluid">
                                <div >

                                    <div className="row">
                                        {
                                            (projects.length === 0)
                                                ? null
                                                : projects.map((item, index) => {
                                                    return (
                                                        <div className="card col-4 m-2 mb-4 py-3 border-left-warning">
                                                            <div className="card-body">
                                                                Activity Name： {item.title}
                                                                <span
                                                                    className={this.Is_complete_style(index)}>{this.Is_complete(index)}</span>
                                                                
                                                            </div>
                                                            <div className="card-body">
                                                                <Link className="btn btn-info" 
                                                                    to={{ pathname: '/my_joined_punching_detail/' + indexes[index] }}>View Details</Link>
                                                            </div>

                                                        </div>
                                                    )
                                                }, this)
                                        }

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
                );
    }
}

                export default my_joined_punchings;