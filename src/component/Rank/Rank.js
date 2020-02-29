import React from "react";

const Rank = ({name, entries}) => {
  return (
    <div>
      <div className="white f3">
        {`Hi ${name}- your rank is..`}
        <div className="white f1">{entries}</div>
      </div>
    </div>
  );
};

export default Rank;
