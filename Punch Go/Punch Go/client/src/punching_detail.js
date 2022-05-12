import React, { Component } from "react";
import { Link } from "react-router-dom";
let punchingInstance = require('./eth/punching')
let web3 = require('./utils/InitWeb3');
let project = {}
let state = ''
let ddl = ''
class punching_detail extends React.Component {
    constructor() {
        super();
        this.state = {
            accounts: '',
            money: 0
        }
        this.handleChange = this.handleChange.bind(this);
        this.up = this.up.bind(this);
    }
    handleChange(event) {
        // 读取输入的值
        const name = event.target.name;
        const value = event.target.value;
        //   更新状态
        this.setState({
            [name]: value
        })
    }
    componentWillMount = async () => {
        project = {} //清空数组
        //获取当前的所有地址
        project = await punchingInstance.methods.allpunchings(this.props.match.params.id).call()
        project.usedMoney = web3.utils.fromWei(project.usedMoney, 'ether')
        project.goalMoney = web3.utils.fromWei(project.goalMoney, 'ether');
        project.raisedMoney = web3.utils.fromWei(project.raisedMoney, 'ether')
        console.log(project)
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
        ddl = (new Date(parseInt(ddl))).toLocaleDateString()
        let accounts = await web3.eth.getAccounts()
        this.setState({
            // manager: manager,
            accounts: accounts
        })
    };
    async up() {
        if (this.state.money === 0) {
            alert('Amount must be larger than 0!')
        }
        else {
            if (this.state.money > (project.goalMoney - project.raisedMoney)) {
                alert('You can deposit no more than' + (project.goalMoney - project.raisedMoney) + "eth")
            }
            else {
                await punchingInstance.methods.contribute(this.props.match.params.id).send({
                    from: this.state.accounts[0],
                    value: web3.utils.toWei(this.state.money, 'ether')
                })
                alert('Thank you for your participating!')
            }
        }
    }
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
                            <li class="nav-item active">
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
                            <img className="img-profile rounded-circle dropdown-toggle" src="img/man.svg" width="30px" id="navbarDropdown1" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" />



                            {/* <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    User Info
                                </a> */}
                            <div class="dropdown-menu dropdown-menu-right" >
                                <Link className="dropdown-item" to='/my_launch_punchings'>
                                    {/* <i className="fas fa-fw fa-home" /> */}
                                    {/* <span className="mr-2 d-none d-lg-inline text-gray-600 small">
                                        Current Account Address：{this.state.accounts[0]}</span> */}
                                </Link>

                            </div>
                        </a>


                    </div>
                </nav>
                <div id="wrapper">

                    

                    <div id="content-wrapper" className="d-flex flex-column">


                        <div id="content">

                            

                            <div class="container-fluid">
                                <div className="card shadow mb-4">
                                    <div className="card-header py-3">
                                        <h6 className="m-0 font-weight-bold text-primary">Activity Details</h6>
                                    </div>
                                    <div className="card-body">
                                        <div className="table-responsive" class="row">
                                            <div class="col-lg-12">
                                                <div className="card mb-4 py-3 border-left-success">
                                                    <div className="card-body">
                                                        <h5>Activity Initiator：<strong>{project.initiator}</strong></h5>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-lg-6">
                                                <div className="card mb-4 py-3 border-left-primary">
                                                    <div className="card-body">
                                                        <h5>Activity Name：<strong>{project.title}</strong><span className="badge badge-info ml-3">Activity Deadline：{ddl}</span></h5>
                                                    </div>
                                                </div>
                                                <div className="card mb-4 py-3 border-left-secondary">
                                                    <div className="card-body">
                                                        <h5>Activity Status：<strong>{state}</strong></h5>
                                                    </div>
                                                </div>

                                            </div>
                                            <div class="col-lg-6">
                                                <div className="card mb-4 py-3 border-left-info">
                                                    <div className="card-body">
                                                        <h5>Activity Deposit：<strong>{project.goalMoney}eth</strong></h5>
                                                    </div>
                                                </div>
                                                <div className="card mb-4 py-3 border-left-warning">
                                                    <div className="card-body">
                                                        <h5>Current Total Deposit：<strong>{project.raisedMoney}eth</strong></h5>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-lg-6">
                                                <div className="card mb-4 py-3 border-left-danger">
                                                    <div className="card-body">
                                                        <h5>Remaining Participators：<strong>{project.usedMoney}</strong></h5>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-lg-6">
                                                <div className="card mb-4 py-3 border-left-warning">
                                                    <div className="card-body">
                                                        <h5>Number of Participators：<strong>{project.fundersLength}</strong></h5>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-lg-12">
                                                <div className="card mb-4 py-3 border-left-dark">
                                                    <div className="card-body">
                                                        <h5>Activity Description：</h5>
                                                        <p>
                                                            <strong>{project.content}</strong>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-lg-6">
                                                <a href="#" className="btn btn-success btn-icon-split" style={{ float: "center" }}
                                                    data-target="#myModal" data-toggle="modal">
                                                    <span className="text">I want to participate</span>
                                                </a>
                                                <div className="modal fade" id="myModal" tabIndex="-1" role="dialog"
                                                    aria-labelledby="myModalLabel" aria-hidden="true">
                                                    <div className="modal-dialog">
                                                        <div className="modal-content">
                                                            <div className="modal-header">
                                                                <h4 className="modal-title" id="myModalLabel">
                                                                    请输入投资金额
                                                                </h4>
                                                                <button type="button" className="close" data-dismiss="modal"
                                                                    aria-hidden="true">
                                                                    &times;
                                                                </button>
                                                            </div>
                                                            <div className="modal-body">
                                                                <input type="number" min="0" className="form-control form-control-user" name="money" value={this.state.money} onChange={this.handleChange} />
                                                            </div>
                                                            <div className="modal-footer">
                                                                <button type="button" className="btn btn-default"
                                                                    data-dismiss="modal">Close
                                                                </button>
                                                                <button type="button" className="btn btn_success" data-dismiss="modal" onClick={this.up}>
                                                                    Confirm participating
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
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

export default punching_detail;