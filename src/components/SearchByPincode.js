import React, { useRef, useEffect} from 'react'

function SearchByPincode({setPincode}) {
const inputRef = useRef(null);

// To add focus for the first time when this component is rendered
useEffect(() => {
    inputRef.current.focus();
}, [])

 // Handling of input whenever user types something in input box
 const onInputChange = (event) => {
    let inputValue = event.target.value.trim();
    // Whenever user hit enter then fetchGifData action is getting triggered
    if (event.keyCode === 13 && inputValue !== '' && inputValue.length === 6) {
        setPincode(inputValue);
        // fetchGifData(event.target.value.trim());
    }
}

    return (
        <div className="searchBox">
            <input onKeyDown={onInputChange} ref={inputRef} placeholder='Type a 6 letter pincode and Hit Enter' />
        </div>
    )
}

export default SearchByPincode
