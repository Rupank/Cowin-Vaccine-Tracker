import React from 'react'

export default function VaccineAvailablityCard({card}) {
    if(!card){
        return (<div>NA</div>)
    }
    return (
        <div>
            <p>{card.available_capacity}</p>
            <p>{card.vaccine}</p>
        </div>
    )
}

