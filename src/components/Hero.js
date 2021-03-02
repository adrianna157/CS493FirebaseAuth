
import React, { useState,useEffect } from "react";
import {
  Card,
  CardFooter,
  Image,
  CardBody,
  FillButton,
  OutlineButton,
  Container
} from "tailwind-react-ui";
import axios from "axios";

//https://3przfr4na4.execute-api.us-east-1.amazonaws.com/dev/song
//uppwgi12a2.execute-api.us-west-2.amazonaws.com/get_songs



const Hero = ({ handleLogout }) => {
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState('');

  useEffect(() => {
    fetch("https://3przfr4na4.execute-api.us-east-1.amazonaws.com/dev/song")
      .then((response) => response.json())
      .then((data) => {
        setUrl(data.urls);
      });
  })

    const submitFile = async () => {
      try {
        if (!file) {
          throw new Error("Select a file first!");
        }
        const formData = new FormData();
        formData.append("file", file[0]);
        await axios.post(`/test-upload`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        // handle success
      } catch (error) {
        // handle error
      }
    };
  



    
    return (
      <section className="hero">
        <nav>
          <h2>Welcome</h2>
          <button onClick={handleLogout}>Logout</button>
        </nav>
        <label className="text-white">Artists</label>
        <div className="flex justify-center">
          {/* <form onSubmit={submitFile} className="text-white"> */}

          <div class="md:w-3/12 rounded overflow-hidden shadow-lg my-2  bg-white ">
            <div class="px- py-4 ">
              <div class="font-bold text-xl mb-2">Artist 1</div>
              <p class="text-grey-darker text-base">Place Holder</p>
            </div>
            <div class="px-6 py-4"></div>
          </div>
        </div>

        <div className="flex justify-center">
          {/* <form onSubmit={submitFile} className="text-white"> */}

          <div class="md:w-3/12 rounded overflow-hidden shadow-lg mt-6  bg-white ">
            <div class="px- py-4 ">
              <div class="font-bold text-xl mb-2">Artist 2</div>
              <p class="text-grey-darker text-base">Place Holder</p>
            </div>
            <div class="px-6 py-4"></div>
          </div>
        </div>

        {/* <input
            type="file"
            onChange={(event) => setFile(event.target.files)}
          />
          <div>
            <button className="bg-purple-500 md:w-20" type="submit">
              Send
            </button> */}
        {/* </div> */}
        {/* </form> */}
      </section>
    );
};

export default Hero;