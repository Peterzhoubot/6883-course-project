pragma solidity >=0.4.21 <0.7.0;

contract punching{
    struct punching{
        address payable initiator;
        string title;
        string content;
        uint goalMoney;
        uint raisedMoney;
        uint usedMoney;
        uint deadline;
        bool isSuccess;
        uint UsersLength;
        uint proposalsLength;
        mapping(uint => User) Users;
        mapping(uint => Proposal) proposals;
    }

    struct User{
        address payable add;
        uint cost;
    }

    uint public allpunchingsLength;
    mapping(uint => punching) public allpunchings;

    struct Proposal{
        string content;
        uint amount;
        uint agreeAmount;
        uint disAmount;
        uint goal;
        mapping(uint => uint) states;
        bool isAgreed;
    }
    
    function participate(uint _punchId) public payable {
        require(msg.value>0);
        require(now<=allpunchings[_punchId].deadline);
        punching storage punching = allpunchings[_punchId];
        uint UserNum = punching.UsersLength + 1;
        punching.UsersLength += 1;
        User storage User = punching.Users[UserNum];
        User.add = msg.sender;
        User.cost = msg.value;
        punching.raisedMoney += msg.value;
        if(punching.raisedMoney >= punching.goalMoney)punching.isSuccess=true;
    }

    function createpunching(address payable _initiator, string memory _title, string memory _content, uint _goalMoney, uint _remainingtime) public returns(uint) {
        uint num = allpunchingsLength;
        allpunchingsLength+=1;
        punching storage punching = allpunchings[num];
        punching.initiator = _initiator;
        punching.title = _title;
        punching.content = _content;
        punching.goalMoney = _goalMoney;
        punching.raisedMoney = 0;
        punching.deadline = _remainingtime + now;
        return num;
    }

    function createProposal(uint _punchId, string memory _content, uint _amount) public {
        punching storage punching = allpunchings[_punchId];
        require(punching.initiator == msg.sender);
        uint proNum = punching.proposalsLength + 1;
        punching.proposalsLength+=1;
        Proposal storage proposal = punching.proposals[proNum];
        proposal.content = _content;
        proposal.amount = _amount;
        proposal.goal = punching.raisedMoney / 2;
    }

    function agreeProposal(uint _punchId, uint _proposalId, bool _isAgree) public UserOfpunching(_punchId){
        punching storage punching = allpunchings[_punchId];
        require(_proposalId>=1 && _punchId<=punching.proposalsLength);
        Proposal storage proposal = punching.proposals[_proposalId];
        for(uint i = 1; i<=punching.UsersLength;i++){
            User memory User = punching.Users[i];
            if(User.add==msg.sender){
                if(_isAgree){
                    proposal.states[i]=1;
                    proposal.agreeAmount += User.cost;
                }
                else{
                    proposal.states[i]=2;
                    proposal.disAmount += User.cost;
                }
            }
        }
        if(proposal.agreeAmount >= proposal.goal){
            proposal.isAgreed = true;
            punching.initiator.transfer(proposal.amount);
            punching.usedMoney += proposal.amount;
        }
        else if(proposal.disAmount >=proposal.goal){
            proposal.isAgreed = false;
        }
    }

    function getProposal(uint _punchId, uint _proposalId) public view returns(string memory, uint, uint, uint, uint, bool) {
        require(_punchId>=0 && _punchId<=allpunchingsLength);
        punching storage punching = allpunchings[_punchId];
        require(_proposalId>=1 && _punchId<=punching.proposalsLength);
        Proposal storage proposal = punching.proposals[_proposalId];
        return (proposal.content, proposal.amount, proposal.agreeAmount, proposal.disAmount, proposal.goal, proposal.isAgreed);
    }

    function getProposalsLength(uint _punchId) public view returns(uint){
        return allpunchings[_punchId].proposalsLength;
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    modifier UserOfpunching(uint _punchId){
        require(_punchId>=0 && _punchId<=allpunchingsLength);
        punching storage punching = allpunchings[_punchId];
        bool isIn = false;
        for(uint i = 1; i<=punching.UsersLength;i++){
            User memory User = punching.Users[i];
            if(User.add==msg.sender)
            isIn = true;
        }
        require(isIn == true);
        _;
    }
    
    function getMypunchings(uint _punchId) public view returns(uint){
        uint money=0;
        punching storage punching = allpunchings[_punchId];
        for(uint j=1;j<=punching.UsersLength;j++){
            User memory User = punching.Users[j];
            if(User.add==msg.sender)
            money+=User.cost;
        }
        return money;
    }
    
    function getMyInitpunchings(uint _punchId) public view returns(bool){
        return (allpunchings[_punchId].initiator == msg.sender ? true:false);
    }
}
