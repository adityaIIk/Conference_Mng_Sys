import React from 'react';
import PropagateLoader from "react-spinners/PropagateLoader";

function Loader({ loading }) {  // Pass loading as a prop
  const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
  };

  return (
    <div style={{marginTop:'150px'}}>
      <div className="sweet-loading">
        <PropagateLoader
          color='#FF9900'
          loading={loading}
          cssOverride={override}
          size={30}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    </div>
  );
}

export default Loader;
