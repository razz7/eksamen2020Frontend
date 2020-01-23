import React, { Component, useState, useEffect } from "react";
import facade from "./apifacade";
import "bootstrap/dist/css/bootstrap.css";
import { NavLink } from "react-router-dom";
const URL = "https://142.93.108.72/exambackend";

export default function App() {
  const [bikes, setBike] = useState([]);
  const inputfield = { input: "" };
  const [search, setSearch] = useState(inputfield);

  useEffect(() => {
    const options = facade.makeOptions("GET", true);
    fetch(URL + "/api/bike/all", options)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        setBike(data);
      });
  }, []);
  const handleInput = evt => {
    const target = evt.target;
    const value = evt.target.value;
    setSearch({ ...search, input: value });

    console.log(search);
  
  };

 // const lowercasedFilter = search.input.toLowerCase();
 // const filteredData = bikes.filter(bike => {
    //return Object.keys(bike).some(key =>
     // bike[key]
     //   .toString()
     //   .toLowerCase()
   //     .includes(lowercasedFilter)
   // );
 // });

  return (
    <div class="container-fluid">
      <h1>Welcome to the online bike rental shop</h1>
    
      <p>Search for bike:</p>

      <form>
        <input
          id="searchTitle"
          placeholder="keyword"
          onChange={handleInput}
          input
        />
      </form>

      <table>
        <thead>
          <tr>
            <th>make</th>
            <th>size</th>
            <th>gears</th>
            <th>genders</th>
            <th>Day Price</th>
  
          </tr>
        </thead>
        <tbody>
      
<tr>
            Test

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


  //  {filteredData.map((bike, i) => (
      //      <tr key={i}>
            //  <td>{bike.make}</td>
          //    <td>{bike.size}</td>
        //      <td>{bike.gears}</td>
      //        <td>{bike.genders}</td>
    //         <td>{bike.day_price}</td>
  //            <td>{bike.gears}</td>
