import React, { useContext } from 'react'
import { ConfirmDialog } from 'primereact/confirmdialog'
import axios from 'axios'

const SlozenDeleteModal = props => {
        const { visible, setVisible, racunSaBrutoCenom, messageDialog } = props

        const hideDeleteDialog = () => {
            setVisible(false)
        }

        const deleteRacunSaBrutoCenom = async () => {
            const { data } = await axios.delete(`http://localhost:5000/racuni-sa-bruto-cenom/delete/${racunSaBrutoCenom.brojRacuna}`)
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
                detail: 'Uspesno je obrisan racun sa bruto cenom', 
                life: 6000
            })
            setVisible(false)
        }

        return (
            <ConfirmDialog 
                visible={visible} 
                onHide={hideDeleteDialog} 
                message="Da li ste sigurni da zelite da izbrisete racun sa bruto cenom?"
                header="Brisanje racuna sa bruto cenom" 
                accept={deleteRacunSaBrutoCenom} 
                reject={hideDeleteDialog}
                acceptLabel='Da'
                rejectLabel='Ne'
                icon='pi pi-trash'
            />
        )
}

export default SlozenDeleteModal