import React from "react";

function Form({ onSubmit, ...otherProps }) {
  function handleSubmit(event) {
    event.preventDefault();
    onSubmit(event);
  }

  return <form onSubmit={handleSubmit} {...otherProps} />;
}

export default Form;
