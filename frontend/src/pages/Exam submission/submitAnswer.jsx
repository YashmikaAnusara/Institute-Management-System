import React from "react";
import Header from "../../components/Header/Header";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import { Link, useParams } from "react-router-dom";
import "./submitAnswer.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {useHistory} from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(0.5),
    },
  },
}));

function SubmitAnswer(props) {
  const { _id } = useParams();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const dispatch = useDispatch();

  const history = useHistory();


  //get exam details
  const [exams, setExam] = useState([
    {
      examname: "",
      classID: "",
      type: "",
      date: "",
      start: "",
      end: "",
      content: "",
    },
  ]);

  useEffect(() => {
    function getExams() {
      axios
        .get(`http://localhost:5000/exam/getExams/${_id}`)
        .then((res) => {

          setExam(res.data);
        })
        .catch((err) => {
          alert(err.message);
        }, []);
    }

    getExams();
  }, []);
  //******************************

  
  //get start time

  const[sdate, setDate] = useState(10);
  const[shours, setHours] = useState(10);
  const[sminutes, setMinutes] = useState(10);
  const[ssconds, setSeconds] = useState(10);

  const countdown = () =>{
    const endTime = new Date("2022 00:00:30").getTime();
    const nowTime = new Date().getTime();

    //console.log(endTime);

    const timeDiff = endTime - nowTime;
    
    const sec = 1000;
    const min = sec * 60;
    const hou = min * 60;
    const day = hou * 24;

    let timeday = Math.floor(timeDiff/day)
    let timeHour = Math.floor((timeDiff % day)/hou)
    let timeMinutes = Math.floor((timeDiff % hou)/min)
    let timeSecond = Math.floor((timeDiff % min)/ sec);

    timeday = timeday < 10 ? "0" + timeday : timeday
    timeHour = timeHour < 10 ? "0" + timeHour : timeHour
    timeMinutes = timeMinutes < 10 ? "0" + timeMinutes : timeMinutes
    timeSecond = timeSecond < 10 ? "0" + timeSecond : timeSecond

    setDate(timeday)
    setHours(timeHour);
    setMinutes(timeMinutes);
    setSeconds(timeSecond);
  }

  useEffect(()=>{
    setInterval(countdown,1000)
  },[])

  var startTime = exams[0].start;
  var splitStart = startTime.split(":"); // split it at the colons
  // minutes are worth 60 seconds. Hours are worth 60 minutes.
  var startSec = +splitStart[0] * 60 * 60 + +splitStart[1] * 60;

  //get end time
  var EndTime = exams[0].end;
  var splitend = EndTime.split(":"); // split it at the colons
  // minutes are worth 60 seconds. Hours are worth 60 minutes.
  var endSec = +splitend[0] * 60 * 60 + +splitend[1] * 60;

  //get time deference
  var timedef = endSec - startSec;
  //convert in to format
  var hours = Math.floor(timedef / 60 / 60);
  var minutes = Math.floor((timedef - hours * 60 * 60) / 60);


  

  const [content, setComponent] = useState(
    "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
  );

  //send photo to cloud
  const postDetails = (pics) => {
    if (!pics) {
      return setComponent("Please Select an Image");
    }
    setComponent(null);

    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "GlobalEducation");
      data.append("cloud_name", "desnqqj6a");
      fetch("https://api.cloudinary.com/v1_1/desnqqj6a/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setComponent(data.url.toString());
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      return setComponent("Please select an Image");
    }
  };
  const examname = exams[0].examname;
  const name = userInfo?.name
  function sendData(e) {
    // e.preventDefault();

    const newAnswer ={
      content,
      examname,
      name
    }

    axios
      .post("http://localhost:5000/answer/addAnswer",newAnswer)
      .then((res) => {
        alert("Answer Submited!");
        console.log(res);
      })
      .catch((err) => {
        alert(err);
      });
    history.push("/student/exams");

  }
  

  const classes = useStyles();
  return (
    <div>
      <Header />

      <div>
        <h2 style={{ marginTop: "50px", marginLeft: "150px" }}>
          {exams[0].examname}
        </h2>
        <h5 style={{ marginLeft: "150px", color: "GrayText" }}>
          Maximum Time : {hours + "h" + " . " + minutes + "min"}
        </h5>

        <div style={{ float: "right", marginRight: "165px", marginTop: "-75px",width:'200px',height:'100px',border:'1px solid' }}>
          <h5 style={{textAlign:'center',marginTop:'10px'}}>Time Left</h5>
            <p style={{color:'#2ECC71',fontSize:'30px',textAlign:'center'}}>
              {shours}:{sminutes}:{ssconds}
            </p>
        </div >
     
        <div className={classes.root}>
          <a
            href={exams[0].content}
            style={{ textDecoration: "none", float: "left" }}
          >
            <Button
              variant="outlined"
              color="secondary"
              style={{ marginLeft: "150px", marginTop: "35px" }}
            >
              Download Paper
            </Button>
          </a>
        </div>
        <form onSubmit={sendData}>
          <div className="form-group files">
            <input
              type="file"
              className="form-control"
              onChange={(e) => {
                postDetails(e.target.files[0]);
              }}
            />
          </div>
          <button
            style={{
              float: "right",
              marginRight: "155px",
              marginTop: "20px",
              backgroundColor: "#FFAF0F",
              width: "150px",
              height: "40px",
              color: "white",
              fontSize: "20px",
            }}
            type="submit"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default SubmitAnswer;
