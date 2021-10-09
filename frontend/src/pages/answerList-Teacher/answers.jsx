import React from "react";
import Header from "../../components/Headers/TeacherHeader/tHeader";
import "./answers.css";
import axios from "axios";
import Button from "@material-ui/core/Button";
import { useState, useEffect } from "react";
import * as ReactBootStrap from "react-bootstrap";
import Popup from "../../components/Popup/AddResults-popup/addResultsPop";
import "../ResultsList-Teacher/resultList.css";
import AddCircleIcon from "@material-ui/icons/AddCircle";

function Answers() {
  const [buttonPopUp, setButtonPopUp] = useState(false);
   //search function
  const [searchItem,setSearchItem] = useState("");

  const [err,setErr]=useState("");
  const [err2,setErr2]=useState("");

 

  // Add reults to the mongoDB

  const [input, setInput] = useState({
    examname: "",
    name: "",
    studentID: "",
    result: "",
    grade: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setInput((prevInput) => {
      return {
        ...prevInput,
        [name]: value,
      };
    });
  }
   const Validation = ()=>{
        if(input.studentID == ''){
           setErr2('Connot be empty!')
            return false;
        }
        else if(input.result > 100){
            setErr('Please give valid results')
            return false;
        }
        else{
            return true
        }    
    }

  function handleClick(event) {
    //  event.preventDefault();
    console.log(input);

    const newResult = {
      examname: input.examname,
      name: input.name,
      studentID: input.studentID,
      result: input.result,
      grade: input.grade,
    };
    
    const IsTrue = Validation()
    if(IsTrue==false){
            event.preventDefault();
        }
        else{ 

    axios.post("http://localhost:5000/teacher/addResults", newResult);
  

    setInput({
      examname: input.examname,
      name: "",
      studentID: "",
      result: "",
      grade: "",
    });
  }
  }
  // get answers from database

  const [results, setResults] = useState([
    {
      examname: "",
      name: "",
      content: "",
    },
  ]);

  useEffect(() => {
    function getAnswer() {
      axios
        .get("http://localhost:5000/answer/getAnswer")
        .then((res) => {
          console.log(res);
          setResults(res.data);
        })
        .catch((err) => {
          alert(err.message);
        }, []);
    }

    getAnswer();
  }, []);
  const renderResults = (results, index) => {
    return (
      <tr key={index}>
        <td>{results.examname}</td>
        <td>{results.name}</td>
        <td style={{ width: "150px" }}>
          <a href={results.content} style={{ textDecoration: "none" }}>
            <Button variant="contained" color="green">
              Download
            </Button>
          </a>
        </td>

        <td style={{ width: "120px" }}>
          <AddCircleIcon
            onClick={() => setButtonPopUp(true)}
            style={{
              fontSize: "30px",
              color: "#27AE60",
              float: "right",
              marginTop: "10px",
              marginRight: "35%",
            }}
          />
        </td>
      </tr>
    );
  };

  return (
    <div>
      <Header />

      <div
        style={{
          background: "#8CA6FE",
          marginTop: "20px",
          height: "50px",
          width: "80%",
          marginLeft: "150px",
          color: "white",
        }}
      >
        <h2 style={{ padding: "5px" }}>Answers List</h2>
      </div>

      <div
        style={{ marginLeft: "150px", marginRight: "190px", marginTop: "20px" }}
      >
        <label style={{ paddingRight: "50px", fontWeight: "bold" }} >
          Exam Name
        </label>
        <input type="text" onChange={(event) => {setSearchItem(event.target.value)}}/>
        <br />
      </div>

      {/* result table */}
      <ReactBootStrap.Table
        striped
        bordered
        hover
        style={{ marginLeft: "390px", width: "50%", marginTop: "20px" }}
      >
        <thead className="tHead">
          <tr>
            <th>Exam Name</th>
            <th>Student Name</th>
            <th>Answer</th>
            <th>Add Results</th>
          </tr>
        </thead>
        <tbody>{results.filter((val)=>{
          if(searchItem == ""){
            return val;
          }else if(val.examname.toLocaleLowerCase().includes(searchItem.toLocaleLowerCase())){
            return val;
          }
            }).map(renderResults)}</tbody>
      </ReactBootStrap.Table>

      
      {/* add results popup */}
      <Popup trigger={buttonPopUp} setTrigger={setButtonPopUp}>
        <h3 style={{ textAlign: "center" }}>Add result</h3>
        <hr />

        <label>Exam name</label>
        <br />
        <input
          onChange={handleChange}
          name="examname"
          value={input.examname}
          className="inputArea"
          type="text"
        />
        <br />

        <label>Student name</label>
        <br />
        <input
          onChange={handleChange}
          name="name"
          value={input.name}
          className="inputArea"
          type="text"
        />
        <br />

        <label>Student ID</label>
        <br />
        <input
          onChange={handleChange}
          name="studentID"
          value={input.studentID}
          className="inputArea"
          type="text"
        /><span style={{color:'red'}}>{err2}</span>
        <br />

        <label>Result</label>
        <br />
        <input
          onChange={handleChange}
          name="result"
          value={input.result}
          className="inputArea"
          type="text"
          required
        /><span style={{color:'red'}}>{err}</span>
        <br />

        <label>Grade</label>
        <br />
        <input
          onChange={handleChange}
          name="grade"
          value={input.grade}
          className="inputArea"
          type="text"
        />
        <br />
        <br />

        <button onClick={handleClick} className="add_btn">
          Add
        </button>
      </Popup>
    </div>
  );
}

export default Answers;
