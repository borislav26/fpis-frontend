import { Button } from 'primereact/button'
import React from 'react'

const StavkaRacunaCard = props => {
    const { handleEditStavka, stavka, handleDeleteStavka } = props

    const setEditStavka = e => {
        e.preventDefault()
        handleEditStavka(stavka)
    } 

    const deleteStavka = e => {
        e.preventDefault()
        handleDeleteStavka(stavka)
    }

    return (
        <div>
            <Button onClick={e => e.preventDefault()} style={{width: '100%', display: 'flex', justifyContent: 'space-between'}}>
                <p>{stavka.nazivStavke} - {stavka.brutoCena}</p>
                <div style={{display: 'flex'}}>
                    <Button onClick={setEditStavka} icon="pi pi-pencil" className="p-button-rounded p-button-warning"/>
                    <Button onClick={deleteStavka} icon="pi pi-trash" className="p-button-rounded p-button-danger"/>
                </div>
            </Button>
        </div>
    )
}

export default StavkaRacunaCard