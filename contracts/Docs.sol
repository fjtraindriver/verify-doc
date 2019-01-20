pragma solidity 0.5.0;

contract Docs {
    uint256 public id;
    Doc[] public docs;

    struct Doc {
        string name;
        string timestamp;
        string hash;
    }
    
    function createDoc(string memory _name, string memory _timestamp, string memory _hash) public {
        docs.push(Doc(_name, _timestamp, _hash));
        id += 1;
    }
}
