import React from 'react';

import { Button } from 'rimble-ui';

function logWarning() {
  console.log("No onClick handler passed")
}

export default function TextButton ({ text="Submit", onClick=null, disabled=false, size='medium', variant=null, 
                                      icon=null, iconpos=null, style={} }) {
  return (
    <Button 
      onClick={ onClick ? onClick : () => console.log("no handler passed") }
      disabled={disabled}
      size={size}
      variant={variant}
      icon={icon}
      iconpos={iconpos}
      style={style}
    > 
      {text}
    </Button>
  )
}