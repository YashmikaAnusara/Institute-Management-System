import React,{useRef} from 'react'
import Header from '../../components/Headers/TeacherHeader/tHeader'
import * as ReactBootStrap from "react-bootstrap";
import { useState, useEffect } from "react";
import axios from "axios";
import {useReactToPrint} from 'react-to-print';
function ExamReport() {
 // get results from database

  const [results, setResults] = useState([
    {
      examname: "",
      name: "",
      studentID: "",
      result: "",
      grade: "",
    },
  ]);

  useEffect(() => {
    function getResults() {
      axios
        .get("http://localhost:5000/teacher/getResults")
        .then((res) => {
          // console.log(res);
          setResults(res.data);
        })
        .catch((err) => {
          alert(err.message);
        }, []);
    }

    getResults();
  });
  //******************************

  //search function
  const [searchItem,setSearchItem] = useState("");
   const [searchMarks,setSearchMarks] = useState("");

  const renderResults = (results, index) => {
    return (
      <tr key={index}>
        <td>{results.studentID}</td>
        <td>{results.name}</td>
        <td>{results.result}</td>
        <td>{results.grade}</td>
        {/* <td>{results.examname}</td> */}
      </tr>
    );
  };

  const printref = useRef();
  const handlePrint = useReactToPrint({
    content : ()=>printref.current,
  });

    return (
        <div>
            <Header/>
            <button style={{width:'250px',height:'40px',marginLeft:'80%',marginTop:'2%',backgroundColor:'thistle'}} onClick={handlePrint}>Download</button>
          <div ref={printref}>
           <div>
                <input placeholder="Exam name" style={{marginLeft:'70px',marginTop:'5px',width:'300px',height:'30px'}} onChange={(event) => {setSearchItem(event.target.value)}}/>


           </div>
            
            
            <div style={{marginLeft:"42%",width:'230px'}}>
                <h4 style={{ textAlign:'center',marginTop:'20px' }}>Select mark range</h4><br/>
                <label >From</label>
                <input style={{width:"70px",marginLeft:'10px'}} onChange={(event) => {setSearchMarks(event.target.value)}}/>
                <label style={{ marginLeft:'15px' }}>To</label>
                <input style={{width:"70px",marginLeft:'10px'}}/>

               <input type="submit" value="Genarate"  style={{marginTop:'20px',width:'230px',backgroundColor:'springgreen'}}/> 
            </div>
            

             {/* result table */}
      <ReactBootStrap.Table
        striped
        bordered
        hover
        style={{ marginLeft: "150px", width: "80%", marginTop: "20px" }}
      >
        <thead className="tHead">
          <tr>
            <th >Student ID</th>
            <th>Student Name</th>
            <th>Result</th>
            <th>Grade</th>

            {/* <th>examname</th> */}
            
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
      </div>

        </div>
    )
}

export default ExamReport
