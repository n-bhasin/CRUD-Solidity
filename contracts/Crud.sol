pragma solidity ^0.5.16;


contract Crud {
    struct Employee {
        uint256 id;
        string name;
        string designation;
        string company;
    }

    //create struct type array to store values
    Employee[] public employee;
    uint256 nextId = 1;

    function find(uint256 _id) public view returns (uint256) {
        for (uint256 i; i < employee.length; i++) {
            if (employee[i].id == _id) return i;
        }
        revert("User does not exist.");
    }

    function insertEmp(
        string memory _name,
        string memory _designation,
        string memory _company
    ) public {
        employee.push(Employee(nextId, _name, _designation, _company));
        nextId++;
    }

    function readEmpById(uint256 _id)
        public
        view
        returns (uint256, string memory, string memory, string memory)
    {
        uint256 i = find(_id);
        return (
            employee[i].id,
            employee[i].name,
            employee[i].designation,
            employee[i].company
        );
    }

    function updateEmpById(
        uint256 _id,
        string memory _name,
        string memory _designation,
        string memory _company
    ) public {
        uint256 i = find(_id);
        employee[i].name = _name;
        employee[i].designation = _designation;
        employee[i].company = _company;
    }

    function DeleteEmpById(uint256 _id) public returns (uint256) {
        uint256 i = find(_id);
        delete employee[i];
    }
}
