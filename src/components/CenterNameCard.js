import React from 'react'

const CenterNameCard = ({name,infoObject}) => {
    
    return (
        <div>
            <p>{name}</p>
            <p>{infoObject.address}, {infoObject.district_name},{infoObject.state}, {infoObject.pincode} </p>
            <p>{infoObject.fee_type}</p>
        </div>
    )
}

export default CenterNameCard
