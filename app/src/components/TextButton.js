import React from 'react';

import { Button } from 'rimble-ui';

function logWarning() {
  console.log("No onClick handler passed")
}

export default function TextButton ({ text="Submit", onClick=null, disabled=false, style={} }) {
  return (
    <Button 
      size={'medium'}
      onClick={ onClick ? onClick : () => console.log("no handler passed") }
      disabled={disabled}
    > 
      {text}
    </Button>
  )
}