import React from 'react'
import { ConfirmDialog } from 'primereact/confirmdialog'
import axios from 'axios'

const DeleteModal = props => {
    const {visible, setVisible, messageDialog, obavestenjeID} = props

    const closeDeleteDialog = () => {
        setVisible(false)
    }
 
    const deleteObavestenje = async () => {
        const { data } = await axios.delete(`http://localhost:5000/obavestenja-o-svim-izvrsenim-uplatama/delete/${obavestenjeID}`)
        if (data.error != null) {
            messageDialog.current.show({
                severity:'error', 
                summary:'Greska prilikom brisanja', 
                detail: data.error.message, 
                life: 6000
            })
            setVisible(false)
            return
        }
        messageDialog.current.show({
            severity:'success', 
            summary:'Uspesna akcija', 
            detail: 'Uspesno je obrisano izabrano obavestenje o svim izvrsenim uplatama', 
            life: 6000
        })
        setVisible(false)
    }

    return (
        <ConfirmDialog 
            visible={visible} 
            onHide={closeDeleteDialog} 
            message="Da li ste sigurni da zelite da izbrisete obavestenje?"
            header="Brisanje obavestenja o svim izvrsenim uplatama" 
            accept={deleteObavestenje} 
            reject={closeDeleteDialog}
            acceptLabel='Da'
            rejectLabel='Ne'
            icon='pi pi-trash'
        />
    )
}

export default DeleteModal