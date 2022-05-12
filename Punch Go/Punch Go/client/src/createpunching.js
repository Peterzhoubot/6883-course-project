import React, { Component } from "react";
import { Link } from "react-router-dom";
import ReactDOM from 'react-dom';
import getWeb3 from "./getWeb3";
import punchingContract from "./contracts/punching.json";
let punchingInstance = require('./eth/punching')
let web3 = require('./utils/InitWeb3');
class createpunching extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            Name: "",
            Amount: 0,
            deadline: "",
            overview: "",
            // account: "",
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
    async up() {
        if (this.state.Name === "" || this.state.Amount === "" || this.state.deadline === "" || this.state.overview === "") {
            alert('Please fill in every blanks in the form!')
        }
        else {
            let timestamp = new Date(this.state.deadline).getTime();
            console.log(timestamp);
            let a = (new Date()).toLocaleDateString();//获取当前日期
            a = a.replace(/\//g, '-');
            let current_date = (new Date(a));//把当前日期变成时间戳
            console.log(current_date)
            if (current_date - timestamp >= 0) {
                alert('Please select valid deadline!')
            }
            else {
                let amount = web3.utils.toWei(this.state.Amount, 'ether')
                console.log(amount)
                let accounts = await web3.eth.getAccounts()
                await punchingInstance.methods.createpunching(accounts[0], this.state.Name, this.state.overview, amount, timestamp).send({
                    from: accounts[0]
                })
                alert('Congratulations, punch is initiated successfully!')
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
                            <li class="nav-item">
                                <Link className="nav-link" to='/allpunchings'>
                                    <i className="fas fa-fw fa-calendar" />
                                    <span>All Punches</span>
                                </Link>
                            </li>
                            <li class="nav-item active">
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

                    

                    <div className="card o-hidden border-0 shadow-lg my-5 col-12">
                        <div className="card-body p-0">
                            <div className="row">
                                <div className="col-lg-3 d-none d-lg-block" />
                                <div className="col-lg-6">
                                    <div className="p-5" id="user">
                                        <div className="text-center">
                                            <h1 className="h4 text-gray-900 mb-4">Initiate a Punch</h1>
                                        </div>
                                        <form className="user">
                                            <div className="form-group row">
                                                <div className="col-sm-6 mb-3 mb-sm-0">
                                                    <input type="text" className="form-control form-control-user" name="Name" placeholder="Activity Name" value={this.state.Name} onChange={this.handleChange} />
                                                </div>
                                                <div className="col-sm-6">
                                                    <input type="number" min="0" className="form-control form-control-user" name="Amount" placeholder="Activity Deposit" value={this.state.Amount} onChange={this.handleChange} />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="name">Activity Deadline</label>
                                                <input type="date" className="form-control form-control-user" name="deadline" value={this.state.deadline} onChange={this.handleChange} />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="name">Activity Description</label>
                                                <textarea className="form-control" rows="5" name="overview" value={this.state.overview} onChange={this.handleChange} />
                                            </div>
                                            <a className="btn btn-success btn-user btn-block" type='submit' onClick={this.up}>
                                                Confirm
                                            </a>
                                        </form>

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

export default createpunching;