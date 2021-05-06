import React, { useRef, useEffect } from 'react'

function SearchByPincode({ setPincode }) {
    const inputRef = useRef(null);

    // To add focus for the first time when this component is rendered
    useEffect(() => {
        // inputRef.current.focus();
    }, [])

    // Handling of input whenever user types something in input box
    const onInputChange = (event) => {
        let inputValue = event.target.value.trim();
        if ( inputValue !== '' && inputValue.length === 6) {
            setPincode(inputValue);
        }
    }

    return (
        <div>
            <div className="searchBox">
                <input onKeyDown={onInputChange} ref={inputRef} placeholder='Enter Pincode' />
            </div>
        </div>

    )
}

export default SearchByPincode
