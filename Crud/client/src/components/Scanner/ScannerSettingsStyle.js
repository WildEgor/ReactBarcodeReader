import chroma from 'chroma-js'

const scannerSettings = {
    wrapper: {
        display: "flex",
        flexDirection: "row",
        margin: "0 auto"
    }
}

const dot = (color = '#ccc') => ({
    alignItems: 'center',
    display: 'flex',
  
    ':before': {
      backgroundColor: color,
      borderRadius: 10,
      content: '" "',
      display: 'block',
      marginRight: 8,
      height: 10,
      width: 10,
    },
  });

const colourStyles = {
    control: styles => ({ ...styles, backgroundColor: 'white' }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      const color = chroma('pink');
      return {
        ...styles,
        backgroundColor: isDisabled
          ? null
          : isSelected
          ? color
          : isFocused
          ? color.alpha(0.7).css()
          : null,
          color: isDisabled
          ? '#ccc'
          : isSelected
          ? chroma.contrast(color, 'white') > 2
            ? 'white'
            : 'black'
          : data.color,
        cursor: isDisabled ? 'not-allowed' : 'default',
  
        ':active': {
          ...styles[':active'],
          backgroundColor: !isDisabled && (isSelected ? color.alpha(0.5).css() : color.alpha(0.6).css()),
        },
      };
    },
    input: styles => ({ ...styles, ...dot() }),
    placeholder: styles => ({ ...styles, ...dot() }),
    singleValue: (styles, { data }) => ({ ...styles, ...dot(data.color) }),
  };

export {
    scannerSettings,
    colourStyles 
}
