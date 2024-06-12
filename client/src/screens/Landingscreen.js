import React from 'react'
import { Link } from 'react-router-dom'

function Landingscreen() {
  return (
    <div className='row landing justify-content-center'>
        <div className='col-md-9 my-auto text-center' style={{borderRight: '8px solid black'}}>
            <h2 style={{color: '#00008b' , fontSize: '130px'}}>Indian<span style={{color: '#F08000'}}>Oil</span></h2>
            <h1 style={{color: 'black'}}>Welcome to Conference Room!</h1>

            <Link to='/home'>
            <button className='btn btn-primary mt-3'>Get Started</button>
            </Link>
        </div>
    </div>
  )
}

export default Landingscreen